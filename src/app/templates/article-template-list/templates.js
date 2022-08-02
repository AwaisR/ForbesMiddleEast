import React from "react";
import _ from "lodash";
import { Avatar, Icon, Row, Col } from "antd";
import { Fade } from "react-reveal";
import Button from "@components/Button";
import ArticleItem from "@components/ArticleItem";
import Author from "@components/Author";
import TextToSpeech from "@components/TextToSpeech";
import { BookmarkArticlePage, GoTo } from "@icons";
import TwitterColored from "@images/social-logos/twitter-colored.svg";
import style from "./styles.scss";
import { isMobileOnly } from "react-device-detect";
import AdWrapper from "@ads";
import { AdSlot } from "react-dfp";

export const AuthorFooter = ({ author }) => (
  <div className={style.article__author__footer}>
    <Author position={true} author={author} />
    <Row>
      <Col span={18}>
        <p>
          I cover China with a focus on business and culture. I am pursuing a
          Master of Journalism degree at the University of Hong Kong. I have
          experiences in all aspects of mult..
        </p>
      </Col>
    </Row>
  </div>
);

export const ActionButtons = ({ t, paragraphs, isBookmarked }) => (
  <div className={style.action__buttons}>
    <Button type="action">
      {isBookmarked ? t("removeFromBookmarks") : t("addToBookmarks")}
      <Icon component={BookmarkArticlePage} />
    </Button>
    <TextToSpeech t={t} type="action" text={paragraphs} />
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

export const YouMayAlsoLike = () => (
  <div className={style.ymal}>
    <div className={style.ymal__header}>
      <h6>You May Also Like</h6>
    </div>
    <div className={style.ymal__content}>
      <div>
        <p>Brand Voice</p>
        <h5>
          Understanding The 2019 Ocean Freight Market Through The Lens Of 2018
        </h5>
        <Author footer={true} />
      </div>
      <div>
        <p>Brand Voice</p>
        <h5>
          Understanding The 2019 Ocean Freight Market Through The Lens Of 2018
        </h5>
        <Author footer={true} />
      </div>
    </div>
  </div>
);

export const FeaturedPage = () => (
  <Row>
    <Col span={18}>
      <Fade bottom duration={700} distance="100px" delay={100} ssrReveal={true}>
        <p>
          Facebook CEO Mark Zuckerberg said recently that he recognized the
          growing chorus of Indian voices demanding data localization, but
          asserted that meeting those demands could establish dangerous
          precedents in other countries where the potential for misuse remained
          high. He made the comments during a conversation with historian and
          author Yuval Noah Harari that was uploaded to Facebook on Friday.
        </p>
        <p>
          One of the more prominent voices demanding localization belongs to
          India’s richest man, Reliance Chairman Mukesh Ambani, who declared
          recently that Indian data should be owned exclusively by Indian
          citizens. His remarks have further fueled the debate raging over data
          localization in the world’s fastest growing internet market.
        </p>
      </Fade>
    </Col>
    <Col span={6}>
      <Fade bottom duration={700} distance="100px" delay={100} ssrReveal={true}>
        <a className={style.featuredpage}>
          <Avatar src="https://i.imgur.com/HDvi1oj.png" size={98} />

          <h6> Abdulla Bin Ahmed Al Ghurair </h6>
          <span className={style.featuredpage__span}>
            Lists <Icon component={GoTo} />
          </span>
        </a>
      </Fade>
    </Col>
  </Row>
);

export const RelatedArticles = ({ blogs, isEnglish, t }) => {
  return (
    <div className={style.related}>
      <h5>{t("relatedArticles")}</h5>
      <Row gutter={25} type="flex">
        {isMobileOnly && (
          <Col xs={24} md={12} lg={12} key={"ad"} style={{ marginBottom: 27 }}>
            <AdWrapper textAlign="center">
              <AdSlot
                dfpNetworkId="21752631353"
                sizes={[[300, 250]]}
                adUnit={isEnglish ? "forbes-ws-007" : "forbes-arabic-ws-002"}
              />
            </AdWrapper>
          </Col>
        )}
        {_.map(blogs, (item, index) => {
          return (
            <Col
              sm={24}
              md={12}
              lg={6}
              key={index}
              style={{ marginBottom: 45 }}
            >
              <ArticleItem data={item} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
