class UserConfig {
  //User Get All
  getUserListConfig() {
    return {
      method: "GET",
      url: `/users/getAll`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  //User By Id
  getUserById(id) {
    return {
      method: "GET",
      url: `/users/get/${id}`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  // Active Inactive User
  activeInactiveUser(data) {
    return {
      method: "PUT",
      url: `/users/activateUser`,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
      data: data,
    };
  }

  getSignInConfig(data) {
    return {
      method: "POST",
      url: `/accounts:signInWithPassword?key=${process.env.REACT_APP_AUTH_API_KEY}`,
      headers: { "Content-Type": "application/json" },
      data: data,
      baseURL: "https://identitytoolkit.googleapis.com/v1",
    };
  }

  //Edit User
  putUserData(data) {
    let formData = new FormData();
    data.user_identity_docs = JSON.stringify(data.user_identity_docs);
    formData.append("social", JSON.stringify(data.social));
    formData.append("address", JSON.stringify(data.address));
    formData.append(
      "sports_interested",
      JSON.stringify(data.sports_interested)
    );
    formData.append("bio_details", JSON.stringify(data.bio_details));

    for (const key in data) {
      if (data[key]) {
        if (
          key !== "social" &&
          key !== "address" &&
          key !== "user_profile_img" &&
          key !== "user_img" &&
          key !== "sports_interested" &&
          key !== "bio_details"
        )
          formData.append(key, data[key]);
      }
    }

    formData.append("userProfileImage", data.user_profile_img);
    formData.append("image", data.user_img);

    return {
      method: "PUT",
      url: `/users`,
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getGraph() {
    return {
      method: "GET",
      url: `/dashboard/getGraph`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  fetchApprovals() {
    return {
      method: "GET",
      url: `/dashboard/getApprovals`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  fetchStatistics() {
    return {
      method: "GET",
      url: `/dashboard/getUsersCount`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getTopUsers() {
    return {
      method: "GET",
      url: `/dashboard/topFollowers`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getUserStatistics(userId) {
    return {
      method: "GET",
      url: `/users/statistics/getUserById/${userId}`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  getUserStatisticsById(userStatisticsId) {
    return {
      method: "GET",
      url: `/users/statistics/get/${userStatisticsId}`,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  updateUserStatistics(data) {
    let formData = new FormData();
    let arr = [
      "sportwise_statistics",
      "sport_career",
      "sports_profile",
      "sports_role",
      "statistics_docs",
    ];

    for (const key in data) {
      if (data[key]) {
        if (arr.includes(key)) formData.append(key, JSON.stringify(data[key]));
        else formData.append(key, data[key]);
      }
    }

    return {
      method: "PUT",
      url: `/users/statistics`,
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  userProfileVerification(data) {
    return {
      method: "PUT",
      url: `users/verifyProfile`,
      data: data,
      headers: { "Content-Type": "application/json" },
      baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
    };
  }

  // 
  userAccountDeletion() {
    return {
      method: "GET",
      url: "http://54.255.217.1:8001/api/account-deletion-request/getAll",
      baseURL: process.env.REACT_APP_MIDDLEWARE_ACCOUNT_DELETION,
    };
  }
}

export default new UserConfig();
