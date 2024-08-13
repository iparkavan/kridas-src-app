export const itemMasterObject = {
  avaialableStock: 0,
  companyDTO: null,
  companyId: null,
  expiredStock: 0,
  id: null,
  itemCode: "",
  itemName: "",
  itemType: "",
  loginId: null,
  manufacturerId: null,
  reorderLevel: 0,
  retailPrice: 0,
  recordStatus: null,
  taxDTO: null,
  taxId: null,
  stockingUnit: "",
  totalStock: 0,
  allowPrescription: "NO",
  drugType: null,
  strength: "",
  strengthUnit: null,
  instructions: "",
};

export const itemMasterErrorObject = {
  itemNameError: "",
  itemTypeError: "",
  stockingUnitError: "",
  drugTypeError: "",
};

export const itemMasterPageObject = {
  openSnackMessage: false,
  isLoading: true,
  errorWarning: false,
  disableSubmit: false,
  isTaxListLoading: true,
  isMainDataLoading: true,
  isLookupLoading: true,
  isStockingUnitListLoading: true,
  isDrugTypeListLoading: true,
  isManufacturerListLoading: true,
  isStrengthUnitListLoading: true,
  isItemTypeListLoading: true,
  mode: "ADD",
};

export const itemMasterDataObject = {
  stockingUnitList: [],
  drugTypeList: [],
  manufacturerList: [],
  strengthUnitList: [],
  itemTypeList: [],
  taxList: [],
};

export const itemAddStockObject = {
  action: "ADD",
  batchNumber: null,
  companyId: null,
  costPrice: 0,
  expiryDate: null,
  id: null,
  itemId: null,
  itemType: "",
  loginId: null,
  orderStock: 1,
  stockingUnit: "",
  vendorId: null,
  totalAmount: 0,
};

export const itemAddStockErrorObject = {
  costPriceError: "",
  orderStockError: "",
  expiryDateError: "",
};

export const itemAddStockPageObject = {
  openSnackMessage: false,
  isLoading: true,
  errorWarning: false,
  disableSubmit: false,
  isVendorListLoading: true,
  isMainDataLoading: true,
  showAddVendorScreen: false,
  vendorName: "",
  isStockingUnitListLoading: true,
};

export const itemConsumeStockObject = {
  action: "CON",
  batchNumber: null,
  companyId: null,
  id: null,
  itemId: null,
  itemType: "",
  loginId: null,
  orderStock: 1,
  stockingUnit: "",
  actionType: "",
};

export const itemConsumeStockErrorObject = {
  actionTypeError: "",
  orderStockError: "",
};

export const itemConsumeStockPageObject = {
  openSnackMessage: false,
  isLoading: true,
  errorWarning: false,
  disableSubmit: false,
  isMainDataLoading: true,
  isConsumptionTypeLoading: true,
  isBatchesLoading: true,
  isStockingUnitListLoading: true,
};
