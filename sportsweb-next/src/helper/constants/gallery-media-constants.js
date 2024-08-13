export const createGalleryMediaYupSchema = (yup) => {
  return yup.object().shape({
    gallery_name: yup.string().required("Enter Album Name"),
    file: yup
      .array()
      .compact()
      .max(5, "Maximum upload limit is 5")
      .min(1, "Upload atleast one Photo/Video")
      .required("Upload atleast one Photo/Video"),
  });
};

export const updateGalleryMediaYupSchema = (yup) => {
  return yup.object().shape({
    gallery_id: yup.string().required(),
    file: yup
      .array()
      .compact()
      .max(5, "Maximum upload limit is 5")
      .min(1, "Upload atleast one Photo/Video")
      .required("Upload atleast one Photo/Video"),
  });
};
