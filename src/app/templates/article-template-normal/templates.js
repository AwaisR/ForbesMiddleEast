import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { Avatar, Icon, Row, Col } from "antd";
// import Cookies from "js-cookie";
import Button from "@components/Button";
import ArticleItem from "@components/ArticleItem";
import TextToSpeech from "@components/TextToSpeech";
import Author from "@components/Author";
import { BookmarkArticlePage, GoTo } from "@icons";
import TwitterColored from "@images/social-logos/twitter-colored.svg";
import style from "./styles.scss";
import { AdSlot } from "react-dfp";
import AdWrapper from "@ads";
import { isMobileOnly } from "react-device-detect";

// const defaultLang = Cookies.get("language") || "en";
// const isEnglish = defaultLang !== "ar";

export const AuthorFooter = ({ author, isEnglish }) => (
  <div className={style.article__author__footer}>
    <Author position={true} author={author} />
    <Row>
      <Col md={24} lg={24}>
        <p>{isEnglish ? author.description : author.descriptionAR}</p>
      </Col>
    </Row>
  </div>
);

export const ActionButtons = ({
  isBookmarked,
  paragraphs,
  handleBookMark,
  t,
}) => (
  <div className={style.action__buttons}>
    <Button
      type={isBookmarked ? "action__playing" : "action"}
      onClick={handleBookMark}
    >
      {isBookmarked ? t("removeFromBookmarks") : t("addToBookmarks")}
      <Icon component={BookmarkArticlePage} />
    </Button>
    <TextToSpeech text={paragraphs} t={t} />
  </div>
);

export const TwitterWidget = () => (
  <a className={style.twitter} href="twitter.com" target="_blank">
    <span>
      He made the comments during a conversation with historian and author Yuval
      Noah Harari that was uploaded to Facebook on Friday.
    </span>
    <img src={TwitterColored} />
  </a>
);

export const YouMayAlsoLike = ({ items, isEnglish }) => (
  <div className={style.ymal}>
    <div className={style.ymal__header}>
      <h6>You May Also Like</h6>
    </div>
    <div className={style.ymal__content}>
      {_.map(items, (blog) => {
        const { category, title, author, slug } = blog;
        const categoryName = (category && category.slug) || "";
        const categoryParent = category
          ? category.parent
            ? category.parent.slug
            : null
          : null;
        const cLink = `/${categoryParent}/${categoryName}`;
        return (
          <div key={slug}>
            <Link to={`/${category.parent.slug}`}>
              <p>
                {isEnglish
                  ? category.parent.name
                  : category.parent.nameAR
                  ? category.parent.nameAR
                  : category.parent.name}
              </p>
            </Link>

            <Link to={`${cLink}/${encodeURIComponent(slug)}`}>
              <h5>{title}</h5>
            </Link>
            <Author author={author} />
          </div>
        );
      })}
    </div>
  </div>
);

export const FeaturedPage = () => (
  <Row>
    <Col span={18}>
      {/* <Fade bottom duration={700} distance="100px" delay={100} ssrReveal={true}> */}
      <p>
        Facebook CEO Mark Zuckerberg said recently that he recognized the
        growing chorus of Indian voices demanding data localization, but
        asserted that meeting those demands could establish dangerous precedents
        in other countries where the potential for misuse remained high. He made
        the comments during a conversation with historian and author Yuval Noah
        Harari that was uploaded to Facebook on Friday.
      </p>
      <p>
        One of the more prominent voices demanding localization belongs to
        India’s richest man, Reliance Chairman Mukesh Ambani, who declared
        recently that Indian data should be owned exclusively by Indian
        citizens. His remarks have further fueled the debate raging over data
        localization in the world’s fastest growing internet market.
      </p>
      {/* </Fade> */}
    </Col>
    <Col span={6}>
      {/* <Fade bottom duration={700} distance="100px" delay={100} ssrReveal={true}> */}
      <a className={style.featuredpage}>
        <Avatar src="https://i.imgur.com/HDvi1oj.png" size={98} />

        <h6> Abdulla Bin Ahmed Al Ghurair </h6>
        <span className={style.featuredpage__span}>
          Lists <Icon component={GoTo} />
        </span>
      </a>
      {/* </Fade> */}
    </Col>
  </Row>
);

export const RelatedArticles = ({
  ignoreParentUrl,
  relatedArticles,
  t,
  isEnglish,
}) => {
  return (
    <div className={style.related}>
      <h2 className="h5">{t("relatedArticles")}</h2>
      <Row
        gutter={{
          xs: 0,
          sm: 25,
        }}
        type="flex"
      >
        {_.map(relatedArticles, (item, index) => {
          return index > 3 ? null : (
            <Col
              xs={24}
              md={12}
              lg={12}
              key={index}
              style={{ marginBottom: 27 }}
            >
              <ArticleItem
                ignoreParentUrl={ignoreParentUrl}
                tag="h3"
                medium
                data={item}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
