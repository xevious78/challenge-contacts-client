import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import API from "../service/api";
import { Modal, Input, Button } from "antd";
import delay from "../utils/delay";
import ContactForm from "../components/Contact/ContactForm";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

type FormValues = {
  name: string;
};

const Contact = () => {
  const { contactId } = useParams();
  const history = useHistory();

  const methods = useForm<FormValues>();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const [contact, setContact] = useState<any | null>(null);

  useEffect(() => {
    if (contactId && !contact) {
      fetch(contactId);
    }
  }, [contactId, contact]);

  const resetForm = (contact: any) => {
    methods.reset({
      name: contact.name,
    });
  };

  ///////////////////////////////////////////
  // Network
  ///////////////////////////////////////////
  const fetch = async (contactId: string) => {
    setIsFetching(true);
    await delay(2000);

    try {
      const response = await API.contact.getContact(contactId);
      const { contact } = response.data;
      setContact(contact);
      resetForm(contact);
    } catch (e) {
      //TODO: Error
      Modal.error({
        title: "Error",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const update = async (contactId: string, contactInfos: any) => {
    methods.clearErrors();
    const validated = await methods.trigger();
    if (!validated) {
      return;
    }

    setIsUpdating(true);
    //TODO: Check values

    await delay(2000);
    try {
      const response = await API.contact.updateContact(contactId, contactInfos);
      const { contact } = response.data;
      setContact(contact);
      resetForm(contact);
    } catch (e) {
      //TODO: Error
    } finally {
      setIsUpdating(false);
    }
  };

  const create = async (contactInfos: any) => {
    methods.clearErrors();
    const validated = await methods.trigger();
    if (!validated) {
      return;
    }

    setIsCreating(true);
    //TODO: Check values

    await delay(2000);
    try {
      const response = await API.contact.createContact(contactInfos);
      const { contact } = response.data;
      setContact(contact);
      resetForm(contact);

      history.replace(`/contact/${contact.id}`);
    } catch (e) {
      //TODO: Error
    } finally {
      setIsCreating(false);
    }
  };

  ///////////////////////////////////////////
  // Toolbar Cb
  ///////////////////////////////////////////

  const handleSubmit: SubmitHandler<FormValues> = (data, e) => {
    console.log(data);
    const contactInfos = {
      name: data.name,
    };

    if (contactId) {
      update(contactId, contactInfos);
    } else {
      create(contactInfos);
    }
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
            disabled={isFetching || isUpdating}
            loading={isUpdating}
          >
            Save
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          <Button
            type="primary"
            htmlType="submit"
            disabled={isUpdating}
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
            <ContactForm />
          </div>
          <div>{renderToolbar()}</div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Contact;
