import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Layout from "@components/Layout";
import Container from "@components/Container";
import SearchIcon from "@images/search.svg";

import style from "./styles.scss";

const Page404 = ({ history }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const handleTextChange = e => {
    setSearchQuery(e.target.value);
  };
  const handleSearch = e => {
    if (e.keyCode === 13) {
      // console.log(e.target.value);
      history.push(
        `${language === "ar" ? "/ar" : ""}/search?q=${
          e.target.value
        }&tab=articles`
      );
    }
  };

  return (
    <Layout>
      <Container className={style.container}>
        <h1 className="h2">{t("page404")}</h1>
        <h2>
          {t("page404Sub")}{" "}
          <Link to={language === "ar" ? "/ar" : ""}>{t("homepage")}</Link>
        </h2>
        <div className={style.input}>
          <img src={SearchIcon} alt="search-icon" />
          <input
            value={searchQuery}
            onChange={handleTextChange}
            onKeyUp={handleSearch}
            type="text"
            placeholder={t("search")}
          />
        </div>
      </Container>
    </Layout>
  );
};

export default withRouter(Page404);
