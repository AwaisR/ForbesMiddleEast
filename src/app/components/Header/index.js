import React, { useState, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import client from "@apolloClient";
import { getBlogCategories, getRecentBlogCategories } from "@queries";

import { setHeaderCategories } from "@redux/general-actions";
import Logo from "@images/logo-white.svg";

import style from "./styles.scss";
import DropdownMenu from "./DropdownMenu";
import MobileMenu from "./MobileMenu";
import Search from "./Search";
import Bookmarks from "./Bookmarks";
import { MainNav, SubNav } from "./views";
import { siteMap, siteMapAR } from "./config";
import { extractLanguage, clearLogin, isLoggedIn } from "@utils";

const AppHeader = ({
  lightHeader,
  setHeaderCategories,
  headerCategories,
  match: { url },
  ...props
}) => {
  const [loading, setLoading] = useState(!headerCategories.length);
  const [headerTop, setHeaderTop] = useState(false);
  const [headerSticky, setHeaderSticky] = useState(false);
  const [currentActiveKey, setCurrentActiveKey] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [bookMarksVisible, setBookMarksVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isUserLoggedIn, setIsLoggedIn] = useState(false);

  let previousScroll = 0;
  let leaveTimeout = null;
  let enterTimeout = null;
  let $headerWrapper = null;
  const { t } = useTranslation();
  const language = extractLanguage(props.location.pathname);

  useEffect(() => {
    if (searchVisible) {
      setMobileMenuVisible(false);
      setBookMarksVisible(false);
    }
  }, [searchVisible]);

  useEffect(() => {
    if (bookMarksVisible) {
      setMobileMenuVisible(false);
      setSearchVisible(false);
    }
  }, [bookMarksVisible]);

  useEffect(() => {
    if (mobileMenuVisible) {
      setSearchVisible(false);
      setBookMarksVisible(false);
    }
  }, [mobileMenuVisible]);

  useEffect(() => {
    if (!headerCategories.length) {
      getHeaderItems();
    }
    $headerWrapper = document.getElementsByClassName("header-wrapper")[0];
    window.removeEventListener("scroll", headerEventListener, true);
    window.addEventListener("scroll", headerEventListener, true);
    setIsLoggedIn(isLoggedIn());
  }, []);

  const getHeaderItems = async () => {
    const response = await client.query({
      query: getBlogCategories,
    });
    const {
      data: { blogcategories, companyblogcategories },
    } = response;

    const t = blogcategories;
    let obj = {};
    _.map(t, (item, index) => {
      if (item.parent) {
        if (!obj[item.parent.slug]) {
          obj[item.parent.slug] = item.parent;
          obj[item.parent.slug].items = [];
          obj[item.parent.slug].publishedDate = item.parent.publishedDate;
        }
        obj[item.parent.slug].items.push(item);
      }
    });
    obj = _.sortBy(obj, "publishedDate").reverse();
    _.map(companyblogcategories, (item, index) => {
      if (item.blogcategory && item.blogcategory.id) {
        const i = _.findIndex(obj, { id: item.blogcategory.id });
        if (i >= 0) {
          item.company.isBrandvoice = true;
          obj[i].items.push(item.company);
        }
      }
    });
    // console.log(obj);
    _.map(obj, (item, index) => {
      item.items = _.sortBy(item.items, "publishedDate").reverse();
    });
    setHeaderCategories(obj);
    setLoading(false);
  };

  const getRecentItems = async (name) => {
    // console.log("name", name);
    let activeCategory = _.filter(
      headerCategories,
      (item) => item.slug === name.toLowerCase()
    )[0];
    if (
      activeCategory &&
      activeCategory.blogs &&
      activeCategory.blogs.length > 0
    ) {
      return;
    } else {
      const response = await client.query({
        query: getRecentBlogCategories,
        variables: {
          where: {
            status: "Published",
            category_null: false,
            category: {
              parent: {
                slug: name,
              },
            },
            language,
          },
        },
      });
      const {
        data: { blogs },
      } = response;

      let newCategories = headerCategories;
      newCategories = _.map(newCategories, (category) => {
        if (category.slug === activeCategory.slug) {
          category.blogs = blogs;
        }
        return category;
      });
      setHeaderCategories(newCategories);
    }
  };

  const headerEventListener = (e) => {
    const topOffset = window.scrollY;
    setHeaderTop(topOffset > 300);

    if (topOffset > 300) {
      $headerWrapper.classList.add("dark");
    } else {
      $headerWrapper.classList.remove("dark");
    }
    // if (topOffset > previousScroll || topOffset < 500) {
    //   $headerWrapper.classList.remove("sticky");
    // } else if (topOffset < previousScroll) {
    //   $headerWrapper.classList.add("sticky");
    //   // Additional checking so the header will not flicker
    //   if (topOffset > 250) {
    //     $headerWrapper.classList.add("sticky");
    //   } else {
    //     $headerWrapper.classList.remove("sticky");
    //   }
    // }
    // previousScroll = topOffset;
  };

  const handleDropdown = (bool) => {
    setShowDropdown(bool);
  };

  const handleMouseEnter = (key, name) => {
    clearTimeout(leaveTimeout);
    enterTimeout = setTimeout(
      () => {
        getRecentItems(key);
        setCurrentActiveKey(key);
        handleDropdown(true);
        clearTimeout(enterTimeout);
      },
      showDropdown ? 400 : 400
    );
  };

  const handleMouseLeave = () => {
    clearTimeout(enterTimeout);
    leaveTimeout = setTimeout(() => {
      handleDropdown(false);
      setCurrentActiveKey("");
    }, 500);
  };

  const handleMenuDropdownHover = () => {
    clearTimeout(leaveTimeout);
    handleDropdown(true);
  };

  const triggerBookmarkVisibility = () => {
    setBookMarksVisible(!bookMarksVisible);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const logOut = (lang) => {
    clearLogin();
    window.location.href = lang === "ar" ? "/ar/" : "/";
  };

  let subCategories = _.filter(
    headerCategories,
    (item) => item.slug === currentActiveKey
  );
  // console.log(currentActiveKey, headerCategories);
  subCategories = subCategories[0] && subCategories[0].items;
  const additionalSiteMap = language === "ar" ? siteMapAR : siteMap;

  return (
    <div>
      <div className="header-wrapper">
        <header
          className={`${style.header} ${
            language === "ar" && style.header__ar
          } ${lightHeader ? style.header__light : null} ${
            headerTop && style.header__top
          } ${headerSticky && style.header__sticky}`}
        >
          <div>
            <Link to={language === "ar" ? "/ar" : ""}>
              <img
                src={Logo}
                alt="Forbes Middle East"
                className={style.header__logo}
              />
            </Link>
            {loading ? null : (
              <div className={style.menu__container}>
                <SubNav
                  t={t}
                  triggerBookmarkVisibility={triggerBookmarkVisibility}
                  lightHeader={lightHeader}
                  language={language}
                  logOut={logOut}
                />
                <MainNav
                  t={t}
                  headerCategories={[...headerCategories, ...additionalSiteMap]}
                  url={url}
                  currentActiveKey={currentActiveKey}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  mobileMenuVisible={mobileMenuVisible}
                  setMobileMenuVisible={setMobileMenuVisible}
                  toggleSearch={toggleSearch}
                  lightHeader={lightHeader}
                  language={language}
                  isUserLoggedIn={isUserLoggedIn}
                />
              </div>
            )}
          </div>
        </header>
      </div>
      <DropdownMenu
        handleMenuDropdownHover={handleMenuDropdownHover}
        handleMouseLeave={handleMouseLeave}
        currentActiveKey={currentActiveKey}
        showDropdown={showDropdown}
        subCategories={subCategories}
        language={language}
      />
      <MobileMenu
        headerCategories={[...headerCategories, ...additionalSiteMap]}
        mobileMenuVisible={mobileMenuVisible}
        setMobileMenuVisible={setMobileMenuVisible}
        triggerBookmarkVisibility={triggerBookmarkVisibility}
        language={language}
        logOut={logOut}
      />
      <Bookmarks
        visible={bookMarksVisible}
        onClose={triggerBookmarkVisibility}
      />
      <Search
        visible={searchVisible}
        onCancel={toggleSearch}
        t={t}
        placeholder={t("searchForbes")}
      />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { headerCategories } = state.generalReducer;
  return {
    headerCategories,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setHeaderCategories }, dispatch);
};

const RoutedHeader = withRouter(AppHeader);
export default connect(mapStateToProps, mapDispatchToProps)(RoutedHeader);
