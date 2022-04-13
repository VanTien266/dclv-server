const axios = require("axios");
const qs = require("qs");
// const { Platform } = require("react-native");

const axiosClient = axios.create({
  // baseURL: Platform.OS === 'android' ? process.env.REACT_APP_API_URL_ANDROID : process.env.REACT_APP_API_IOS,
  baseURL:
    // Platform.OS === "android"
    //   ? "https://server-dclv.herokuapp.com/api/"
    //   : "https://server-dclv.herokuapp.com/api/",
    //"http://172.17.24.175:5000/api",
    "http://192.168.1.64:5000/api",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => qs.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);
module.exports = axiosClient;
