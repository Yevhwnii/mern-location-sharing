import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";

import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const inputRef = useRef();

  const pickImageHandler = () => {
    inputRef.current.click();
  };

  // Generating image preview on file change
  useEffect(() => {
    if (!file) {
      return;
    }
    // Using file reader api to read file input
    const fileReader = new FileReader();
    // Executes whenever fileReader done parsing a file (readAsDataUrl)
    fileReader.onload = () => {
      // Result prop holds parsed image
      setPreviewUrl(fileReader.result);
      console.log(fileReader);
    };
    // Converts binary data into readable data
    fileReader.readAsDataURL(file);
  }, [file]);

  // Whenever file is picked
  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    // If there is a file
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    // Two way binding for component which uses this component
    props.onInput(props.id, pickedFile, fileIsValid);
  };
  return (
    <div className="form-control">
      <input
        ref={inputRef}
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
