import Cookies from "js-cookie";
import _ from "lodash";
import config from "@config";

export const generateAvatarFromString = (str) =>
  str
    ? str
        .split(" ")
        .map((x) => x[0])
        .join("")
        .substring(0, 2)
    : "U";

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const generateRandomNumber = () => {
  return Math.floor(Math.random() * 100000000);
};

// For unescaping html characters
const htmlUnescapes = {
  "&amp;": "&",
  "&nbsp;": " ",
  "&rsquo;": "'",
  "&lsquo;": "'",
  "&ldquo;": '"',
  "&rdquo;": '"',
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};
const reEscapedHtml = /&(?:amp|lt|gt|quot|#39|nbsp|rsquo|rdquo|ldquo|lsquo);/g;
const reHasEscapedHtml = RegExp(reEscapedHtml);

function basePropertyOf(object) {
  return function (key) {
    return object == null ? undefined : object[key];
  };
}

function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
export const unescape = (string) => {
  string = String(string);
  return string && reHasEscapedHtml.test(string)
    ? string.replace(reEscapedHtml, basePropertyOf(htmlUnescapes))
    : string;
};

export const bookmarkItem = (data, cb) => {
  let newBookmarks = getBookmarks() || [];
  if (isItemBookmarked(data.link)) {
    _.remove(newBookmarks, data);
    Cookies.set("bookmarks", newBookmarks);
    cb(false);
  } else {
    newBookmarks = [...newBookmarks, data];
    Cookies.set("bookmarks", newBookmarks);
    cb(true);
  }
};

export const getBookmarks = () => {
  return Cookies.getJSON("bookmarks") || [];
};

export const isItemBookmarked = (link) => {
  const currentBookmarks = getBookmarks() || [];
  return Boolean(
    _.find(currentBookmarks, (bookmark) => bookmark.link === link)
  );
};

export const isUrlEncoded = (uri) => {
  uri = uri || "";
  return uri !== decodeURIComponent(uri);
};

export const getImageUrl = (image) => {
  const {
    CDN_FILES_URL,
    S3_FILES_URL,
    PRE_STAGING_URL,
    FORBES_LIVE_IMAGE_URL,
  } = config;
  return image
    ? CDN_FILES_URL +
        image
          .replace(CDN_FILES_URL, "")
          .replace(S3_FILES_URL, "")
          .replace(PRE_STAGING_URL, "")
          .replace(FORBES_LIVE_IMAGE_URL, "")
    : "https://d1epq84pwgteub.cloudfront.net/files/1/default-image.png";
};

export const extractLanguage = (url) => {
  return url.split("/").indexOf("ar") >= 0 ? "ar" : "en";
};

export const isLoggedIn = () => {
  if (typeof localStorage === "undefined") {
    return;
  }
  const token = localStorage.getItem("token");
  return token && token.length > 10;
};

export const getAuthToken = () => {
  if (typeof localStorage === "undefined") {
    return;
  }
  return localStorage.getItem("token");
};

export const setAuthToken = (token) => {
  if (typeof localStorage === "undefined") {
    return;
  }
  return localStorage.setItem("token", token);
};

export const clearLogin = () => {
  if (typeof localStorage === "undefined") {
    return;
  }
  return localStorage.clear();
};

export const getUser = () => {
  if (typeof localStorage === "undefined") {
    return;
  }

  let user = {};
  try {
    user = localStorage.getItem("user");
    user = JSON.parse(user);
  } catch (e) {
    user = {};
  }
  return user;
};

export const getUserAddress = (useraddresses) => {
  let address = {};
  const len = useraddresses && useraddresses.length;
  if (len) {
    for (let i = 0; i < len; i++) {
      const add = useraddresses[i];
      if (!add.isBilling && add.isActive) {
        address = add;
        break;
      }
    }
    if (Object.keys(address).length === 0) {
      address = useraddresses[0];
    }
  }
  return address;
};

export const getUserShippingAddress = (useraddresses) => {
  let address = {};
  let isShipping = false;
  const len = useraddresses && useraddresses.length;
  if (len) {
    for (let i = 0; i < len; i++) {
      const add = useraddresses[i];
      if (add.isShipping && add.isActive) {
        address = add;
        isShipping = true;
        break;
      }
    }
    if (Object.keys(address).length === 0) {
      address = useraddresses[0];
      isShipping = false;
    }
  }
  return {
    address: address,
    isShipping: isShipping,
  };
};

export const setUser = (userData) => {
  if (typeof localStorage === "undefined") {
    return;
  }

  let user = "";
  if (userData) {
    user = JSON.stringify(userData);
  }
  return localStorage.setItem("user", user);
};

export const setPaymentReference = (p_id) => {
  if (typeof localStorage === "undefined") {
    return;
  }
  localStorage.setItem("p_id", p_id);
};

export const getPaymentReference = (p_id) => {
  if (typeof localStorage === "undefined") {
    return;
  }
  return localStorage.getItem("p_id");
};

export const htmlToString = (str) => {
  return str.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");
};
