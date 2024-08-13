import * as moment from "moment";
import Helper from "../helper/helper";
import AuthService from "../../service/AuthService";

export const patientObject = {
  addressDTO: null,
  addressId: null,
  alternateContactNo: "",
  bloodGroup: null,
  companyDTO: null,
  companyId: 0,
  createdDate: "",
  deletedDate: null,
  dob: null,
  email: "",
  enableEmail: "NO",
  ethnicity: null,
  gender: "M",
  id: null,
  idPassportNo: "",
  isDeleted: "NO",
  lastVisitDate: null,
  mobileNo: "",
  nationality: null,
  occupation: null,
  otherMedicalHistory: null,
  patientCredit: 0,
  patientMedicalGroups: [],
  patientMedicalHistories: [],
  patientName: "",
  referredBy: null,
  relationshipCode: null,
  relationshipContactNo: null,
  relationshipName: null,
  sendBirthdayWish: null,
  sendFollowupNotification: null,
  loginId: null,
};

export const addressObject = {
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  city: "",
  country: "",
  id: null,
  latitude: null,
  longtitude: null,
  postalCode: "",
  state: "",
};

export const patientMedicalGroupObject = {
  groupCode: "",
  groupDesc: "",
  id: 0,
  patientId: 0,
  recordStatus: "",
};

export const patientMedicalHistoryObject = {
  id: 0,
  medicalHistory: "string",
  medicalHistoryDesc: "string",
  patientId: 0,
  recordStatus: "",
};

export const patientErrorObject = {
  patientNameError: "",
  mobileNoError: "",
  emailError: "",
  addressLine1Error: "",
  cityError: "",
  countryError: "",
  stateError: "",
  postalCodeError: "",
  genderError: "",
  alternateContactNoError: "",
  emergencyContactNoError: "",
  dobError: "",
  idPassportNoError: "",
  addressNotFilledFullyError: "",
};

export const patientMasterDataObject = {
  relationshipList: [],
  ethnicityList: [],
  nationalityList: [],
  occupationList: [],
  bloodGroupList: [],
  referralList: [],
  countryList: [],
  stateList: [],
  medicalGroupList: [],
  medicalHistoryList: [],
};

export const patientPageStateObject = {
  openSnackMessage: false,
  isLoading: true,
  errorWarning: false,
  disableSubmit: false,
  isRelationshipListLoading: true,
  isEthnicityListLoading: true,
  isNationalityListLoading: true,
  isOccupationListLoading: true,
  isBloodGroupListLoading: true,
  isReferralListLoading: true,
  isCountryListLoading: true,
  isStateListLoading: true,
  isMedicalGroupListLoading: true,
  isMedicalHistoryListLoading: true,
  isMainDataLoading: true,
  mode: "ADD",
};

export const patientNoteObject = {
  clinicalNote: "",
  followupAppointmentDate: null,
  id: null,
  loginId: null,
  noteCreatedBy: null,
  noteDate: null,
  patientId: null,
};

export const patientNoteErrorObject = {
  clinicalNoteError: "",
  appointmentDateError: "",
  noteCreatedByError: "",
  noteDateError: "",
};

export const patientTreatmentProcedureObject = {
  amount: 0,
  discountAmount: 0,
  discountPercentage: 0,
  id: null,
  loginId: null,
  price: 0,
  procedureId: null,
  procedureNotes: null,
  quantity: 1,
  recordStatus: null,
  treatmentCompletedBy: null,
  treatmentCompletionDate: Helper.getFormattedDate(
    moment().format("L"),
    "YYYY-MM-DD"
  ),
  treatmentId: null,
  discountBy: "P",
  discount: 0,
  formErrors: {
    procedureIdError: "",
    quantityError: "",
    priceError: "",
    treatmentCompletedByError: "",
    treatmentCompletionDateError: "",
    discountError: "",
  },
};

