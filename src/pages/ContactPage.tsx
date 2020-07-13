import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import API, { CancelToken } from "../service/api";
import { Modal, Button } from "antd";
import ContactForm, { FormValues } from "../components/Contact/ContactForm";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useStores } from "../stores";
import { Contact, ContactInfos } from "../types";
import ClassName from "../utils/classname";
import styles from "./ContactPage.module.scss";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Axios, { CancelTokenSource } from "axios";

const ContactPage = () => {
  const { ContactStore } = useStores();
  const { contactId } = useParams();
  const history = useHistory();

  const methods = useForm<FormValues>();
  const [isUploadingPicture, setIsUploadingPicture] = useState<boolean>(false);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [contact, setContact] = useState<Contact | null>(null);

  const fetchCancelToken = useRef<CancelTokenSource | null>(null);
  const updateCancelToken = useRef<CancelTokenSource | null>(null);
  const deleteCancelToken = useRef<CancelTokenSource | null>(null);

  const formRef = React.createRef<HTMLFormElement>();

  ///////////////////////////////////////////
  // Form methods
  ///////////////////////////////////////////

  const resetForm = useCallback(
    (contact: Contact) => {
      methods.reset({
        pictureId: contact.pictureId,
        name: contact.name,
        jobTitle: contact.jobTitle,
        email: contact.email,
        address: contact.address,
        phoneNumbers: contact.phoneNumbers.map((a: string) => ({
          text: a,
        })),
      });
    },
    [methods]
  );

  const formValuesToContactInfos = (data: FormValues) => ({
    pictureId: data.pictureId,
    name: data.name,
    jobTitle: data.jobTitle,
    email: data.email,
    address: data.address,
    phoneNumbers:
      data.phoneNumbers?.map((a) => a.text).filter((a) => !!a) ?? [], // take only non-empty phone numbers
  });

  ///////////////////////////////////////////
  // Network
  ///////////////////////////////////////////
  const fetch = useCallback(
    async (contactId: string) => {
      if (!contactId || isFetching || isDeleting || isUpdating) {
        return;
      }

      setIsFetching(true);

      try {
        fetchCancelToken.current = CancelToken.source();
        const response = await API.contact.getContact(contactId, {
          cancelToken: fetchCancelToken.current.token,
        });
        const { contact } = response.data;

        setContact(contact);
        resetForm(contact);

        setIsFetching(false);
      } catch (e) {
        if (!Axios.isCancel(e)) {
          // 404 error
          if (e?.response?.status === 404) {
            Modal.error({
              title: "This contact does not exist",
              okText: "Go back",
              onOk: () => {
                setIsFetching(false);
                history.push("/");
              },
            });
          } else {
            // Generic error
            Modal.error({
              title: "An error occured while fetching the contact",

              okText: "Go back",
              onOk: () => {
                setIsFetching(false);
                history.push("/");
              },
            });
          }
        }
      } finally {
        fetchCancelToken.current = null;
      }
    },
    [isFetching, isDeleting, isUpdating, history, resetForm]
  );

  const update = async (contactId: string, contactInfos: ContactInfos) => {
    if (!contactId || !contactInfos || isFetching || isDeleting || isUpdating) {
      return;
    }

    methods.clearErrors();
    const validated = await methods.trigger();
    if (!validated) {
      return;
    }

    setIsUpdating(true);

    try {
      updateCancelToken.current = CancelToken.source();
      const response = await API.contact.updateContact(
        contactId,
        contactInfos,
        { cancelToken: updateCancelToken.current.token }
      );
      const { contact } = response.data;

      setContact(contact);
      resetForm(contact);
      ContactStore.updateContact(contact);

      history.push(`/`);
      setIsUpdating(false);
    } catch (e) {
      if (!Axios.isCancel(e)) {
        // 404 Error
        if (e?.response?.status === 404) {
          Modal.error({
            title: "This contact does not exist",
            okText: "Go back",
            onOk: () => {
              setIsUpdating(false);
              history.push("/");
            },
          });
        } else {
          // Generic Error
          Modal.error({
            title: "An error occured while updating the contact",
            okText: "Go back",
            onOk: () => {
              setIsUpdating(false);
              history.push("/");
            },
          });
        }
      }
    } finally {
      updateCancelToken.current = null;
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!contactId || isFetching || isDeleting || isUpdating) {
      return;
    }

    setIsDeleting(true);

    try {
      deleteCancelToken.current = CancelToken.source();
      await API.contact.deleteContact(contactId, {
        cancelToken: deleteCancelToken.current.token,
      });
      ContactStore.removeContact(contactId);

      setIsDeleting(false);
      history.replace(`/`);
    } catch (e) {
      if (!Axios.isCancel(e)) {
        // 404 error
        if (e?.response?.status === 404) {
          Modal.error({
            title: "This contact does not exist",
            okText: "Go back",
            onOk: () => {
              setIsDeleting(false);
              history.push("/");
            },
          });
        } else {
          // Generic error
          Modal.error({
            title: "An error occured while deleting the contact",
            okText: "Go back",
            onOk: () => {
              setIsDeleting(false);
              history.push("/");
            },
          });
        }
      }
    } finally {
      deleteCancelToken.current = null;
    }
  };

  ///////////////////////////////////////////
  // Effects
  ///////////////////////////////////////////
  useEffect(() => {
    if (contactId && !contact) {
      fetch(contactId);
    }
  }, [contactId, contact, fetch]);

  useEffect(() => {
    return () => {
      fetchCancelToken.current?.cancel();
      updateCancelToken.current?.cancel();
      deleteCancelToken.current?.cancel();
    };
  }, []);

  ///////////////////////////////////////////
  // ContactForm Cb
  ///////////////////////////////////////////
  const handleUploadPictureChange = (_isUploadingPicture: boolean) => {
    setIsUploadingPicture(_isUploadingPicture);
  };

  ///////////////////////////////////////////
  // Toolbar Cb
  ///////////////////////////////////////////

  const handleBackClick = () => {
    history.push("/");
  };

  const handleSubmitClick = () => {
    formRef.current?.dispatchEvent(new Event("submit"));
  };

  const handleSubmit: SubmitHandler<FormValues> = (data, e) => {
    const contactInfos = formValuesToContactInfos(data);
    update(contactId, contactInfos);
  };

  const handleDeleteClick = () => {
    deleteContact(contactId);
  };

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  const toolbarCn = ClassName(styles, "contact-page-toolbar");

  const renderToolbarTitle = () => {
    if (isFetching) {
      return <span>Loading contact...</span>;
    }

    if (!contactId) {
      return "New contact";
    }

    return <i>{contact?.name}</i>;
  };

  const renderToolbarButtons = () => {
    return (
      <>
        <Button
          type="primary"
          onClick={handleSubmitClick}
          disabled={
            isFetching || isUpdating || isDeleting || isUploadingPicture
          }
          loading={isUpdating}
        >
          Save
        </Button>
        <Button
          disabled={
            isFetching || isUpdating || isDeleting || isUploadingPicture
          }
          loading={isDeleting}
          onClick={handleDeleteClick}
        >
          Delete
        </Button>
      </>
    );
  };

  return (
    <FormProvider {...methods}>
      <div data-testid="contact-page">
        <div className="container">
          <div>
            <form ref={formRef} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="toolbar">
                <div className={toolbarCn()}>
                  <Button
                    icon={<ArrowLeftOutlined />}
                    size="small"
                    className={toolbarCn("back-button")}
                    onClick={handleBackClick}
                  />
                  <h3 className={toolbarCn("title")}>{renderToolbarTitle()}</h3>

                  <div className={toolbarCn("buttons")}>
                    {renderToolbarButtons()}
                  </div>
                </div>
              </div>
              <div>
                <ContactForm
                  disabled={isUpdating || isDeleting || isFetching}
                  isLoading={isFetching}
                  onUploadPictureChange={handleUploadPictureChange}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default ContactPage;
