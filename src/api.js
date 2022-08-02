import axios from "axios";
import config from "@config";
import CryptoJS from "crypto-js";

const api = () => {
  const defaultOptions = {
    baseURL: config.BASE_URL,
  };

  const instance = axios.create(defaultOptions);
  instance.interceptors.request.use((conf) => {
    conf.headers.common["x-api-key"] = CryptoJS.AES.encrypt(
      `${config.API_SECRET_VALUE}${new Date().toISOString()}`,
      config.API_SECRET_KEY
    ).toString();
    return conf;
  });

  return instance;
};

export default api();
