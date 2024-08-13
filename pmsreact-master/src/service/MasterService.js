import axios from "axios";
import AuthService from "./AuthService";

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

class MasterService {
  fetchLookupByType(lookupType, companyId) {
    return axios.get(
      `${BACKEND_API_URL}/lookup/${lookupType}/${companyId}`,
      AuthService.getAuthHeader()
    );
  }

  fetchAllLookup(id) {
    return axios.get(
      `${BACKEND_API_URL}/lookup/all/${id}`,
      AuthService.getAuthHeader()
    );
  }

  // Get Procedures for a particular company
  fetchAllProceduresByCompanyId(id) {
    return axios.get(
      `${BACKEND_API_URL}/treatment/procedure/all/${id}`,
      AuthService.getAuthHeader()
    );
  }

  // Add a new Procedure
  addProcedure(data) {
    return axios.post(
      `${BACKEND_API_URL}/treatment/procedure/addProcedure`,
      data,
      AuthService.getAuthHeader()
    );
  }

  // Update an existing Procedure
  updateProcedure(data) {
    return axios.put(
      `${BACKEND_API_URL}/treatment/procedure/updateProcedure/${data.id}`,
      data,
      AuthService.getAuthHeader()
    );
  }

  // Fetch a procedure by id
  fetchProcedureByProcedureId(id) {
    return axios.get(
      `${BACKEND_API_URL}/treatment/procedure/${id}`,
      AuthService.getAuthHeader()
    );
  }

  // Get taxes for a particular company
  fetchAllTaxesByCompanyId(id) {
    return axios.get(
      `${BACKEND_API_URL}/lookup/allTaxes/${id}`,
      AuthService.getAuthHeader()
    );
  }

  // Get items(products) for a particular company
  fetchAllItemsByCompanyId(id) {
    return axios.get(
      `${BACKEND_API_URL}/item/all/${id}`,
      AuthService.getAuthHeader()
    );
  }

  // Add a new item (product)
  addItem(data) {
    return axios.post(
      `${BACKEND_API_URL}/item/addItemMaster`,
      data,
      AuthService.getAuthHeader()
    );
  }

  // Update an existing item
  updateItem(data) {
    return axios.put(
      `${BACKEND_API_URL}/item/updateItemMaster/${data.id}`,
      data,
      AuthService.getAuthHeader()
    );
  }

  // Fetch a item (product) by id
  fetchItemByItemId(id) {
    return axios.get(
      `${BACKEND_API_URL}/item/${id}`,
      AuthService.getAuthHeader()
    );
  }

  // Get payment modes for a particular company
  fetchAllPaymentModesByCompanyId(id) {
    return axios.get(
      `${BACKEND_API_URL}/payment/allMode/${id}`,
      AuthService.getAuthHeader()
    );
  }

  // Get expenses for a particular company
  fetchAllExpensesByCompanyId(id) {
    return axios.get(
      `${BACKEND_API_URL}/expense/all/${id}`,
      AuthService.getAuthHeader()
    );
  }

  // Add a new expense
  addExpense(data) {
    return axios.post(
      `${BACKEND_API_URL}/expense/addExpense`,
      data,
      AuthService.getAuthHeader()
    );
  }

  // Update an existing expense
  updateExpense(data) {
    return axios.put(
      `${BACKEND_API_URL}/expense/updateExpense/${data.id}`,
      data,
      AuthService.getAuthHeader()
    );
  }

  // Fetch a expense by id
  fetchExpenseById(id) {
    return axios.get(
      `${BACKEND_API_URL}/expense/${id}`,
      AuthService.getAuthHeader()
    );
  }

  // Get vendor for a particular company
  fetchAllVendorsByCompanyId(id) {
    return axios.get(
      `${BACKEND_API_URL}/vendor/all/${id}`,
      AuthService.getAuthHeader()
    );
  }

  // Add a new vendor
  addVendor(data) {
    return axios.post(
      `${BACKEND_API_URL}/vendor/addVendor`,
      data,
      AuthService.getAuthHeader()
    );
  }

  // Add stock to item (product)
  addItemStock(data) {
    return axios.post(
      `${BACKEND_API_URL}/item/addItemStock`,
      data,
      AuthService.getAuthHeader()
    );
  }

  // Add stock to item (product)
  consumeItemStock(data) {
    return axios.post(
      `${BACKEND_API_URL}/item/consumeItemStock`,
      data,
      AuthService.getAuthHeader()
    );
  }

  // Get batches for a particular inventory item
  fetchAllBatchesByItemId(id) {
    return axios.get(
      `${BACKEND_API_URL}/item/allBatches/${id}`,
      AuthService.getAuthHeader()
    );
  }

  // Add a new lookup key / value
  addLookupTableValue(data) {
    return axios.post(
      `${BACKEND_API_URL}/lookup/addLookup`,
      data,
      AuthService.getAuthHeader()
    );
  }

  // Update an existing lookup key / value
  updateLookupTableValue(data) {
    return axios.put(
      `${BACKEND_API_URL}/lookup/updateLookup`,
      data,
      AuthService.getAuthHeader()
    );
  }

  // Get items(products) for a particular company with search
  fetchAllItemsByCompanyIdWithSearch(data) {
    return axios.post(
      `${BACKEND_API_URL}/item/search`,
      data,
      AuthService.getAuthHeader()
    );
  }
}

export default new MasterService();
