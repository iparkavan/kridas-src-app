export const updateMediaValidationSchema = (yup) => {
  return yup.object().shape({
    media_desc: yup.string().required("Enter Photo Description"),
  });
};
