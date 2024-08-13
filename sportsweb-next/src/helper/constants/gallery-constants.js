export const updateGalleryYupSchema = (yup) => {
    return yup.object().shape({
      gallery_name: yup.string().required("Album title is required")
    });
  };