export const patientTreatmentObject = {
  enteredBy: null,
  id: null,
  isInvoice: "NO",
  isTreatmentComplete: "YS",
  loginId: null,
  patientId: null,
  recordStatus: null,
  subTotal: 0,
  totalAmount: 0,
  totalDiscount: 0,
  treatmentDate: null,
  treatmentProcedures: [{ ...patientTreatmentProcedureObject }],
};

export const patientProcedureMasterDataObject = {
  procedureList: [],
  doctorList: [],
};

export const pageStateObject = {
  openSnackMessage: false,
  isLoading: true,
  errorWarning: false,
  disableSubmit: false,
  isDoctorListLoading: true,
  isProcedureListLoading: true,
  isMainDataLoading: true,
  submitType: "SAVE",
};

export const patientInvoiceObject = {
  cancelledDate: null,
  companyId: null,
  enteredBy: null,
  id: null,
  invoiceComments: null,
  invoiceDate: null,
  invoiceDetails: [],
  invoiceNo: null,
  isCancelled: "NO",
  loginId: null,
  patientId: null,
  recordStatus: null,
  subTotal: 0,
  totalAmount: 0,
  totalDiscount: 0,
  totalTax: 0,
  treatmentId: null,
};

export const patientInvoiceDetailObject = {
  detailType: "P",
  amount: 0,
  discountAmount: 0,
  discountPercentage: 0,
  id: null,
  invoiceId: null,
  itemId: null,
  loginId: null,
  notes: null,
  price: 0,
  procedureId: null,
  quantity: 1,
  recordStatus: null,
  taxAmount: 0,
  taxId: null,
  treatmentCompletedBy: null,
  treatmentCompletionDate: null,
  discountBy: "P",
  discount: 0,
  stockAvailability: 0,
  stockingUnit: "",
  reorderLevel: 0,
  formErrors: {
    procedureIdError: "",
    itemIdError: "",
    quantityError: "",
    priceError: "",
    treatmentCompletedByError: "",
    treatmentCompletionDateError: "",
    discountError: "",
  },
  initialQuantity: 0,
};

export const patientInvoiceMasterDataObject = {
  procedureList: [],
  doctorList: [],
  itemList: [],
  taxList: [],
  stockingUnitList: [],
};

export const invoicePageObject = {
  openSnackMessage: false,
  isLoading: true,
  errorWarning: false,
  disableSubmit: false,
  isDoctorListLoading: true,
  isProcedureListLoading: true,
  isTaxListLoading: true,
  isItemListLoading: true,
  isMainDataLoading: true,
  submitType: "SAVE",
  isPatientProcedureLoading: false,
  isStockingUnitListLoading: true,
};

export const paymentPageObject = {
  openSnackMessage: false,
  isLoading: true,
  errorWarning: false,
  disableSubmit: false,
  isPaymentModeListLoading: true,
  isInvoiceListLoading: true,
  isMainDataLoading: true,
  totalInvoiceDue: 0.0,
  totalPayment: 0.0,
  totalInvoiceDueAfterPayment: 0.0,
  newPatientCredit: 0.0,
  invoiceCountDuringLoad: 0,
  fetchAdditionalPaymentDetails: false,
};

export const patientPaymentObject = {
  advanceAmountUsed: 0,
  cancelledDate: null,
  companyId: null,
  enteredBy: null,
  id: null,
  isCancelled: "NO",
  loginId: null,
  notes: null,
  patientId: null,
  paymentDate: null,
  paymentDetails: [],
  paymentModeId: null,
  paymentNo: "",
  paymentNowAmount: 0,
  recordStatus: null,
  updatedPatientCredit: 0,
  bankName: null,
  paymentRefNo: null,
};

export const paymentErrorObject = {
  paymentModeError: "",
  paymentAmountError: "",
};

export const paymentDetailObject = {
  appliedAmount: 0.0,
  creditAppliedAmount: 0.0,
  id: null,
  invoiceId: null,
  loginId: null,
  paymentId: null,
  recordStatus: null,
  invoiceNo: null,
  invoiceDate: null,
  invoiceAmount: 0,
  balanceDue: 0,
};
