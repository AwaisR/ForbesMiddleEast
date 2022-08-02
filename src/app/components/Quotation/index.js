import React from "react";
import { Avatar, Icon } from "antd";
import { useTranslation } from "react-i18next";

import { Quote } from "@icons";
import config from "@config";
import style from "./styles.scss";

const Quotation = ({ className, quote }) => {
  const { qText, qImage, qPosition, qUserName } = quote;
  const {
    i18n: { language },
  } = useTranslation();
  const isEnglish = language !== "ar";
  return (
    <div
      className={`${style.quotation} ${className} ${
        !isEnglish && style.quotation__ar
      }`}
    >
      <div
        className={`${style.quotation__image} ${
          !isEnglish && style.quotation__image__ar
        }`}
      >
        <Avatar
          src={`${config.s3bucketLink}${qImage}`}
          shape="circle"
          size={96}
        />
        <p>{qUserName}</p>
        <p>{qPosition}</p>
      </div>
      <div
        className={`${style.quotation__content} ${
          !isEnglish && style.quotation__content__ar
        }`}
      >
        <Icon component={Quote} />
        <h3>{qText}</h3>
      </div>
    </div>
  );
};

export default Quotation;
