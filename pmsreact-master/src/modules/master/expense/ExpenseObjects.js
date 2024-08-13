export const expenseObject = {
  bankName: null,
  companyDTO: null,
  companyId: null,
  deleteDate: null,
  expenseAmount: 1.0,
  expenseDate: null,
  expenseNotes: null,
  expenseType: null,
  id: null,
  isDeleted: "NO",
  loginId: null,
  paymentModeId: null,
  paymentRefNo: null,
  recordStatus: null,
  vendorId: null,
};

export const expenseErrorObject = {
  expenseTypeError: "",
  expenseAmountError: "",
  expenseDateError: "",
  paymentModeIdError: "",
};

export const expensePageObject = {
  openSnackMessage: false,
  isLoading: true,
  errorWarning: false,
  disableSubmit: false,
  isVendorListLoading: true,
  isExpenseTypeLoading: true,
  isMainDataLoading: true,
  isPaymentModeLoading: true,
  mode: "ADD",
  fetchAdditionalPaymentDetails: false,
  showAddVendorScreen: false,
  vendorName: "",
};
