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
      <h1 className="h2">Page is being updated</h1>
      <p>
        Hi , This page is temporarily unavailable as part of website redesign.
        <br />
        For more details please contact us at{" "}
        <a href="mailto:techsupport@forbesmiddleeast.com">
          techsupport@forbesmiddleeast.com
        </a>
      </p>
      <Link
        className="ant-btn ant-btn-primary"
        to={language === "ar" ? "/ar" : "/"}
      >
        Go back to Home
      </Link>
    </Container>
  );
};

export default ThankYouPage;
