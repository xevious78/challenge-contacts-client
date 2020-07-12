import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDropzone, DropzoneOptions } from "react-dropzone";

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

  const onDrop = useCallback(
    async (droppedFiles) => {
      console.log(droppedFiles);
      setValue(NAME, droppedFiles[0].name);
    },
    [setValue]
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
    </div>
  );
});

export default PictureField;
