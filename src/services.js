import axios from "axios";
import qs from "qs";
import config from "@config";
import { getAuthToken } from "@utils";
import CryptoJS from "crypto-js";

axios.defaults.headers.common["x-api-key"] = CryptoJS.AES.encrypt(
  `${config.API_SECRET_VALUE}${new Date().toISOString()}`,
  config.API_SECRET_KEY
).toString();

const authHeader = () => {
  return {
    headers: {
      Authorization: "Bearer " + getAuthToken(),
    },
  };
};
const authHeaderFormData = () => {
  return {
    headers: {
      Authorization: "Bearer " + getAuthToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  };
};

export const apiPost = (url, params, cb, err) => {
  axios.post(`${config.BASE_URL}${url}`, params).then(cb).catch(err);
};

export const apiPostAuth = (url, params, cb, err) => {
  axios
    .post(`${config.BASE_URL}${url}`, params, authHeader())
    .then(cb)
    .catch(err);
};

export const apiPostAuthFormData = (url, params, cb, err) => {
  const formData = qs.stringify(params);
  axios
    .post(`${config.BASE_URL}${url}`, formData , authHeaderFormData())
    .then(cb)
    .catch(err);
};

export const apiPutAuth = (url, params, cb, err) => {
  axios
    .put(`${config.BASE_URL}${url}`, params, authHeader())
    .then(cb)
    .catch(err);
};

export const apiGetAuth = (url, cb, err) => {
  axios.get(`${config.BASE_URL}${url}`, authHeader()).then(cb).catch(err);
};

export const apiGet = (url, cb, err, params) => {
  axios.get(`${config.BASE_URL}${url}`, { params }).then(cb).catch(err);
};

export const asyncApiGet = (url) => axios.get(`${config.BASE_URL}${url}`);
