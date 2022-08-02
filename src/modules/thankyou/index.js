import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Container from "@components/Container";
import style from "./styles.scss";

const ThankYouPage = () => {
  const {
    i18n: { language }
  } = useTranslation();
  return (
    <Container className={style.container}>
      <h1 className="h2">Thank you for your subscription!</h1>
      <h2>Your subscription is now active</h2>
      <Link
        className="ant-btn ant-btn-primary"
        to={language === "ar" ? "/ar" : ""}
      >
        Go to Forbes
      </Link>
    </Container>
  );
};

export default ThankYouPage;
