import React from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import { Row, Col, Icon } from "antd";
import Cookies from "js-cookie";
import _ from "lodash";
import { Query } from "react-apollo";
import client from "@apolloClient";
import { getBlogCategories } from "@queries";

import Login from "./Login";
import Search from "./Search";
import Bookmarks from "./Bookmarks";
import style from "./styles.scss";
import { siteMap, subCategories } from "./config";
import { MobileHamburger } from "@icons";
import Logo from "@images/logo-white.svg";
import SearchIcon from "@images/search.svg";
import Container from "@components/Container";

const defaultLang = Cookies.get("forbesme_language") || "en";
const handleChangeLanguage = () => {
  Cookies.set("forbesme_language", defaultLang === "en" ? "ar" : "en");
  window.location.reload();
};
const SubNav = ({ triggerBookmarkVisibility }) => (
  <ul className={style.menu__sub}>
    <li>
      <NavLink to="/my-account" activeClassName="active">
        My Account
      </NavLink>
    </li>
    <li>
      <NavLink to="/magazines/cart" activeClassName="active">
        My Cart
      </NavLink>
    </li>
    <li onClick={triggerBookmarkVisibility}>
      <a>My Bookmarks</a>
    </li>
    <li>
      <a>
        <Login />
      </a>
    </li>
    <li onClick={handleChangeLanguage}>
      <a className={defaultLang === "en" ? "font-arabic" : ""}>
        {defaultLang === "ar" ? "English" : "العربية"}
      </a>
    </li>
  </ul>
);

const MainNav = ({
  url,
  currentActive,
  lightHeader,
  handleMouseEnter,
  handleMouseLeave,
  toggleSearch
}) => {
  return (
    <ul
      className={`${style.menu__main} ${
        lightHeader ? style.menu__main__light : null
      }`}
    >
      {_.map(siteMap, item => {
        const key = item.title.toLowerCase();
        return (
          <li
            key={key}
            data-category={key}
            className={
              currentActive === key ||
              (url.indexOf(key) >= 0 && currentActive === "")
                ? lightHeader
                  ? style.menu__main__active__light
                  : style.menu__main__active
                : ""
            }
          >
            <NavLink
              to={`/${key}`}
              activeClassName="active"
              onMouseEnter={() => handleMouseEnter(key)}
              onMouseLeave={handleMouseLeave}
            >
              {item.title}
            </NavLink>
          </li>
        );
      })}
      <li style={{ marginLeft: 15, cursor: "pointer" }} onClick={toggleSearch}>
        <img src={SearchIcon} />
      </li>
    </ul>
  );
};

