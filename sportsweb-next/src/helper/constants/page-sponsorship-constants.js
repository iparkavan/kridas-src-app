const errorMessages = {
  SELECT_CATEGORY: "Please select a Sub-Category",
  SELECT_SPORTS: "Please select a Sport",
  ENTER_SPONSOR_NAME: "Please enter previous sponsor name",
};


export const getPageSponsorshipYupSchema = (yup,mode) => {
  return yup.object().shape({
   roi_options: yup.array().compact().min(1, "Please select atleast one ROI"),
   sports_id: yup.number(errorMessages.SELECT_CATEGORY).required(errorMessages.SELECT_SPORTS),
   category_id: yup.number(errorMessages.SELECT_CATEGORY).required(errorMessages.SELECT_CATEGORY),
   previous_current_sponsor:mode && yup.string(errorMessages.ENTER_SPONSOR_NAME).nullable(true).required(errorMessages.ENTER_SPONSOR_NAME)
  });
};