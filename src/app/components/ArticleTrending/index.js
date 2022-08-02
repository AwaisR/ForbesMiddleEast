import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ArticlePopular from "@components/ArticlePopular";
import style from "./styles.scss";

import client from "@apolloClient";
import { getMostRecentBlogs } from "@queries";
import { extractLanguage } from "@utils";

// const defaultLang = Cookies.get("language") || "en";
// const isEnglish = defaultLang !== "ar";

const Trending = ({ title, ignoreParentUrl, categoryQuery, ...props }) => {
  const language = extractLanguage(props.location.pathname);
  const [popular, setPopular] = useState([]);
  const { t } = useTranslation();
  useEffect(() => {
    getPopular();
  }, []);

  const getPopular = async () => {
    const response = await client.query({
      query: getMostRecentBlogs,
      variables: {
        where: {
          language,
          status: "Published",
          category_null: false,
          ...categoryQuery
        }
      }
    });
    const { blogs } = response.data;
    setPopular(blogs);
  };
  return (
    <div
      className={`${style.popular} ${language === "ar" && style.popular__ar}`}
    >
      <h6 className={style.h6}>
        {title} {t("recentArticles")}
      </h6>
      <ArticlePopular list={popular} ignoreParentUrl={ignoreParentUrl} />
    </div>
  );
};

export default withRouter(Trending);
