const { default: api } = require("../utils/axiosInterceptor");

export const registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        api.post('auth/register', userData)
            .then((response) => {
                resolve(response.data); // Usually you want response.data
            })
            .catch((error) => {
                console.error("error === ", error);
                reject(error);
            });
    });
};

export const loginUser = (userData) => {
    return new Promise((resolve, reject) => {
        api.post('auth/login', userData)
            .then((response) => {
                resolve(response.data); // Usually you want response.data
            })
            .catch((error) => {
                console.error("error === ", error);
                reject(error);
            });
    });
};
