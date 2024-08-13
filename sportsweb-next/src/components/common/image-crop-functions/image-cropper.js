import { Box, Flex, Input } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import EmptyCoverImage from "../empty-cover-image";

function ImageCropper(props) {
  const { imageToCrop, onImageCropped, coverImage, type, dimensions } = props;
  const [cropConfig, setCropConfig] = useState(null);
  useEffect(() => {
    setCropConfig({
      unit: "px",
      width: dimensions?.width >= 1021 ? 1021 : 623,
      height: 300,
      x: 0,
      y: 0,
    });
  }, [dimensions?.width]);
  const [imageRef, setImageRef] = useState();

  async function cropImage(crop) {
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await getCroppedImage(
        imageRef,
        crop,
        "croppedImage.jpeg" // destination filename
      );
      // calling the props function to expose
      // croppedImage to the parent component
      onImageCropped(croppedImage);
    }
  }

  function getCroppedImage(sourceImage, cropConfig, fileName) {
    // creating the cropped image from the source image
    const canvas = document.createElement("canvas");
    const scaleX = sourceImage.naturalWidth / sourceImage.width;
    const scaleY = sourceImage.naturalHeight / sourceImage.height;
    canvas.width = cropConfig.width;
    canvas.height = cropConfig.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      sourceImage,
      cropConfig.x * scaleX,
      cropConfig.y * scaleY,
      cropConfig.width * scaleX,
      cropConfig.height * scaleY,
      0,
      0,
      cropConfig.width,
      cropConfig.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        //returning an error
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        blob.name = fileName;
        //creating a Object URL representing the Blob object given
        /*      const base64Image = canvas.toDataURL("image/jpeg"); */
        const file = new File([blob], "Cropped Image", { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    });
  }
  return (
    <Flex align="center" justify="center">
      {imageToCrop /* || coverImage */ ? (
        <ReactCrop
          src={
            imageToCrop /*  ||
            (coverImage instanceof File
              ? URL.createObjectURL(coverImage)
              : coverImage) */
          }
          style={
            {
              /* maxWidth: "100%",
              maxHeight: "100%", */
              //width: "1021px",
              /*       overflowY:type==="article" ? "scroll" : "none" */
            }
          }
          crop={cropConfig}
          //ruleOfThirds
          locked={false}
          onComplete={(cropConfig) => cropImage(cropConfig)}
          onChange={(cropConfig) => {
            /*{
              ...cropConfig,
              height: 192,
              x: 0,
              y: cropConfig.y >= 0 && cropConfig.y,
            }*/
            setCropConfig(cropConfig);
          }}
          onImageLoaded={(imageRef) => setImageRef(imageRef)}
          keepSelection={false}
          crossorigin="anonymous" // to avoid CORS-related problems
          aspect={1}
        ></ReactCrop>
      ) : (
        /*       <Box border={"1px solid #e8e8f7"} w="1021px" h="300px"></Box> */
        <EmptyCoverImage bgColor={"gray.200"}>Cover Image</EmptyCoverImage>
      )}
    </Flex>
  );
}

ImageCropper.defaultProps = {
  onImageCropped: () => {},
};

export default ImageCropper;
