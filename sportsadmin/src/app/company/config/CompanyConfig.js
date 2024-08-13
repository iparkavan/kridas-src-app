class CompanyConfig {
  getAllCompanies() {
    return {
      method: "GET",
      url: "company/getAll",
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getCompanyById(id) {
    return {
      method: "GET",
      url: `company/get/${id}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getCompanyTypesById(id) {
    return {
      method: "GET",
      url: `company/getTypes/${id}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getCompanyTypeDetailById(data) {
    return {
      method: "POST",
      url: `company/getTypeDetail`,
      data: data,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  editCompanyData(data) {
    let formData = new FormData();
    data.address = JSON.stringify(data.address);
    // data.company_identity_docs = JSON.stringify(data.company_identity_docs);

    formData.append("social", JSON.stringify(data.social));
    formData.append("company_type", JSON.stringify(data.company_type));
    formData.append(
      "company_bank_details",
      JSON.stringify(data.company_bank_details)
    );

    if (data.company_contacts) {
      formData.append(
        "company_contacts",
        JSON.stringify(data.company_contacts)
      );
    }
    if (data.company_tax_info) {
      formData.append(
        "company_tax_info",
        JSON.stringify(data.company_tax_info)
      );
    }

    if (data.documents?.length > 0) {
      let documentTypes = [];
      data.documents.forEach((doc) => {
        if (doc.file) {
          formData.append("document", doc.file);
          documentTypes.push(doc.type);
        }
      });
      formData.append("documentTypes", JSON.stringify(documentTypes));
    }

    if (data.company_identity_docs && data.documents) {
      data.company_identity_docs.forEach((doc) => {
        const existingDocType = data.documents.find((d) => d.type === doc.type);
        if (existingDocType) {
          if (existingDocType.file) {
            doc.is_delete = "Y";
          }
        } else {
          doc.is_delete = "Y";
        }
      });
    }

    data.company_identity_docs = JSON.stringify(data.company_identity_docs);

    for (const key in data) {
      if (data[key]) {
        if (
          key !== "social" &&
          key !== "company_type" &&
          key !== "company_img" &&
          key !== "company_profile_img" &&
          key !== "company_bank_details" &&
          key !== "company_contacts" &&
          key !== "company_tax_info" &&
          key !== "documents"
        ) {
          formData.append(key, data[key]);
        }
      }
    }
    formData.append("companyProfileImage", data.company_profile_img);
    formData.append("image", data.company_img);
    return {
      method: "PUT",
      url: `/company`,
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getCompanyName(companyName) {
    return {
      method: "GET",
      url: `company/fetchCompanyByName/${companyName}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getParentCompany(parentId) {
    return {
      method: "GET",
      url: `company/getByParent/${parentId}`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getAllParentCompany() {
    return {
      method: "GET",
      url: `company/fetchAllParentCompany`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  companyProfileVerification(data) {
    return {
      method: "PUT",
      url: `company/verifyProfile`,
      data: data,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }
}

export default new CompanyConfig();
