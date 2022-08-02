import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import BottomScrollListener from "react-bottom-scroll-listener";
import { useTranslation } from "react-i18next";
// import CryptoJS from 'crypto-js';
import { isMobileOnly } from "react-device-detect";
import { LoadingMore } from "@components/Loader";
import Layout from "@components/Layout";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";

import ArticleTemplateNormal from "@templates/article-template-normal";
import client from "@apolloClient";
import { getArticleDetails } from "@queries";
import { extractLanguage } from "@utils";

const NormalView = ({
  articleDetails,
  breadcrumbTrail,
  ignoreParentUrl,
  preview,
  queryParams,
  structuredData,
  ...props
}) => {
  const { t } = useTranslation();
  const language = extractLanguage(props.location.pathname);
  const defaultLang = language;
  const isEnglish = defaultLang !== "ar";
  const [articles, setArticles] = useState([articleDetails]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
  const [firstArticleLoaded, setFirstArticleLoaded] = useState(false);
  const [trail, setTrail] = useState([]);
  useEffect(() => {
    if (!ignoreParentUrl) {
      getFirstArticle();
    } else {
      // setArticles([props.articleDetails]);
      // setCurrentCategory("press-room");
      setFirstArticleLoaded(true);
      setTrail(breadcrumbTrail);
    }
  }, []);

  useEffect(() => {
    if (currentCategory) {
      const trail = breadcrumbTrail
        ? breadcrumbTrail
        : [
            {
              title: isEnglish
                ? currentCategory.parent.name
                : currentCategory.parent.nameAR
                ? currentCategory.parent.nameAR
                : currentCategory.parent.name,
              slug: `${language === "ar" ? "/ar" : ""}/${
                currentCategory.parent.slug
              }`,
            },
            {
              title: isEnglish
                ? currentCategory.name
                : currentCategory.nameAR
                ? currentCategory.nameAR
                : currentCategory.name,
              slug: `${language === "ar" ? "/ar" : ""}/${
                currentCategory.parent.slug
              }/${currentCategory.slug}`,
            },
          ];
      setTrail(trail);
    }
  }, [currentCategory]);

  const getFirstArticle = async () => {
    const response = await client.query({
      query: getArticleDetails,
      variables: {
        where: {
          language: isEnglish ? "en" : "ar",
          slug: decodeURIComponent(queryParams.slug),
          ...(!preview && { status: "Published" }),
        },
        whereRelated: {
          language: isEnglish ? "en" : "ar",
          status: "Published",
          category: {
            slug: queryParams.sub,
          },
          slug_ne: queryParams.slug,
        },
        whereBlogImages: {
          blog: {
            slug: decodeURIComponent(queryParams.slug),
          },
        },
      },
    });
    const { articleDetails, relatedArticles, blogImages } = response.data;
    if (articleDetails.length) {
      let details = articleDetails[0];
      details.relatedArticles = relatedArticles;
      details.blogImages = blogImages;
      setCurrentCategory(details.category);
      setArticles([details]);
      setCurrentIndex(0);
      setFirstArticleLoaded(true);
    }
  };

  const getNextArticle = async () => {
    setLoading(true);
    const currentArticle = articles[currentIndex];
    const { slug, publishedDate, category, id } = currentArticle;

    const response = await client.query({
      query: getArticleDetails,
      variables: {
        where: {
          // id_lt: id,
          language: defaultLang,
          slug_ne: slug,
          publishedDate_lt: publishedDate,
          category: {
            // name_contains: category ? category.name : "",
            parent: {
              name_contains: category
                ? category.parent
                  ? category.parent.name
                  : ""
                : "",
            },
          },
          status: "Published",
        },
        whereRelated: {
          category: {
            parent: {
              name: category
                ? category.parent
                  ? category.parent.name
                  : ""
                : "",
            },
          },
          slug_ne: slug,
          language: defaultLang,
          status: "Published",
        },
        whereBlogImages: {
          blog: {
            slug,
          },
        },
        sort: "publishedDate:desc",
      },
    });

    const {
      data: { articleDetails, relatedArticles },
    } = response;

    if (articleDetails.length) {
      articleDetails[0].relatedArticles = relatedArticles;
      setArticles([...articles, articleDetails[0]]);
      setCurrentIndex(currentIndex + 1);
    } else {
      setLoadMore(false);
    }

    setLoading(false);
  };

  return (
    <Layout header={!preview} footer={!loadMore}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      ></script>
      <Container className="sample">
        <Breadcrumbs
          style={{
            margin: "0 0 8px",
          }}
          trail={[
            {
              title: t("forbes"),
              slug: "/",
            },
            ...trail,
          ]}
        />
      </Container>
      <BottomScrollListener
        offset={isMobileOnly ? 1600 : 900}
        onBottom={() => {
          if (preview) {
            return;
          }
          if (loading && !loadMore && !firstArticleLoaded) {
            return;
          }
          getNextArticle();
        }}
      >
        {firstArticleLoaded &&
          _.map(articles, (details, index) => {
            return (
              <ArticleTemplateNormal
                articleDetails={details}
                ignoreParentUrl={ignoreParentUrl}
                hideHeader={index !== 0}
                watchSCroll={true}
                key={index}
              />
            );
          })}
        <Container>
          {!firstArticleLoaded ? <LoadingMore loading={loading} /> : null}
        </Container>
        <Container>
          {loadMore ? <LoadingMore loading={loading} /> : null}
        </Container>
      </BottomScrollListener>
    </Layout>
  );
};
export default withRouter(NormalView);
