import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

import style from "./styles.scss";

import { extractLanguage } from "@utils";
import Container from "@components/Container";
import LogoWhite from "@images/logo-white.svg";
import SearchClose from "@images/search-close.svg";
import ArrowRight from "@images/arrow-right-line.svg";
// const defaultLang = Cookies.get("language") || "en";

const AppSearch = ({ visible, onCancel, history, ...props }) => {
  const defaultLang = extractLanguage(props.location.pathname);
  const [value, setValue] = useState("");
  const { t } = useTranslation();
  const placeholder = t("searchForbes");
  const handleChange = (e) => {
    setValue(e.target.value);
    if (e.keyCode === 13) {
      submit();
      onCancel();
    }
  };

  const submit = () => {
    history.push(
      `${defaultLang === "ar" ? "/ar" : ""}/search?q=${value}&tab=articles`
    );
  };

  return (
    <div className={`${style.search} ${visible ? style.search__show : ""}`}>
      <Container className={style.container}>
        <img src={LogoWhite} />
        <div className={style.search__close} onClick={onCancel}>
          <img src={SearchClose} />
        </div>
        <div
          className={`${style.search__inputwrapper} ${
            defaultLang === "ar" && style.search__inputwrapper__ar
          }`}
        >
          <input
            type="text"
            placeholder={defaultLang === "ar" ? "بحث فوربس" : "Search Forbes"}
            // value={value}
            onKeyUp={handleChange}
            className={style.search__input}
          />
          <img src={ArrowRight} onClick={submit} />
        </div>
      </Container>
    </div>
  );
};

export default withRouter(AppSearch);
