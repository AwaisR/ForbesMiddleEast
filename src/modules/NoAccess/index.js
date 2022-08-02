import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Layout from "@components/Layout";
import Container from "@components/Container";

import style from "./styles.scss";

const NoAccess = ({ full, redirectUrl }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();

  if (full) {
    return (
      <Layout>
        <Container className={style.container}>
          <h1 className="h2">{t("noAccess")}</h1>
          <h2>
            {t("noAccessSub")}{" "}
            <Link
              to={`${language === "ar" ? "/ar/login" : "/login"}${
                redirectUrl ? redirectUrl : ""
              }`}
            >
              {t("login")}
            </Link>
          </h2>
        </Container>
      </Layout>
    );
  }

  return (
    <Container className={style.container}>
      <h1 className="h2">{t("noAccess")}</h1>
      <h2>
        {t("noAccessSub")}{" "}
        <Link
          to={`${language === "ar" ? "/ar/login" : "/login"}${
            redirectUrl ? redirectUrl : ""
          }`}
        >
          {t("login")}
        </Link>
      </h2>
    </Container>
  );
};

export default NoAccess;
