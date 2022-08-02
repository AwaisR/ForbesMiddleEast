import React, { useState } from "react";
import { Drawer, Menu } from "antd";
import { useTranslation } from "react-i18next";

import { NavLink, Link } from "react-router-dom";
import Cookies from "js-cookie";
import _ from "lodash";
import Logo from "@images/logo-white.svg";
import config from "@config";
import style from "./styles.scss";
const { SubMenu } = Menu;
import { isLoggedIn } from "@utils";
// const language = Cookies.get("language") || "en";

const handleChangeLanguage = (language) => {
  Cookies.set("i18next", language === "en" ? "ar" : "en");
  Cookies.set("language", language === "en" ? "ar" : "en");
  // Cookies.set(config.cookies.language, language === "en" ? "ar" : "en");
  setTimeout(() => {
    window.location.href = language === "en" ? "/ar" : "/";
    // window.location.reload();
  }, 1000);
};

const MobileMenu = ({
  mobileMenuVisible,
  setMobileMenuVisible,
  headerCategories,
  triggerBookmarkVisibility,
  language,
  logOut,
}) => {
  const { t } = useTranslation();
  return (
    <Drawer
      title={null}
      placement="right"
      closable={false}
      visible={mobileMenuVisible}
      width={350}
      className="mobile-menu-drawer"
      onClose={() => setMobileMenuVisible(false)}
    >
      <div className={style.mm__image}>
        <Link to="/">
          <img src={Logo} alt="Forbes Middle East" />
        </Link>
        <div>
          <a
            onClick={() => handleChangeLanguage(language)}
            className={language === "en" ? "font-arabic" : ""}
          >
            {language === "ar" ? "English" : "العربية"}
          </a>
          <a onClick={triggerBookmarkVisibility}>My bookmarks</a>
        </div>
        <div>
          {isLoggedIn() ? (
            <>
              <NavLink to="/my-account" activeClassName="active">
                {t("myAccount")}
              </NavLink>
              <NavLink to="/magazines/cart" activeClassName="active">
                {t("myCart")}
              </NavLink>
              <a onClick={logOut}>{t("logout")}</a>
            </>
          ) : (
            <>
              <NavLink to="/login" activeClassName="active">
                {t("login")}
              </NavLink>
              <NavLink to="/register" activeClassName="active">
                {t("register")}
              </NavLink>
            </>
          )}
        </div>
      </div>
      <div className={style.mm__menu}>
        <Menu mode="inline" theme="dark">
          {_.map(headerCategories, (category) => {
            if (
              _.indexOf(
                ["undefined", "uncategorized", "lists"],
                category.name.toLowerCase()
              ) >= 0 &&
              !category.hideHandler
            ) {
              return null;
            }
            // console.log(category);
            return category.items ? (
              <SubMenu
                key={category.name.toLowerCase()}
                data-category={category.slug}
                title={
                  <span>
                    <span>
                      {language === "en"
                        ? category.name
                          ? category.name
                          : null
                        : category.nameAR
                        ? category.nameAR
                        : category.name}
                    </span>
                  </span>
                }
              >
                <Menu.Item key={category.name.toLowerCase()}>
                  <Link
                    to={`${language === "ar" ? "/ar" : ""}/${category.slug}`}
                  >
                    {t("viewAll")}
                  </Link>
                </Menu.Item>
                {_.map(category.items, (item) => {
                  const isBrandvoice = item.isBrandvoice;
                  const isSameLanguage = item.language === language;
                  const name =
                    language === "en"
                      ? item.name
                      : item.nameAR
                      ? item.nameAR
                      : item.name;
                  return (isSameLanguage && !isBrandvoice) ||
                    (isSameLanguage && isBrandvoice) ||
                    (!isSameLanguage && !isBrandvoice) ? (
                    <Menu.Item
                      key={item.name.toLowerCase()}
                      className="mobile-nav-link"
                    >
                      <NavLink
                        activeClassName="active"
                        to={`${language === "ar" ? "/ar" : ""}/${
                          isBrandvoice ? "brandvoice" : category.slug
                        }/${item.slug}`}
                      >
                        {isBrandvoice ? item.brandvoice : name}
                      </NavLink>
                    </Menu.Item>
                  ) : null;
                })}
              </SubMenu>
            ) : (
              <Menu.Item
                key={category.name.toLowerCase()}
                data-category={category.name.toLowerCase()}
              >
                <NavLink
                  activeClassName="active"
                  to={`${language === "ar" ? "/ar" : ""}/${category.slug}`}
                >
                  {language === "en"
                    ? category.name
                      ? category.name
                      : null
                    : category.nameAR
                    ? category.nameAR
                    : category.name}
                </NavLink>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    </Drawer>
  );
};
export default MobileMenu;
