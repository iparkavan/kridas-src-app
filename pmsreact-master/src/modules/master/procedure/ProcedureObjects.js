export const procedureObject = {
  companyDTO: null,
  companyId: null,
  id: null,
  loginId: null,
  parentProcedureId: null,
  price: 0,
  procedureName: "",
  procedureNotes: null,
  recordStatus: null,
  taxDTO: null,
  taxId: null,
};

export const procedureErrorObject = {
  procedureNameError: "",
  priceError: "",
};

export const procedurePageObject = {
  openSnackMessage: false,
  isLoading: true,
  errorWarning: false,
  disableSubmit: false,
  isTaxListLoading: true,
  isMainDataLoading: true,
  isParentProcedureLoading: true,
  mode: "ADD",
};
