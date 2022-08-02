import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import BottomScrollListener from "react-bottom-scroll-listener";
import Cookies from "js-cookie";
import config from "@config";
import { LoadingMore } from "@components/Loader";
import Layout from "@components/Layout";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";

import ArticleTemplateLongRead from "@templates/article-template-longread";

import client from "@apolloClient";
import { getArticleDetails } from "@queries";

const defaultLang = Cookies.get("language") || "en";

const NormalView = ({ match: { params }, articleDetails }) => {
  const [articles, setArticles] = useState([articleDetails]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(true);

  const getNextArticle = async () => {
    setLoading(true);
    const currentArticle = articles[currentIndex];
    const { slug, publishedDate, category } = currentArticle;
    const response = await client.query({
      query: getArticleDetails,
      variables: {
        where: {
          language: defaultLang,
          slug_ne: slug,
          publishedDate_lt: publishedDate,
          category: {
            name_contains: category ? category.name : "",
            parent: {
              name_contains: category
                ? category.parent
                  ? category.parent.name
                  : ""
                : ""
            }
          }
        },
        whereRelated: {
          category: {
            name_contains: category ? category.name : ""
          },
          slug_ne: params.article,
          language: defaultLang
        },
        sort: "publishedDate:desc"
      }
    });

    const {
      data: { articleDetails, relatedArticles }
    } = response;

    if (articleDetails.length) {
      articleDetails[0].relatedArticles = relatedArticles;
      setArticles([...articles, articleDetails[0]]);
      setCurrentIndex(currentIndex + 1);

      const { category, slug, title } = articleDetails[0];
      const categoryName = (category && category.slug) || "";
      const categoryParent = category
        ? category.parent
          ? category.parent.slug
          : null
        : null;
      const cLink = `/${categoryParent}/${categoryName}/${slug}`;
      window.history.replaceState({}, "qs", cLink);
      if (document) {
        document.title = title;
      }
    } else {
      setLoadMore(false);
    }

    setLoading(false);
  };

  return (
    <Layout footer={false} lightHeader={true}>
      <BottomScrollListener
        offset={400}
        onBottom={() => {
          if (loading && !loadMore) {
            return;
          }
          getNextArticle();
        }}
      >
        {_.map(articles, (details, index) => {
          return (
            <ArticleTemplateLongRead
              articleDetails={details}
              hideHeader={index !== 0}
            />
          );
        })}
        <Container>
          {loadMore ? (
            <LoadingMore loading={loading} />
          ) : (
            <p>No more results can be loaded</p>
          )}
        </Container>
      </BottomScrollListener>
    </Layout>
  );
};
export default withRouter(NormalView);
