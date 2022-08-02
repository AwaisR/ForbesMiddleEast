import React from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import { Row, Col } from "antd";
import { useTranslation } from "react-i18next";

import ArticleItem from "@components/ArticleItem";
import Breadcrumbs from "@components/Breadcrumbs";
import Container from "@components/Container";
import facebook from "@images/social-logos/facebook.svg";
import linkedIn from "@images/social-logos/linkedin.svg";
import twitter from "@images/social-logos/twitter.svg";
import style from "./styles.scss";
import { getImageUrl, extractLanguage } from "@utils";
import config from "@config";

const RelatedArticles = ({ blogs, t }) => {
  return (
    <div className={style.related}>
      <h2 className="h5">{t("relatedArticles")}</h2>
      <Row gutter={25} type="flex">
        {_.map(blogs, (item, index) => {
          return (
            <Col md={8} lg={12} key={index} style={{ marginBottom: 27 }}>
              <ArticleItem medium data={item} tag="h3" />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

const Author = ({ loadedData: { socialLinks, user }, ...props }) => {
  const socialIcons = {
    facebook,
    linkedIn,
    twitter
  };
  const { t } = useTranslation();
  const language = extractLanguage(props.location.pathname);
  const isEnglish = language !== "ar";
  const authorName = isEnglish
    ? `${user.firstName} ${user.lastName ? user.lastName : ""}`
    : `${user.firstNameAR} ${user.lastNameAR ? user.lastNameAR : ""}`;

  return (
    <Container>
      <Breadcrumbs
        trail={[
          {
            title: t("forbes"),
            slug: "/"
          },
          {
            title: t("authors")
            // slug: '/Authors',
          }
          // {
          //   title: name,
          //   slug: '',
          // },
        ]}
      />
      <Row gutter={25} type="flex">
        <Col
          lg={{
            span: 16,
            offset: !isEnglish ? 8 : 0
          }}
        >
          <div className={`${style.header} ${!isEnglish && style.header__ar}`}>
            <img src={getImageUrl(user.userAvatar)} alt={authorName} />
            <div>
              <h1 className="h3">{authorName}</h1>
              <span>{user.title ? user.title : null}</span>
              <ul
                className={`${style.social} ${!isEnglish && style.social__ar}`}
              >
                {_.map(socialLinks, (val, key) => {
                  return val ? (
                    <li>
                      <a href={val} target="_blank">
                        <img src={socialIcons[key]} />
                      </a>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </div>
          <div className={style.content}>
            <p>
              {!isEnglish
                ? user.descriptionAR
                  ? user.descriptionAR
                  : user.description
                : user.description}
            </p>
          </div>
          <RelatedArticles blogs={user.blogs} t={t} />
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(Author);