const DropdownMenu = ({
  subCats,
  showDropdown,
  currentActive,
  lightHeader,
  handleMenuDropdownHover,
  handleMouseLeave
}) => {
  const splitted = _.chunk(subCats, 2);
  return (
    <div
      gutter={25}
      onMouseEnter={handleMenuDropdownHover}
      onMouseLeave={handleMouseLeave}
      data-category={currentActive}
      className={`${style.menu__dropdown} ${
        lightHeader ? style.menu__dropdown__light : null
      } ${
        showDropdown && subCats && subCats.length
          ? style.menu__dropdown__active
          : ""
      }`}
    >
      <Container>
        <Row>
          {//currentActive !== ''
          true ? (
            <>
              <Col span={5} offset={3}>
                <ul>
                  {_.map(splitted[0], (item, index) => {
                    const slug = item.slug
                      ? item.slug
                      : item.title.toLowerCase().replace(" ", "-");
                    return (
                      <li key={index}>
                        <a href={slug}>{item.title}</a>
                      </li>
                    );
                  })}
                </ul>
              </Col>
              <Col span={5}>
                <ul>
                  {_.map(splitted[1], (item, index) => {
                    const slug = item.slug
                      ? item.slug
                      : item.title.toLowerCase().replace(" ", "-");
                    return (
                      <li key={index}>
                        <a href={slug}>{item.title}</a>
                      </li>
                    );
                  })}
                </ul>
              </Col>
            </>
          ) : null}
        </Row>
      </Container>
    </div>
  );
};

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.$headerWrapper = null;
    this.state = {
      visible: false,
      showDropdown: false,
      currentActive: "",
      bookMarksVisible: false,
      headerTop: false,
      headerSticky: false,
      previousScroll: 0
    };
  }

  headerEventListener = e => {
    const topOffset = window.scrollY;
    this.setState({ headerTop: topOffset > 300 });
    if (topOffset > 300) {
      this.$headerWrapper.classList.add("top");
    } else {
      this.$headerWrapper.classList.remove("top");
    }
    if (topOffset > this.state.previousScroll || topOffset < 500) {
      this.$headerWrapper.classList.remove("sticky");
    } else if (topOffset < this.state.previousScroll) {
      this.$headerWrapper.classList.add("sticky");
      // Additional checking so the header will not flicker
      if (topOffset > 250) {
        this.$headerWrapper.classList.add("sticky");
      } else {
        this.$headerWrapper.classList.remove("sticky");
      }
    }

    this.setState({ previousScroll: topOffset });
  };

  componentDidMount() {
    this.$headerWrapper = document.getElementsByClassName("header-wrapper")[0];
    window.removeEventListener("scroll", this.headerEventListener, true);
    window.addEventListener("scroll", this.headerEventListener, true);
  }

  toggleSearch = () => {
    this.setState({ visible: !this.state.visible });
  };

  switchLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  handleMouseEnter = key => {
    clearTimeout(this.leaveTimeout);
    this.enterTimeout = setTimeout(
      () => {
        this.setState({
          currentActive: key
        });
        this.handleDropdown(true);
        clearTimeout(this.enterTimeout);
      },
      this.state.showDropdown ? 0 : 350
    );
  };

  handleMouseLeave = () => {
    clearTimeout(this.enterTimeout);
    this.leaveTimeout = setTimeout(
      () =>
        this.setState({
          currentActive: ""
        }),
      500
    );
    this.handleDropdown(false);
  };

  handleDropdown = bool => {
    this.setState({
      showDropdown: bool
    });
  };

  handleMenuDropdownHover = () => {
    clearTimeout(this.leaveTimeout);
    this.handleDropdown(true);
  };

  triggerBookmarkVisibility = () => {
    this.setState({ bookMarksVisible: !this.state.bookMarksVisible });
  };

  render() {
    const {
      visible,
      showDropdown,
      currentActive,
      bookMarksVisible,
      headerTop,
      headerSticky
    } = this.state;
    const { lightHeader } = this.props;
    const subCats = subCategories[currentActive];
    const { url } = this.props.match;
    return (
      <>
        <div className="header-wrapper">
          <Query
            client={client}
            query={getBlogCategories}
            // onCompleted={() => this.setLoading(false)}
          >
            {({ loading, error, data: { blogcategories }, fetchMore }) => {
              if (loading) return <div>Loading</div>;
              const grouped = _.groupBy(blogcategories, "parent.name");
              return (
                <>
                  <header
                    className={`${style.header} ${
                      lightHeader ? style.header__light : null
                    } ${headerTop && style.header__top} ${headerSticky &&
                      style.header__sticky}`}
                  >
                    <div>
                      <Link to="/">
                        <img src={Logo} />
                      </Link>
                      {loading ? null : (
                        <div className={style.menu__container}>
                          <SubNav
                            triggerBookmarkVisibility={
                              this.triggerBookmarkVisibility
                            }
                          />
                          <MainNav
                            currentActive={currentActive}
                            url={url}
                            lightHeader={lightHeader}
                            handleMouseEnter={this.handleMouseEnter}
                            handleMouseLeave={this.handleMouseLeave}
                            toggleSearch={this.toggleSearch}
                          />
                        </div>
                      )}
                      <Icon
                        component={MobileHamburger}
                        className={style.menu__hamburger}
                      />
                    </div>
                  </header>
                  <DropdownMenu
                    currentActive={currentActive}
                    subCats={subCats}
                    handleMenuDropdownHover={this.handleMenuDropdownHover}
                    handleMouseLeave={this.handleMouseLeave}
                    lightHeader={lightHeader}
                    showDropdown={showDropdown}
                  />
                </>
              );
            }}
          </Query>
        </div>
        <Search visible={visible} onCancel={this.toggleSearch} />
        <Bookmarks
          visible={bookMarksVisible}
          onClose={this.triggerBookmarkVisibility}
        />
      </>
    );
  }
}
export default withRouter(AppHeader);
