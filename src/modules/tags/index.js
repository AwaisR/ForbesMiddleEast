import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import BottomScrollListener from "react-bottom-scroll-listener";
import { useTranslation } from "react-i18next";
import qs from "querystring";

import {
  NetworkError,
  NoDataFoundError,
  EndOfPageMessage
} from "@components/Errors";
import { LoadingMore } from "@components/Loader";
import Container from "@components/Container";
import ArticleItem from "@components/ArticleItem";
import Breadcrumbs from "@components/Breadcrumbs";
import Layout from "@components/Layout";
import { Query } from "react-apollo";
import style from "./styles.scss";
// gql
import client from "@apolloClient";
import { allPostsQuery } from "@queries";
import { extractLanguage } from "@utils";

const CategoryPage = ({
  loadedData: { title, slug, categoryQuery, ignoreParentUrl, data },
  ...props
}) => {
  const language = extractLanguage(props.location.pathname);
  const isEnglish = language !== "ar";
  const [isLoading, setLoading] = useState(false);
  const [toLoadMore, setToLoadMore] = useState(true);
  const { t } = useTranslation();
  const query = qs.parse(props.history.location.search.substr(1));

  const allPostsQueryVars = {
    where: {
      language,
      category_null: false,
      status: "Published",
      blogtags: {
        name_in: [query.name]
      }
    }
  };

  return (
    <Layout footer={!toLoadMore}>
      <Container>
        <Breadcrumbs
          trail={[
            {
              title: t("forbes"),
              slug: "/"
            },
            {
              title: t("tags")
            }
          ]}
        />
      </Container>
      <Container className={style.container} fluidMobile={true}>
        <Query
          client={client}
          query={allPostsQuery}
          variables={allPostsQueryVars}
          onCompleted={data => {
            if (data.blogs.length < 9) {
              setToLoadMore(false);
            }
            setLoading(false);
          }}
        >
          {({ loading, error, data: { blogs }, fetchMore }) => {
            if (error) return <NetworkError />;
            if (loading) return <LoadingMore loading={true} />;

            const posts = blogs || [];

            return posts.length ? (
              <>
                <BottomScrollListener
                  offset={200}
                  onBottom={() => {
                    if (isLoading && !toLoadMore) {
                      return;
                    }
                    setLoading(true);
                    loadMorePosts(
                      { ...allPostsQueryVars, ...{ skip: posts.length } },
                      fetchMore,
                      () => {
                        setToLoadMore(false);
                      }
                    );
                  }}
                />
                <Row
                  type="flex"
                  gutter={{
                    xs: 0,
                    sm: 25
                  }}
                >
                  <Col span={24}>
                    <Row
                      type="flex"
                      gutter={{
                        xs: 0,
                        sm: 25
                      }}
                    >
                      {_.map(posts, (item, index) => (
                        <Col xs={24} md={12} lg={8} key={item.id}>
                          <ArticleItem
                            medium
                            className={style.article__item}
                            data={item}
                            category={title}
                            ignoreParentUrl={ignoreParentUrl}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
                {toLoadMore ? <LoadingMore loading={true} /> : null}
              </>
            ) : (
              <NoDataFoundError />
            );
          }}
        </Query>
      </Container>
    </Layout>
  );
};

function loadMorePosts(variables, fetchMore, setStopLoading) {
  fetchMore({
    variables,
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult.blogs.length) {
        setStopLoading();
        return previousResult;
      }
      return {
        previousResult,
        ...{
          blogs: [...previousResult.blogs, ...fetchMoreResult.blogs]
        }
      };
    }
  });
}

export default withRouter(CategoryPage);
