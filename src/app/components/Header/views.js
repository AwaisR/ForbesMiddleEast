import React from "react";
import _ from "lodash";
import Cookies from "js-cookie";
import { Icon, Button } from "antd";
import { NavLink } from "react-router-dom";

import { isLoggedIn } from "@utils";
import SearchIcon from "@images/search.svg";
import { MobileHamburger } from "@icons";
import config from "@config";
import Login from "./Login";
import style from "./styles.scss";

const handleChangeLanguage = (language) => {
  // Cookies.set("i18next", language === "en" ? "ar" : "en");
  // Cookies.set("language", language === "en" ? "ar" : "en");
  setTimeout(() => {
    window.location.href = language === "en" ? "/ar" : "/";
    // window.location.reload();
  }, 1000);
};

export const SubNav = ({ triggerBookmarkVisibility, t, language, logOut }) => (
  <ul
    className={`${style.menu__sub} ${
      language === "ar" ? style.menu__sub__ar : ""
    }`}
  >
    {isLoggedIn() ? (
      <>
        <li>
          <NavLink
            to={language === "ar" ? "/ar/my-account" : "/my-account"}
            activeClassName="active"
          >
            {t("myAccount")}
          </NavLink>
        </li>
        <li>
          <NavLink
            to={language === "ar" ? "/ar/magazines/cart" : "/magazines/cart"}
            activeClassName="active"
          >
            {t("myCart")}
          </NavLink>
        </li>
        <li onClick={() => logOut(language)}>
          <a>{t("logout")}</a>
        </li>
      </>
    ) : (
      <>
        <li>
          <NavLink
            to={language === "ar" ? "/ar/login" : "/login"}
            activeClassName="active"
          >
            <Button type="primary">{t("login")}</Button>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={language === "ar" ? "/ar/register" : "/register"}
            activeClassName="active"
          >
            <Button type="primary">{t("register")}</Button>
          </NavLink>
        </li>
      </>
    )}
    <li onClick={triggerBookmarkVisibility}>
      <a>{t("myBookmarks")}</a>
    </li>
    <li onClick={() => handleChangeLanguage(language)}>
      <a className={language === "en" ? "font-arabic" : "font-english"}>
        {language === "ar" ? "English" : "العربية"}
      </a>
    </li>
  </ul>
);

export const MainNav = ({
  url,
  currentActiveKey,
  lightHeader,
  handleMouseEnter,
  handleMouseLeave,
  toggleSearch,
  headerCategories,
  setMobileMenuVisible,
  mobileMenuVisible,
  isUserLoggedIn,
  language,
}) => {
  return (
    <div className={style.menu__div}>
      <ul
        className={`${style.menu__main} ${
          lightHeader ? style.menu__main__light : null
        }`}
      >
        {_.map(headerCategories, (item) => {
          const key = item.slug;
          if (
            _.indexOf(["undefined", "uncategorized", "list"], key) >= 0 &&
            !item.hideHandler
          ) {
            return null;
          }
          if (item.slug === "magazines" && !isUserLoggedIn) {
            return null;
          }
          return (
            <li
              key={key}
              data-category={item.slug}
              onMouseEnter={() =>
                item.hideHandler ? null : handleMouseEnter(item.slug, item.name)
              }
              onMouseLeave={item.hideHandler ? null : handleMouseLeave}
              className={
                currentActiveKey === key ||
                (url.indexOf(key) >= 0 && currentActiveKey === "")
                  ? lightHeader
                    ? style.menu__main__active__light
                    : style.menu__main__active
                  : ""
              }
            >
              <NavLink
                to={`${language === "ar" ? "/ar" : ""}/${
                  item.slug === "lists" ? "list" : item.slug
                }`}
                activeClassName={
                  lightHeader
                    ? style.menu__main__active__light
                    : style.menu__main__active
                }
              >
                {language === "ar"
                  ? item.nameAR
                    ? item.nameAR
                    : item.name
                  : item.name}
              </NavLink>
            </li>
          );
        })}
      </ul>
      <div
        className={`${style.menu__icons} ${
          language === "ar" ? style.menu__icons__ar : null
        }`}
      >
        <img src={SearchIcon} onClick={toggleSearch} />
        {/* <Icon
          component={MobileHamburger}
          onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
          className={style.menu__hamburger}
        /> */}
        <div
          onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
          id="nav-icon"
          className={`${mobileMenuVisible ? "open" : ""} ${
            style.menu__hamburger
          }`}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};
