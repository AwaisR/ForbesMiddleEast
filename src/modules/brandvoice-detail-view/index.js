import React, { useState, useEffect } from "react";
import { Row, Col, Avatar, Icon } from "antd";
import { withRouter, Link } from "react-router-dom";
import _ from "lodash";
import Cookies from "js-cookie";
import { Fade } from "react-reveal";
import { useTranslation } from "react-i18next";
import { LoadingMore } from "@components/Loader";
import Button from "@components/Button";
import Layout from "@components/Layout";
import Container from "@components/Container";
import ArticleItem from "@components/ArticleItem";
import Breadcrumbs from "@components/Breadcrumbs";
import SocialShare from "@components/SocialShare";
import { BookmarkArticlePage } from "@icons";
import {
  bookmarkItem,
  isItemBookmarked,
  getImageUrl,
  extractLanguage
} from "@utils";
import style from "./styles.scss";

const defaultLang = "en";
const BrandvoiceDetailView = ({ data, companyBlogs, history, ...props }) => {
  const {
    name,
    subtitle,
    bannerImage,
    featuredImage,
    slug,
    content,
    facebook,
    twitter,
    linkedIn
  } = data;
  const { t } = useTranslation();
  const image = getImageUrl(bannerImage);
  const companyImage = getImageUrl(featuredImage);
  const language = extractLanguage(props.location.pathname);
  const isEnglish = language !== "ar";

  const [isBookmarked, setIsBookmarked] = useState(
    isItemBookmarked(`/brandvoice/${encodeURIComponent(slug)}`)
  );
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    if (defaultLang === "ar") {
      history.push("/404");
    }
    getContributors();
  }, []);

  const handleBookMark = obj => {
    bookmarkItem(obj, bool => {
      setIsBookmarked(bool);
    });
  };

  const bookmarkObject = {
    type: "article",
    link: `/brandvoice/${encodeURIComponent(slug)}`,
    title: name
  };

  const getContributors = () => {
    if (companyBlogs.length) {
      let authorList = _.map(companyBlogs, item => {
        return item.author;
      });
      setContributors(_.uniqBy(authorList, "id"));
    }
  };

  return (
    <Layout lightHeader={true}>
      <div className={style.article__banner__wrapper}>
        <div
          className={style.article__banner}
          style={{ backgroundImage: `url(${image})` }}
        />
        <Container className={style.article__banner__text}>
          <Row gutter={25} type="flex">
            <Col span={24}>
              <div>
                <Fade
                  bottom
                  duration={700}
                  distance="100px"
                  delay={300}
                  ssrReveal
                >
                  <div className={style.article__title}>
                    <div
                      className={`${style.article__avatar} ${!isEnglish &&
                        style.article__avatar__ar}`}
                    >
                      <Avatar size={75} src={companyImage} shape="circle" />
                      <div>
                        <Breadcrumbs
                          className={style.breadcrumb}
                          trail={[
                            {
                              // title: t("forbes"),
                              title: "Forbes",
                              slug: isEnglish ? "/" : "/ar"
                            },
                            {
                              title: t("brandvoice"),
                              slug: `${isEnglish ? "" : "/ar"}/brandvoice`
                            }
                          ]}
                        />
                        <h2>{name}</h2>
                        <p>{subtitle}</p>
                        <SocialShare
                          directLink={true}
                          hideCopy={true}
                          socialAccounts={{
                            facebook,
                            twitter,
                            linkedIn
                          }}
                        />
                        <Button
                          type={
                            isBookmarked
                              ? "action__light__playing"
                              : "action__light"
                          }
                          style={{ width: "auto" }}
                          onClick={() => handleBookMark(bookmarkObject)}
                        >
                          {isBookmarked
                            ? t("removeFromBookmarks")
                            : t("addToBookmarks")}
                          <Icon component={BookmarkArticlePage} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* <ActionButtons /> */}
                </Fade>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className={style.container}>
        <h4>{name}</h4>
        <Row type="flex" gutter={25}>
          <Col
            xs={{ span: 24, order: 2 }}
            sm={{ span: 24, order: 2 }}
            md={{ span: 24, order: 2 }}
            lg={{ span: 16, order: 1 }}
          >
            <Row type="flex" gutter={25}>
              {_.map(companyBlogs, (blog, index) => {
                return (
                  <Col md={index === 0 ? 24 : 12} key={blog.id}>
                    <ArticleItem
                      featured={index === 0}
                      className={style.article__item}
                      data={blog}
                    />
                  </Col>
                );
              })}
            </Row>
          </Col>
          <Col
            xs={{ span: 24, order: 1 }}
            sm={{ span: 24, order: 1 }}
            md={{ span: 24, order: 1 }}
            lg={{ span: 8, order: 2 }}
          >
            <div className={style.brandvoice__about}>
              <div>
                <h6 className={style.h6}>{t("about")}</h6>
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
              <div>
                <h6 className={style.h6}>{t("ourContributors")}</h6>
                {_.map(contributors, contributor => (
                  <Link
                    to={`${isEnglish ? "" : "/ar"}/author/${contributor.slug &&
                      contributor.slug.toLowerCase()}`}
                    className={`${style.brandvoice__contributor} ${!isEnglish &&
                      style.brandvoice__contributor__ar}`}
                  >
                    <Avatar
                      size={45}
                      shape="circle"
                      src={contributor && getImageUrl(contributor.userAvatar)}
                      alt={contributor && contributor.username}
                    ></Avatar>
                    <h6>
                      {contributor.firstName} {contributor.lastName}
                    </h6>
                  </Link>
                ))}
              </div>
            </div>
          </Col>
        </Row>
        <LoadingMore />
      </Container>
    </Layout>
  );
};
export default withRouter(BrandvoiceDetailView);
