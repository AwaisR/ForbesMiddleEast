import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import _ from "lodash";
import { Row, Col, Tabs, Select, Icon, Empty, message } from "antd";
import qs from "querystring";
import moment from "moment";
import { useTranslation } from "react-i18next";

import { ListItem } from "@components/NonArticleBlocks";
import { PageSearching } from "@components/Loader";
import ArticleItem from "@components/ArticleItem";

import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import SearchIcon from "@images/search.svg";
import { getImageUrl, extractLanguage } from "@utils";
import { apiGet } from "@services";

import useDebounce from "./debounce";
import style from "./styles.scss";

const { TabPane } = Tabs;
const Option = Select.Option;

const Search = (props) => {
  const defaultLang = extractLanguage(props.location.pathname);
  const isEnglish = defaultLang !== "ar";

  const [activeKey, setActiveKey] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [articleBlogs, setArticleBlogs] = useState([]);
  const [articleLists, setArticleLists] = useState([]);
  const [articleAuthors, setArticleAuthors] = useState([]);
  const [isSearchQueryChanged, setSearchQueryChanged] = useState(false);
  const [dateFilter, setDateFilter] = useState(null);
  const debouncedSearchTerm = useDebounce(searchQuery, 800);

  const { t } = useTranslation();

  useEffect(() => {
    const query = qs.parse(encodeURI(props.history.location.search.substr(1)));
    if (query && query.q) {
      try {
        setSearchQuery(decodeURIComponent(query.q));
        // console.log("try");
      } catch (error) {
        // console.log("catch");
        setSearchQuery(query.q);
      }
    }
    if (query && query.tab) {
      setActiveKey(query.tab);
    } else {
      setActiveKey("articles");
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(debouncedSearchTerm);
    } else {
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    handleSearch(debouncedSearchTerm);
    // setSearching(true);
  }, [dateFilter]);

  const handleTextChange = (e) => {
    setSearchQuery(e.target.value);
    setSearchQueryChanged(true);
  };

  const handleTabChange = (key) => {
    if (key === "authors") {
      setDateFilter(null);
    }
    setActiveKey(key);
    setSearching(true);
    handleSearch(searchQuery, key);
  };

  const handleSearch = (searchString, key) => {
    if (!searchString) {
      return;
    }
    setSearching(true);
    const aKey = key ? key : activeKey;
    switch (aKey) {
      case "articles":
        searchArticleItems(
          isEnglish,
          searchString,
          (blogs) => {
            if (blogs) {
              setArticleBlogs(blogs);
              successCallback(aKey);
            }
          },
          dateFilter
        );
        break;
      case "lists":
        searchListItemsAPI(
          searchString,
          (lists) => {
            // console.log(lists);
            if (lists) {
              setArticleLists(lists);
              successCallback(aKey);
            }
          },
          dateFilter,
          defaultLang
        );
        break;
      case "authors":
        searchAuthorItems(isEnglish, searchString, (response) => {
          if (response) {
            setArticleAuthors(response);
            successCallback(aKey);
          }
        });
        break;
    }
  };

  const successCallback = (aKey) => {
    setSearchQueryChanged(false);
    setSearching(false);
    updatePageUrl(aKey);
  };

  const updatePageUrl = (aKey) => {
    window.history.replaceState(
      { q: debouncedSearchTerm, tab: aKey },
      "qs",
      `?q=${debouncedSearchTerm}&tab=${aKey}`
    );
  };

  const handleDateFilterSearch = (val) => {
    switch (val) {
      case "today":
        setDateFilter(moment().startOf("day").toISOString());
        break;
      case "this-month":
        setDateFilter(moment().startOf("month").toISOString());
        break;
      case "all-time":
        handleSearch(searchQuery, activeKey);
        setDateFilter(null);
        break;
    }
  };

  return (
    <Container>
      <Breadcrumbs
        trail={[
          {
            title: t("forbes"),
            slug: "/",
          },
          {
            title: t("search"),
            slug: "/search",
          },
        ]}
      />
      <Row>
        <Col span={24}>
          <div className={style.input}>
            <img src={SearchIcon} alt="search-icon" />
            <input
              value={searchQuery}
              onChange={handleTextChange}
              type="text"
              placeholder={t("search")}
            />
          </div>
        </Col>
        <Col span={24}>
          <p className={style.num}>
            {t("searchResultIntro")}{" "}
            {
              {
                articles: articleBlogs.length,
                lists: articleLists.length,
                authors: articleAuthors.length,
              }[activeKey]
            }{" "}
            {t(activeKey)} {t("searchResultEnd")}
          </p>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          {activeKey !== "authors" ? (
            <Select
              placeholder={t("sortBy")}
              suffixIcon={<Icon type="caret-down" />}
              className={`${style.sort} ${!isEnglish && style.sort__ar}`}
              onChange={handleDateFilterSearch}
            >
              <Option value="today">{t("today")}</Option>
              <Option value="this-month">{t("thisMonth")}</Option>
              <Option value="all-time">{t("allTime")}</Option>
            </Select>
          ) : null}

          <Tabs
            className="search-tabs"
            activeKey={activeKey}
            onChange={handleTabChange}
          >
            <TabPane tab={t("articles")} key="articles" disabled={searching}>
              <Row gutter={25} type="flex">
                {searching ? (
                  <Col xs={24}>
                    <PageSearching />
                  </Col>
                ) : articleBlogs.length ? (
                  _.map(articleBlogs, (item, index) => (
                    <Col
                      key={index}
                      md={12}
                      lg={8}
                      style={{ marginBottom: 25 }}
                    >
                      <ArticleItem data={item} medium />
                    </Col>
                  ))
                ) : (
                  <Col xs={24}>
                    <Empty description="" />
                  </Col>
                )}
              </Row>
            </TabPane>
            <TabPane tab={t("lists")} key="lists" disabled={searching}>
              <Row gutter={25} type="flex" className={style.articles}>
                {searching ? (
                  <Col xs={24}>
                    <PageSearching />
                  </Col>
                ) : articleLists.length ? (
                  _.map(articleLists, (item, index) => (
                    <Col
                      key={index}
                      sm={24}
                      md={12}
                      lg={8}
                      style={{ marginBottom: 25 }}
                    >
                      <ListItem list item={item} />
                    </Col>
                  ))
                ) : (
                  <Col xs={24}>
                    <Empty description="" />
                  </Col>
                )}
              </Row>
            </TabPane>
            <TabPane tab={t("authors")} key="authors" disabled={searching}>
              <Row gutter={25} type="flex" className={style.articles}>
                {searching ? (
                  <Col xs={24}>
                    <PageSearching />
                  </Col>
                ) : articleAuthors.length ? (
                  _.map(articleAuthors, (author, index) => (
                    <Col
                      key={index}
                      xs={12}
                      sm={12}
                      md={6}
                      lg={6}
                      style={{ marginBottom: 25 }}
                    >
                      <div className={style.author}>
                        <Link
                          to={`${isEnglish ? "" : "/ar"}/author/${
                            author && author.slug && author.slug.toLowerCase()
                          }`}
                        >
                          <img
                            src={getImageUrl(author.userAvatar)}
                            alt={`${author.firstName} ${author.lastName}`}
                          />
                          <h6>{`${
                            isEnglish ? author.firstName : author.firstNameAR
                          } ${
                            isEnglish ? author.lastName : author.lastNameAR
                          }`}</h6>
                          {isEnglish ? (
                            <span>{author.title ? author.title : null}</span>
                          ) : (
                            <span>
                              {author.titleAR ? author.titleAR : null}
                            </span>
                          )}
                        </Link>
                      </div>
                    </Col>
                  ))
                ) : (
                  <Col xs={24}>
                    <Empty description="" />
                  </Col>
                )}
              </Row>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

const searchArticleItems = async (
  isEnglish,
  searchQuery,
  callBack,
  dateFilter
) => {
  apiGet(
    "/blogs/search",
    (response) => {
      // console.log(response);
      callBack(response.data);
    },
    (err) => {
      window.location.reload();
    },
    {
      language: isEnglish ? "en" : "ar",
      query: searchQuery,
      publishedDate: dateFilter ? dateFilter : "",
    }
  );
};

const searchListItemsAPI = async (
  searchQuery,
  callBack,
  dateFilter,
  language
) => {
  apiGet(
    "/lists/search",
    (response) => {
      // console.log(response);
      callBack(response.data);
    },
    (err) => {
      window.location.reload();
    },
    {
      language: language,
      query: searchQuery,
      publishedDate: dateFilter ? dateFilter : "",
    }
  );
};

const searchAuthorItems = async (isEnglish, searchQuery, callBack) => {
  apiGet(
    "/users/search",
    (response) => {
      // console.log(response);
      callBack(response.data);
    },
    (err) => {
      window.location.reload();
    },
    {
      language: isEnglish ? "en" : "ar",
      username: searchQuery,
    }
  );
};

export default withRouter(Search);
