import axios from "axios";
import nprogress from "nprogress";

nprogress.configure({ showSpinner: false });

// create a centralized axios instance 
const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/auth"
});

//intercept the request before it is sent
axiosInstance.interceptors.request.use((config) => {
    nprogress.start(); //start the progress bar
    return config;
},
    (error) => {
        nprogress.done();
        return Promise.reject(error);
    }
);

//intercept the response when it comes back
axiosInstance.interceptors.response.use((response) => {
    nprogress.done(); // stop the progress bar when successful
    return response;
}, (error) => {
    nprogress.done();
    return Promise.reject(error);
});

export default axiosInstance;