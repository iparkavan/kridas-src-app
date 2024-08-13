export const createArticleYupSchema = (yup) => {
  return yup.object({
    article_heading: yup
      .string()
      .max("1000", "Maximum character limit reached")
      .required("Article Heading is required"),
  });
};
