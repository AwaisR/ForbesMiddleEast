import React, { useState, useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Drawer } from "antd";
import Fade from "react-reveal/Fade";
import _ from "lodash";
import Container from "@components/Container";
import config from "@config";
import { setHeaderCategories } from "@redux/general-actions";
import style from "./styles.scss";

const RecentItem = ({ blog, activeBlogs, language }) => (
  <Fade>
    <Link
      className={style.recent__item}
      to={`${language === "ar" ? "/ar" : ""}/${activeBlogs.slug}/business/${
        blog.slug
      }`}
    >
      <img
        alt={blog.title}
        width={175}
        src={`https://d1epq84pwgteub.cloudfront.net/${blog.featuredImage}`}
        className={style.recent__item__image}
      />
      <div>
        <h6>{blog.title}</h6>
      </div>
    </Link>
  </Fade>
);

const DropdownMenu = ({
  subCategories,
  showDropdown,
  currentActiveKey,
  lightHeader,
  handleMenuDropdownHover,
  handleMouseLeave,
  setHeaderCategories,
  headerCategories,
  language,
}) => {
  const [currentActiveName, setCurrentActiveName] = useState("");
  const length = (subCategories && subCategories.length) || 0;
  const index = (subCategories && Math.ceil(subCategories.length / 2)) || 0;
  const left = _.slice(subCategories, 0, index);
  const right = _.slice(subCategories, index, length);

  // const getRecentItems = async name => {
  //   let activeCategory = _.filter(
  //     headerCategories,
  //     item => item.name.toLowerCase() === currentActiveKey
  //   )[0];

  //   let activeSubCategory = _.filter(
  //     activeCategory.items,
  //     item => item.name === name
  //   )[0];
  //   if (
  //     activeSubCategory &&
  //     activeSubCategory.blogs &&
  //     activeSubCategory.blogs.length > 0
  //   ) {
  //     return;
  //   } else {
  //     const response = await client.query({
  //       query: getRecentBlogCategories,
  //       variables: {
  //         where: {
  //           category: {
  //             name: name
  //           },
  //           language: "en"
  //         }
  //       }
  //     });
  //     const {
  //       data: { blogs }
  //     } = response;

  //     let newCategories = headerCategories;
  //     newCategories = _.map(newCategories, category => {
  //       if (category.name === activeCategory.name) {
  //         _.map(category.items, sub => {
  //           if (sub.name === name) {
  //             sub.blogs = blogs;
  //           }
  //         });
  //       }
  //       return category;
  //     });

  //     setHeaderCategories(newCategories);
  //   }
  // };

  const handleSubItemHover = (name) => {
    // getRecentItems(name);
  };

  const activeBlogs =
    currentActiveKey &&
    _.filter(headerCategories, (item) => item.slug === currentActiveKey)[0];
  return (
    <div>
      <Drawer
        placement="top"
        // className="dropdown-drawer"
        header={null}
        closable={false}
        visible={showDropdown}
        data-category={currentActiveKey}
        className={`dropdown-drawer ${style.menu__dropdown} ${
          lightHeader ? style.menu__dropdown__light : null
        } ${
          showDropdown && subCategories && subCategories.length
            ? style.menu__dropdown__active
            : ""
        }`}
      >
        <Container
          onMouseEnter={handleMenuDropdownHover}
          onMouseLeave={() => {
            handleMouseLeave();
            setTimeout(() => setCurrentActiveName(""), 700);
          }}
          className={style.menu__dropdown__container}
        >
          <Row>
            <Col span={5} offset={3}>
              <ul>
                {_.map(left, (item, index) => {
                  const isBrandvoice = item.isBrandvoice;
                  const isSameLanguage = item.language === language;
                  return (
                    <li key={index}>
                      {!isBrandvoice ? (
                        <Link
                          to={`${language === "ar" ? "/ar" : ""}/${
                            item.parent && item.parent.slug
                          }/${item.slug}`}
                          onMouseEnter={() => handleSubItemHover(item.name)}
                          data-category={item.parent && item.parent.slug}
                        >
                          {language === "ar"
                            ? item.nameAR
                              ? item.nameAR
                              : item.name
                            : item.name}
                        </Link>
                      ) : isSameLanguage ? (
                        <Link
                          to={`${language === "ar" ? "/ar" : ""}/brandvoice/${
                            item.slug
                          }`}
                          onMouseEnter={() => handleSubItemHover(item.name)}
                          // data-category={item.parent.slug}
                        >
                          {item.brandvoice ? item.brandvoice : item.name}
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </Col>
            <Col span={5}>
              <ul>
                {_.map(right, (item, index) => {
                  const isBrandvoice = item.isBrandvoice;
                  const isSameLanguage = item.language === language;
                  return (
                    <li key={index}>
                      {!isBrandvoice ? (
                        <Link
                          to={`${language === "ar" ? "/ar" : ""}/${
                            item.parent && item.parent.slug
                          }/${item.slug}`}
                          onMouseEnter={() => handleSubItemHover(item.name)}
                          data-category={item.parent && item.parent.slug}
                        >
                          {language === "ar"
                            ? item.nameAR
                              ? item.nameAR
                              : item.name
                            : item.name}
                        </Link>
                      ) : isSameLanguage ? (
                        <Link
                          to={`${language === "ar" ? "/ar" : ""}/brandvoice/${
                            item.slug
                          }`}
                          onMouseEnter={() => handleSubItemHover(item.name)}
                          // data-category={item.parent.slug}
                        >
                          {item.brandvoice ? item.brandvoice : item.name}
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </Col>
            <Col span={8}>
              {activeBlogs && activeBlogs.blogs
                ? _.map(activeBlogs.blogs, (blog) => (
                    <RecentItem
                      key={blog.slug}
                      activeBlogs={activeBlogs}
                      blog={blog}
                      language={language}
                    />
                  ))
                : null}
            </Col>
          </Row>
        </Container>
      </Drawer>
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

export default connect(mapStateToProps, mapDispatchToProps)(DropdownMenu);
