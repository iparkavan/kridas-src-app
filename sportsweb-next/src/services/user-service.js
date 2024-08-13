import axios from "../utils/axios";
//import { format } from "date-fns";
import { objToFormData } from "../helper/form-data";

class UserService {
  loginUser(data) {
    return {
      method: "POST",
      url: `/users/login`,
      data: data,
      baseURL: process.env.NEXT_PUBLIC_API_GATEWAY,
    };
  }

  registerUser(data) {
    let formData = new FormData();
    // formData.append("user_phone", data.userPhone);
    formData.append("user_dob", JSON.stringify(data.userDob));
    formData.append("user_email", data.userEmail);
    formData.append("password", data.password);
    formData.append("first_name", data.firstName);
    formData.append("last_name", data.lastName);

    if (data.registeredReferralCode) {
      formData.append("registered_referral_code", data.registeredReferralCode);
    }

    return axios({
      method: "POST",
      url: `/users/register`,
      data: formData,
      baseURL: process.env.NEXT_PUBLIC_API_GATEWAY,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Fetch user details based on token
   * @param {string} token
   * @returns user object
   */
  getUserByToken(token) {
    return axios({
      method: "GET",
      url: `/users/getByToken/${token}`,
      baseURL: process.env.NEXT_PUBLIC_API_GATEWAY,
    });
  }

  /**
   * Activates user based on token and also in firebase using the email
   * @returns user object
   */
  async activateUser(data) {
    const res = await axios.put("/users/activate", data);
    if (res.data.message) {
      const error = new Error(res.data.message);
      error.code = res.data.statusCode;
      throw error;
    }
    return res.data;
  }

  /**
   * Process the user email activation. Gets the user details.
   * @param {string} token
   * @returns email address
   */
  async processActivation(token) {
    let userEmail = "";
    try {
      if (token !== undefined) {
        //Get the user details based on the token
        const response = await this.getUserByToken(token);

        if (response.data?.data) {
          userEmail = response.data?.data["user_email"];
        } else {
          console.log("user not found");
        }
      }
    } catch (e) {
      console.log(e.message);
    }

    return userEmail;
  }

  async getUser(id) {
    const res = await axios.get(`/users/get/${id}`);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data.data;
  }

  async getUserByUsername(username, userId) {
    let url = `/users/getUsername/${username}`;
    if (userId) {
      url += `?user_id=${userId}`;
    }
    const res = await axios.get(url);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data.data;
  }

  async updateUser(type, data) {
    const { userData, values } = data;
    let formData = new FormData();

    formData = objToFormData({ ...userData, ...values }, formData);

    // if (values?.userProfileImage) {
    //   formData.append("userProfileImage", values.userProfileImage);
    // }

    // if (values?.userCoverImage) {
    //   formData.append("image", values.userCoverImage);
    // }

    const res = await axios.put(`/users`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }

  async updatePassword(data) {
    return axios.put("/users/changePassword", data);
  }

  async resetPassword(data) {
    return axios.post("/users/resetPassword", data);
  }

  async searchByName({ search_area = "B", ...data }) {
    const res = await axios.post("/users/searchByName", {
      ...data,
      search_area,
    });
    return res.data;
  }

  async getUserFollowers(id, type) {
    const response = await axios.get(`/users/getUserData/${id}/${type}`);
    return response.data;
  }

  async verifyReferralCode(code) {
    const response = await axios.get(`/users/code-verification/${code}`);
    return response.data;
  }

  async getUserByPlayerId(playerId) {
    const res = await axios.get(`/users/getByPlayerId/${playerId}`);
    if (res.data.message) {
      throw new Error(res.data.message);
    }
    return res.data;
  }
}

export default new UserService();
