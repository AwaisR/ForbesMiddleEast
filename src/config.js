const isProduction = process.env.APP_ENV === "production";
export default {
  // BASE_URL: isProduction ? 'https://forbes-server.1020dev.com' : 'http://localhost:1337',
  BASE_URL: isProduction
    ? "https://backend.forbesmiddleeast.com"
    : "https://forbes-server.1020dev.com",
  mapsApiKey: "AIzaSyDM5O_SJEpZk2NoPONIAdUD0oQL5n1E9lA",
  shareUrls: {
    facebook: "https://www.facebook.com/sharer/sharer.php?u=",
    twitter: "https://twitter.com/intent/tweet?url=",
    linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=",
    whatsapp: "https://api.whatsapp.com/send?text=",
  },
  s3bucketLink: "https://d1epq84pwgteub.cloudfront.net/",
  CDN_FILES_URL: "https://d1epq84pwgteub.cloudfront.net/",
  S3_FILES_URL: "https://s3.us-east-2.amazonaws.com/forbesme-prestaging-media/",
  PRE_STAGING_URL:
    "https://forbesme-prestaging-media.s3.us-east-2.amazonaws.com/",
  FORBES_LIVE_IMAGE_URL: "https://forbesme-prestaging-media.s3.amazonaws.com/",
  cookies: {
    language: "language",
  },
  defaultImage:
    "https://d1epq84pwgteub.cloudfront.net/files/1/default-image.png",
  API_SECRET_KEY: "Nan8QSEn",
  API_SECRET_VALUE: "forbesme:",
  GOOGLE_CAPTCHA_KEY: "6Lewdu4UAAAAADdaKOb3ks_xstGFBJTVvkQj2H8a",
};
