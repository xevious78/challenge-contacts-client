import React, { useState, useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import API from "../service/api";
import { Modal, Button } from "antd";
import delay from "../utils/delay";
import ContactForm from "../components/Contact/ContactForm";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useStores } from "../stores";
import { Contact, ContactInfos } from "../types";

type FormValues = {
  pictureId: string;
  name: string;
  jobTitle: string;
  email: string;
  address: string;
  phoneNumbers?: Array<{ text: string }>;
};

const ContactPage = () => {
  const { ContactStore } = useStores();
  const { contactId } = useParams();
  const history = useHistory();

  const methods = useForm<FormValues>();
  const [isUploadingPicture, setIsUploadingPicture] = useState<boolean>(false);

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [contact, setContact] = useState<Contact | null>(null);

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
      if (!contactId || isFetching || isDeleting || isUpdating || isCreating) {
        return;
      }

      setIsFetching(true);
      await delay(2000);

      try {
        const response = await API.contact.getContact(contactId);
        const { contact } = response.data;

        setContact(contact);
        resetForm(contact);

        setIsFetching(false);
      } catch (e) {
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
    },
    [isFetching, isDeleting, isUpdating, isCreating, history, resetForm]
  );

  const update = async (contactId: string, contactInfos: ContactInfos) => {
    if (
      !contactId ||
      !contactInfos ||
      isFetching ||
      isDeleting ||
      isUpdating ||
      isCreating
    ) {
      return;
    }

    methods.clearErrors();
    const validated = await methods.trigger();
    if (!validated) {
      return;
    }

    setIsUpdating(true);

    await delay(2000);
    try {
      const response = await API.contact.updateContact(contactId, contactInfos);
      const { contact } = response.data;

      setContact(contact);
      resetForm(contact);
      ContactStore.updateContact(contact);

      history.push(`/`);
      setIsUpdating(false);
    } catch (e) {
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
  };

  const create = async (contactInfos: ContactInfos) => {
    if (!contactInfos || isFetching || isDeleting || isUpdating || isCreating) {
      return;
    }

    methods.clearErrors();
    const validated = await methods.trigger();
    if (!validated) {
      return;
    }

    setIsCreating(true);

    await delay(2000);
    try {
      const response = await API.contact.createContact(contactInfos);
      const { contact } = response.data;

      setContact(contact);
      resetForm(contact);
      ContactStore.addContact(contact);

      setIsCreating(false);
      history.push(`/`);
    } catch (e) {
      // Generic error
      Modal.error({
        title: "An error occured while creating the contact",
        okText: "Go back",
        onOk: () => {
          setIsCreating(false);
          history.push("/");
        },
      });
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!contactId || isFetching || isDeleting || isUpdating || isCreating) {
      return;
    }

    setIsDeleting(true);

    await delay(2000);
    try {
      await API.contact.deleteContact(contactId);
      ContactStore.removeContact(contactId);

      setIsDeleting(false);
      history.replace(`/`);
    } catch (e) {
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
  };

  ///////////////////////////////////////////
  // Effects
  ///////////////////////////////////////////
  useEffect(() => {
    if (contactId && !contact) {
      fetch(contactId);
    }
  }, [contactId, contact, fetch]);

  ///////////////////////////////////////////
  // ContactForm Cb
  ///////////////////////////////////////////
  const handleUploadPictureChange = (_isUploadingPicture: boolean) => {
    setIsUploadingPicture(_isUploadingPicture);
  };

  ///////////////////////////////////////////
  // Toolbar Cb
  ///////////////////////////////////////////

  const handleSubmit: SubmitHandler<FormValues> = (data, e) => {
    console.log(data);
    const contactInfos = formValuesToContactInfos(data);

    if (contactId) {
      update(contactId, contactInfos);
    } else {
      create(contactInfos);
    }
  };

  const handleDeleteClick = () => {
    deleteContact(contactId);
  };

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////

  const renderToolbar = () => {
    if (contactId) {
      return (
        <div>
          <Button
            type="primary"
            htmlType="submit"
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
        </div>
      );
    } else {
      return (
        <div>
          <Button
            type="primary"
            htmlType="submit"
            disabled={isUpdating || isUploadingPicture}
            loading={isCreating}
          >
            Create
          </Button>
        </div>
      );
    }
  };

  return (
    <div data-testid="contact-page">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <div>
            <ContactForm onUploadPictureChange={handleUploadPictureChange} />
          </div>
          <div>{renderToolbar()}</div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ContactPage;
