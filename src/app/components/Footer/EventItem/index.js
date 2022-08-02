import React from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { useTranslation } from "react-i18next";

import style from "../styles.scss";

const EventItem = ({ footerEvents }) => {
  const {
    i18n: { language }
  } = useTranslation();

  return (
    <ul className={style.event}>
      {_.map(footerEvents, article => {
        return (
          <li
            key={article.slug}
            className={`${style.listing} ${language === "ar" &&
              style.listing__ar}`}
          >
            <Link to={`/events/${article.slug}`}>{article.name}</Link>
          </li>
        );
      })}
    </ul>
  );
};
export default EventItem;
