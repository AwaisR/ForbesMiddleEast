import React from "react";
import _ from "lodash";
import { Link, withRouter } from "react-router-dom";
import { extractLanguage } from "@utils";
import style from "./styles.scss";

const ArticlePopular = ({ ignoreParentUrl, list, ...props }) => {
  const language = extractLanguage(props.location.pathname);
  return (
    <ul className={style.list}>
      {_.map(list, (item, index) => {
        const { title, category, slug } = item;
        const categoryName = (category && category.slug) || "";
        const categoryParent = category
          ? category.parent
            ? category.parent.slug
            : null
          : null;
        const cLink = ignoreParentUrl
          ? `${language === "ar" ? "/ar" : ""}/${categoryParent}/${slug}`
          : `${
              language === "ar" ? "/ar" : ""
            }/${categoryParent}/${categoryName}/${slug}`;

        return (
          <li key={index}>
            <Link to={cLink} className={style.title}>
              {title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default withRouter(ArticlePopular);
