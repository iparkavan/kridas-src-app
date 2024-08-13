import axios from "../utils/axios";

class ProfileVerificationService {
  async verifyProfile(data) {
    const {
      id_proof_type,
      id_proof,
      is_proof_same,
      address_proof_type,
      address_proof,
      type,
      id,
    } = data;
    let formData = new FormData();
    formData.append("applied_status", "S");
    formData.append("id_proof_type", id_proof_type);
    formData.append("id_proof", id_proof);
    formData.append("is_proof_same", is_proof_same ? "Y" : "N");
    if (!is_proof_same) {
      formData.append("address_proof_type", address_proof_type);
      formData.append("address_proof", address_proof);
    }
    formData.append(`${type}_id`, id);

    const res = await axios.post("/profile-verification", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async getVerifyProfile(type, id) {
    const newType = type === "user" ? "U" : "C";
    const res = await axios.get(
      `/profile-verification/getByType/${newType}/${id}`
    );
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }
}

export default new ProfileVerificationService();
