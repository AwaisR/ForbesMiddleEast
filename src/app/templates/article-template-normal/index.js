import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { Row, Col, Tag } from "antd";
// import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { Waypoint } from "react-waypoint";
import { isMobileOnly } from "react-device-detect";
import { DFPSlotsProvider, AdSlot } from "react-dfp";

import Quotation from "@components/Quotation";
import Container from "@components/Container";
import Carousel from "@components/CarouselLightbox";
import SocialShare from "@components/SocialShare";
import ArticleTrending from "@components/ArticleTrending";
import Author from "@components/Author";
import { LoadingMore } from "@components/Loader";
import { unescape, bookmarkItem, isItemBookmarked, getImageUrl } from "@utils";
import AdWrapper from "@ads";
import { categoryView as adsConfig } from "@adsConfig";
import client from "@apolloClient";

import { getBlogConfig } from "@queries";

import style from "./styles.scss";
import {
  TwitterWidget,
  // Author,
  ActionButtons,
  YouMayAlsoLike,
  FeaturedPage,
  AuthorFooter,
  RelatedArticles,
} from "./templates";

// const defaultLang = Cookies.get("language") || "en";
// const isEnglish = defaultLang !== "ar";

const ArticleView = ({
  hideHeader = false,
  watchSCroll,
  articleDetails: {
    id,
    title,
    author,
    publishedDate,
    content,
    featuredImage,
    category,
    relatedArticles,
    slug,
    video,
    youMayAlsoLike,
    quote,
    blogImages,
    imageCredit,
    language,
    blogtags,
    blogconfig,
    metaTitle,
  },
  preview,
  ignoreParentUrl,
}) => {
  const defaultLang = language || "en";
  const isEnglish = defaultLang !== "ar";
  const [articleContent, setArticleContent] = useState("");
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [blogConfig, setBlogConfig] = useState([]);
  const { t } = useTranslation();
  let categoryName = (category && category.slug) || "";
  const categoryParent = category
    ? category.parent
      ? category.parent.slug
      : null
    : null;
  const cLink = ignoreParentUrl
    ? `${!isEnglish ? "/ar" : ""}/${categoryParent}`
    : `${!isEnglish ? "/ar" : ""}/${categoryParent}/${categoryName}`;
  const [isBookmarked, setIsBookmarked] = useState(
    isItemBookmarked(`${cLink}/${encodeURIComponent(slug)}`)
  );

  useEffect(() => {
    setArticleContent(content);
    getRelatedBlogs();
  }, []);

  const getRelatedBlogs = async () => {
    const data = await client.query({
      query: getBlogConfig,
      variables: {
        where: {
          blogID: id,
        },
      },
    });
    setBlogConfig(
      data.data.blogconfigs.length ? data.data.blogconfigs[0].blogs : []
    );
    setLoadingConfig(false);
  };

  const handleBookMark = (obj) => {
    // console.log('bookmark', obj);
    bookmarkItem(obj, (bool) => {
      setIsBookmarked(bool);
    });
  };

  let paragraphs = content.length ? content.split("<br>") : [];
  paragraphs = _.filter(paragraphs, (item, index) => {
    return !/^\s*$/.test(item);
  });
  paragraphs = _.map(paragraphs, (item) => {
    return item.replace("/<[^>]*>/g", "");
  });
  const image = getImageUrl(featuredImage);

  let voiceString = content.replace(/<[^>]*>/g, "");
  voiceString = unescape(voiceString);

  const bookmarkObject = {
    type: "article",
    link: `${cLink}/${encodeURIComponent(slug)}`,
    title: title,
  };

  const pageAdsForCurrentLanguage = !!adsConfig[categoryParent]
    ? isEnglish
      ? adsConfig[categoryParent]["en"]
      : adsConfig[categoryParent]["ar"]
    : null;

  // console.log(relatedArticles, blogConfig);

  return (
    <DFPSlotsProvider collapseEmptyDivs dfpNetworkId="21752631353">
      <Waypoint
        bottomOffset="-200px"
        // debug={true}

        onEnter={({ event, ...props }) => {
          if (document) {
            document.title = metaTitle ? metaTitle : title;
          }
          if (preview) {
            return;
          }
          if (window) {
            window.history.pushState(
              {},
              title,
              `${cLink}/${encodeURIComponent(slug)}`
            );
            if (window.ga) {
              window.ga("create", "UA-23877493-1", "auto");
              window.ga("send", "pageview", {
                title,
                location: window.location.href,
                page: `${cLink}/${encodeURIComponent(slug)}`,
              });
            }
          }
        }}
      >
        <div>
          <Container className={`${style.container} article-detail-container`}>
            {/* <Ads adslot="/21752631353/forbes-ws-005" width={728} height={90} /> */}
            <AdWrapper>
              {isMobileOnly ? (
                <AdSlot
                  dfpNetworkId="21752631353"
                  sizes={[[320, 50]]}
                  adUnit={
                    isEnglish
                      ? "forbes-mobileresponsive-ws-101"
                      : "forbes-arabic-mobileresponsive-ws-102"
                  }
                />
              ) : (
                <AdSlot
                  dfpNetworkId="21752631353"
                  sizes={[[728, 90]]}
                  adUnit={isEnglish ? "forbes-ws-005" : "forbes-arabic-ws-001"}
                />
              )}
            </AdWrapper>
            <div itemScope itemType="http://schema.org/Article">
              <Row gutter={25} type="flex">
                <Col xs={24} sm={24} md={24} lg={16}>
                  <Row type="flex">
                    <Col md={24} lg={isEnglish ? 21 : 24}>
                      <div className={style.article__title}>
                        <p itemProp="articleSection">
                          {category
                            ? isEnglish
                              ? category.name
                              : category.nameAR
                              ? category.nameAR
                              : category.name
                            : ""}
                        </p>
                        <h1 itemProp="name" className="h2">
                          {title}
                        </h1>
                      </div>
                    </Col>
                  </Row>
                  {author && (
                    <Author
                      author={author}
                      date={publishedDate}
                      showTime={true}
                    />
                  )}
                  <SocialShare
                    link={`${cLink}/${encodeURIComponent(slug)}`}
                    className={
                      isEnglish
                        ? style.article__share
                        : style.article__share__ar
                    }
                  />
                  <ActionButtons
                    paragraphs={voiceString}
                    handleBookMark={() => handleBookMark(bookmarkObject)}
                    isBookmarked={isBookmarked}
                    t={t}
                  />
                  {isMobileOnly && (
                    <AdWrapper margin="15px 22px 35px">
                      <AdSlot
                        dfpNetworkId="21752631353"
                        sizes={[[300, 250]]}
                        adUnit={
                          isEnglish
                            ? adsConfig.common.mobile.en.mpu.adUnit
                            : adsConfig.common.mobile.ar.mpu.adUnit
                        }
                      />
                    </AdWrapper>
                  )}
                  {/* video && video.videoID */}
                  {video && video.videoID ? (
                    {
                      Youtube: (
                        <iframe
                          className={style.videoframe}
                          // width="100%"
                          // height="315"
                          src={`https://www.youtube.com/embed/${video.videoID}`}
                          frameborder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowfullscreen
                          // style={{ margin: "0 0 25px" }}
                        ></iframe>
                      ),
                      Vimeo: (
                        <iframe
                          className={style.videoframe}
                          src={`https://player.vimeo.com/video/${video.videoID}`}
                          // width="100%"
                          // height="315"
                          frameborder="0"
                          allow="autoplay; fullscreen"
                          allowfullscreen
                          // style={{ margin: "0 0 25px" }}
                        ></iframe>
                      ),
                    }[video.type]
                  ) : (
                    <div
                      className={`article-detail-content ${style.article__banner__container}`}
                    >
                      <img
                        src={image}
                        className={style.article__banner}
                        alt={title}
                        itemProp="image"
                      />
                      {imageCredit ? <span>{imageCredit}</span> : null}
                    </div>
                  )}

                  {youMayAlsoLike && (
                    <YouMayAlsoLike
                      isEnglish={isEnglish}
                      items={youMayAlsoLike.relatedBlogs}
                    />
                  )}
                  <div
                    className={`${style.article__content} ${
                      !isEnglish && style.article__content__ar
                    } article-detail-content`}
                    itemProp="articleBody"
                    dangerouslySetInnerHTML={{ __html: articleContent }}
                  />

                  {blogImages && blogImages.length ? (
                    <Carousel items={blogImages} />
                  ) : null}
                  {!_.isEmpty(quote) && quote.qText && (
                    <Quotation quote={quote} />
                  )}
                  <div className={style.tags}>
                    {_.map(blogtags, (tag) => {
                      return (
                        <Tag
                          style={{
                            borderRadius: 5,
                            marginTop: 5,
                            marginBottom: 5,
                          }}
                          key={tag.name}
                          color="#000"
                          // color={`#${Math.floor(
                          //   Math.random() * 16777215
                          // ).toString(16)}`}
                        >
                          <Link
                            to={`${isEnglish ? "" : "/ar"}/tags?name=${
                              tag.name
                            }`}
                          >
                            {tag.name}
                          </Link>
                        </Tag>
                      );
                    })}
                  </div>
                  <div>
                    <AuthorFooter author={author} isEnglish={isEnglish} />
                  </div>
                </Col>

                <Col xs={0} sm={0} md={0} lg={8}>
                  {hideHeader ? null : (
                    <ArticleTrending
                      ignoreParentUrl={ignoreParentUrl}
                      title={
                        ignoreParentUrl
                          ? isEnglish
                            ? category.name
                            : category.nameAR
                            ? category.nameAR
                            : category.name
                          : isEnglish
                          ? category.parent.name
                          : category.parent.nameAR
                          ? category.parent.nameAR
                          : category.parent.name
                      }
                      categoryQuery={
                        ignoreParentUrl
                          ? {
                              category: {
                                parent: {
                                  slug: categoryParent,
                                },
                              },
                            }
                          : {
                              category: {
                                status: true,
                                parent: {
                                  slug: category.parent.slug,
                                },
                              },
                            }
                      }
                    />
                  )}
                  {pageAdsForCurrentLanguage && !isMobileOnly ? (
                    <>
                      <AdWrapper margin="15px 22px 35px" isCenter={false}>
                        <AdSlot
                          dfpNetworkId={
                            pageAdsForCurrentLanguage.halfPage.dfpNetworkId
                          }
                          sizes={pageAdsForCurrentLanguage.halfPage.sizes}
                          adUnit={pageAdsForCurrentLanguage.halfPage.adUnit}
                        />
                      </AdWrapper>
                      <AdWrapper margin="15px 22px 35px" isCenter={false}>
                        <AdSlot
                          dfpNetworkId={
                            pageAdsForCurrentLanguage["video"].dfpNetworkId
                          }
                          sizes={pageAdsForCurrentLanguage["video"].sizes}
                          adUnit={pageAdsForCurrentLanguage["video"].adUnit}
                        />
                      </AdWrapper>
                    </>
                  ) : null}
                  {/* <AdWrapper margin="15px 22px 35px">
                    <AdSlot
                      dfpNetworkId="21752631353"
                      sizes={[
                        [300, 250],
                        [300, 600]
                      ]}
                      adUnit={
                        isEnglish ? "forbes-ws-007" : "forbes-arabic-ws-007"
                      }
                    />
                  </AdWrapper> */}
                </Col>
              </Row>
            </div>
          </Container>
          <Container fluidMobile={true}>
            <Row
              gutter={{
                xs: 0,
                sm: 25,
              }}
              type="flex"
            >
              <Col md={24} lg={16}>
                {loadingConfig ? (
                  <LoadingMore loading={true} />
                ) : (
                  <RelatedArticles
                    relatedArticles={
                      blogConfig.length
                        ? [
                            ...blogConfig,
                            ...(relatedArticles ? relatedArticles : []),
                          ]
                        : relatedArticles
                    }
                    t={t}
                    isEnglish={isEnglish}
                    ignoreParentUrl={ignoreParentUrl}
                  />
                )}
              </Col>
            </Row>
          </Container>
        </div>
      </Waypoint>
    </DFPSlotsProvider>
  );
};
export default ArticleView;
