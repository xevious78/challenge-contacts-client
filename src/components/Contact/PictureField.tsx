import React, { useCallback, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import API from "../../service/api";
import delay from "../../utils/delay";
import { Button } from "antd";
import styles from "./PictureField.module.scss";
import ClassName from "../../utils/classname";
import { DeleteOutlined, UserOutlined, LoadingOutlined } from "@ant-design/icons";
import { useContactFormContext } from "../../contexts/ContactFormContext";

type PictureFieldProps = {
  onUploadPictureChange?: (isUploading: boolean) => void;
};

const NAME = "pictureId";

const PictureField = React.memo<PictureFieldProps>((props) => {
  const { onUploadPictureChange } = props;
  const { isLoading, disabled } = useContactFormContext();

  ///////////////////////////////////////////
  // Form
  ///////////////////////////////////////////
  const { register, unregister, setValue } = useFormContext();
  const pictureId = useWatch<string>({ name: NAME });

  ///////////////////////////////////////////
  // DropZone
  ///////////////////////////////////////////
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [picturePreviewURL, _setPicturePreviewURL] = useState<string | null>();

  const setPicturePreviewURL = useCallback(
    (url: string | null) => {
      if (picturePreviewURL) {
        URL.revokeObjectURL(picturePreviewURL);
      }

      _setPicturePreviewURL(url);
    },
    [picturePreviewURL, _setPicturePreviewURL]
  );

  const onDrop = useCallback(
    async (droppedFiles) => {
      const image = droppedFiles[0];
      if (!image) {
        return;
      }

      setIsUploading(true);
      setPicturePreviewURL(URL.createObjectURL(image));
      await delay(1000);
      try {
        const response = await API.image.uploadImage(image);
        setValue(NAME, response.data.imageId);
      } catch (e) {
        console.error(e);
      } finally {
        setPicturePreviewURL(null);
        setIsUploading(false);
      }
    },
    [setValue, setPicturePreviewURL]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop,
    disabled: isUploading || disabled,
  });

  ///////////////////////////////////////////
  // Effects
  ///////////////////////////////////////////
  useEffect(() => {
    register(NAME);

    return () => unregister(NAME);
  }, [register, unregister]);

  useEffect(() => {
    onUploadPictureChange?.(isUploading);
  }, [onUploadPictureChange, isUploading]);

  ///////////////////////////////////////////
  // Button Cb
  ///////////////////////////////////////////
  const handleDeleteClick = () => {
    setValue(NAME, null);
  };

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  const cn = ClassName(styles, "picture-field");

  let content: JSX.Element | null = null;
  if (isLoading) {
    content = <div className={cn("fetching")}>
      <LoadingOutlined spin />
    </div>;
  } else if (isUploading) {
    if (picturePreviewURL) {
      content = (
        <img
          className={cn("loading-picture")}
          src={picturePreviewURL}
          alt="loading contact"
        />
      );
    }
  } else {
    if (pictureId) {
      content = (
        <img
          className={cn("picture")}
          src={API.image.getImageURL(pictureId)}
          alt="contact"
        />
      );
    } else {
      content = (
        <div className={cn("placeholder")}>
          <UserOutlined />
        </div>
      );
    }
  }

  return (
    <div className={cn()}>
      <div {...getRootProps()} className={cn("dropzone-root")}>
        {content}
        <input
          {...getInputProps()}
          name="image"
          className={cn("dropzone-input")}
        />
        <div
          className={cn("dropzone-overlay", { "drag-active": isDragActive })}
        />
      </div>
      {pictureId && (
        <Button
          className={cn("delete-button")}
          icon={<DeleteOutlined />}
          shape="circle"
          onClick={handleDeleteClick}
        />
      )}
    </div>
  );
});

export default PictureField;
