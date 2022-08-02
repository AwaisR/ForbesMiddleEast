import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import _ from "lodash";
import client from "@apolloClient";
import { allPostsQuery } from "@queries";

import {
  FeaturedArticleSingle,
  FeaturedArticleMultiple
} from "@components/CategoryContentBlocks";
import ArticleItem from "@components/ArticleItem";

import Container from "@components/Container";
import style from "./styles.scss";

const ArticleFiller = ({
  relatedBlogs,
  featuredBlog,
  slug,
  language,
  sectionCount
}) => {
  const [featuredArticle, setFeaturedArticle] = useState(featuredBlog || {});
  const [relatedArticles, setRelatedArticles] = useState(relatedBlogs || []);
  const isEnglish = language !== "ar";
  let usedSlugs = [];
  let count = 0;
  useEffect(() => {
    if (_.isEmpty(featuredArticle)) {
      count += 1;
    } else {
      usedSlugs = [...usedSlugs, featuredArticle.slug];
    }
    if (!relatedArticles.length) {
      count += 7;
    } else {
      relatedArticles.map(article => {
        usedSlugs = [...usedSlugs, article.slug];
      });
      count += 7 - relatedArticles.length;
    }
    if (count !== 0) {
      requestArticles();
    }
  }, []);

  const requestArticles = async () => {
    const variables = {
      limit: count,
      where: {
        language,
        slug_nin: usedSlugs,
        category_null: false,
        status: "Published",
        category: {
          status: true,
          parent: {
            slug
          }
        }
      }
    };

    const response = await client.query({
      query: allPostsQuery,
      variables
    });
    const { blogs } = response.data;
    if (_.isEmpty(featuredArticle)) {
      setFeaturedArticle(blogs[0]);
    }
    // if (relatedArticles.length < 4) {
    setRelatedArticles([...relatedArticles, ...blogs.slice(1, 7)]);
    // }
  };

  const relatedSidebar = relatedArticles.length
    ? relatedArticles.slice(0, 2)
    : [];
  const relatedSmall = relatedArticles.length
    ? relatedArticles.slice(2, 6)
    : [];

  const directionRight = sectionCount % 2 === 0;

  return (
    <Container fluidMobile={true}>
      <div
        className={`${style.grid} ${directionRight ? style.grid__right : ""}`}
      >
        <div
          className={`${style.grid__large} ${
            directionRight ? style.grid__large__right : ""
          }`}
        >
          {!_.isEmpty(featuredArticle) ? (
            <ArticleItem
              tag="h3"
              data={featuredArticle}
              featured={true}
              featuredHome={true}
            />
          ) : null}
        </div>
        <div
          className={`${style.grid__sidebar} ${
            directionRight ? style.grid__sidebar__right : ""
          }`}
        >
          {relatedArticles && relatedArticles.length ? (
            <>
              {_.map(relatedSidebar, (item, index) => (
                <ArticleItem
                  tag="h4"
                  data={item}
                  key={index}
                  showImageOnMobile={false}
                />
              ))}
            </>
          ) : null}
        </div>
        <div
          className={`${style.grid__divider} ${
            directionRight ? style.grid__divider__right : ""
          }`}
        ></div>
        <div
          className={`${style.grid__small} ${
            directionRight ? style.grid__small__right : ""
          }`}
        >
          {relatedArticles && relatedArticles.length ? (
            <>
              {_.map(relatedSmall, (item, index) => (
                <ArticleItem
                  tag="h4"
                  data={item}
                  key={index}
                  showImageOnMobile={false}
                  hideAuthorImage={true}
                  hideShare={true}
                  imageClassName={style.grid__small__image}
                  detailsGrid={{
                    lg: {
                      span: 15,
                      offset: isEnglish ? 1 : 0,
                      pull: isEnglish ? 0 : 1
                    },
                    md: {
                      span: 15,
                      offset: isEnglish ? 1 : 0,
                      pull: isEnglish ? 0 : 1
                    },
                    sm: {
                      span: 24
                    }
                  }}
                  imageGrid={{
                    lg: {
                      span: 8
                    },
                    md: {
                      span: 8
                    },
                    sm: {
                      span: 24
                    }
                  }}
                />
              ))}
            </>
          ) : null}
        </div>
      </div>
    </Container>
  );
};

export default ArticleFiller;
