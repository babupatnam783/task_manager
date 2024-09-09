import axios from "axios";

const instance = axios.create({
    // baseURL: process.env.REACT_APP_LOCALHOST,
    baseURL: process.env.REACT_APP_PRODUCTION,
});
export default instance;