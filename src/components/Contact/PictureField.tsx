import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import API from "../../service/api";
import delay from "../../utils/delay";
import { previewImage } from "antd/lib/upload/utils";

const NAME = "pictureId";

const PictureField = React.memo(() => {
  ///////////////////////////////////////////
  // Form
  ///////////////////////////////////////////
  const { register, unregister, watch, setValue } = useFormContext();
  const pictureId = watch(NAME);

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
  });

  ///////////////////////////////////////////
  // Effects
  ///////////////////////////////////////////
  useEffect(() => {
    register(NAME);

    return () => unregister(NAME);
  }, [register, unregister]);

  ///////////////////////////////////////////
  // Render
  ///////////////////////////////////////////
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} name="image" />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
      {pictureId && <div>{pictureId}</div>}
      {isUploading && "Uploading"}
      {picturePreviewURL && <img src={picturePreviewURL} />}
      {pictureId && <img src={API.image.getImageURL(pictureId)} />}
    </div>
  );
});

export default PictureField;
