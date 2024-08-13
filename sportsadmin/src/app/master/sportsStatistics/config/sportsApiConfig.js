class sportsUserConfig {

    fetchUserStatistics(id) {
        return {
            method: "GET",
            url: `/users/statistics/get/${id}`,
            baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
        };
    }

    editUserStatistics(data) {

        let formData = new FormData();
        let arr = ['sportwise_statistics', 'sport_career', 'statistics_links', 'sports_profile', 'sports_role', 'statistics_docs']

        for (const key in data) {
            if (data[key]) {
                if (arr.includes(key))
                    formData.append(key, JSON.stringify(data[key]))
                else
                    formData.append(key, data[key])
            }
        }

        return {
            method: "PUT",
            url: `/users/statistics`,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData,
            baseURL: process.env.REACT_APP_MIDDLEWARE_API_URL,
        };
    }
}

export default new sportsUserConfig();