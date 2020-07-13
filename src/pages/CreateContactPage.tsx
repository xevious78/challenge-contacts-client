import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import API, { CancelToken } from "../service/api";
import { Modal, Button } from "antd";
import ContactForm, { FormValues } from "../components/Contact/ContactForm";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useStores } from "../stores";
import { ContactInfos } from "../types";
import ClassName from "../utils/classname";
import styles from "./ContactPage.module.scss";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Axios, { CancelTokenSource } from "axios";


const CreateContactPage = () => {
  const { ContactStore } = useStores();
  const history = useHistory();

  const methods = useForm<FormValues>();
  const [isUploadingPicture, setIsUploadingPicture] = useState<boolean>(false);

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const createCancelToken = useRef<CancelTokenSource | null>(null);

  const formRef = React.createRef<HTMLFormElement>();

  ///////////////////////////////////////////
  // Form methods
  ///////////////////////////////////////////

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

  const create = async (contactInfos: ContactInfos) => {
    if (!contactInfos || isCreating) {
      return;
    }

    methods.clearErrors();
    const validated = await methods.trigger();
    if (!validated) {
      return;
    }

    setIsCreating(true);

    try {
      createCancelToken.current = CancelToken.source();
      const response = await API.contact.createContact(contactInfos, {
        cancelToken: createCancelToken.current.token,
      });
      const { contact } = response.data;

      ContactStore.addContact(contact);

      setIsCreating(false);
      history.push(`/`);
    } catch (e) {
      if (!Axios.isCancel(e)) {
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
    } finally {
      createCancelToken.current = null;
    }
  };

  ///////////////////////////////////////////
  // Effects
  ///////////////////////////////////////////

  useEffect(() => {
    return () => {
      createCancelToken.current?.cancel();
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
    create(contactInfos);
  };

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  const toolbarCn = ClassName(styles, "contact-page-toolbar");

  const renderToolbarTitle = () => {
    return "New contact";
  };

  const renderToolbarButtons = () => {
    return (
      <>
        <Button
          type="primary"
          onClick={handleSubmitClick}
          disabled={isCreating || isUploadingPicture}
          loading={isCreating}
        >
          Create
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
                  disabled={isCreating}
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

export default CreateContactPage;
