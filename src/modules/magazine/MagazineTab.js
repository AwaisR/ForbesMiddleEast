import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {Row, Col, Form} from "antd";
import _ from "lodash";
// import Cookies from 'js-cookie';
import { Query } from "react-apollo";
import BottomScrollListener from "react-bottom-scroll-listener";

import { LoadingMore } from "@components/Loader";
import MagazineCard from "@components/MagazineCard";
import client from "@apolloClient";
import { getMagazineItemsPerCategory } from "@queries";
import { EndOfPageMessage } from "@components/Errors";
import { extractLanguage } from "@utils";

// const defaultLang = Cookies.get('language') || 'en';

const MagazineTab = ({ slug, ...props }) => {
  const defaultLang = extractLanguage(props.location.pathname);

  const [loading, setLoading] = useState(false);
  const [toLoadMore, setToLoadMore] = useState(true);

  const tabItemsQueryVars = {
    where: {
      language: defaultLang,
      // subscription: false,
      status: "Published",
      magazinecategories: {
        slug,
      },
    },
  };

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <>
      <Query
        client={client}
        query={getMagazineItemsPerCategory}
        variables={tabItemsQueryVars}
        onCompleted={() => setLoading(false)}
      >
        {({ loading, error, data: { magazines }, fetchMore }) => {
          if (error) return <div>Error loading posts</div>;

          const posts = magazines || [];
          return posts.length ? (
            <Row gutter={25} type="flex">
              <BottomScrollListener
                offset={200}
                onBottom={() => {
                  if (loading && !toLoadMore) {
                    return;
                  }
                  setLoading(true);
                  loadMorePosts(
                    { ...tabItemsQueryVars, ...{ skip: posts.length } },
                    fetchMore,
                    () => {
                      setToLoadMore(false);
                    }
                  );
                }}
              />
              {_.map(posts, (item, index) => (
                <Col
                  key={index}
                  xs={24}
                  sm={12}
                  md={6}
                  lg={4}
                  style={{ marginBottom: 28 }}
                >
                  <MagazineCard item={item} />
                </Col>
              ))}
            </Row>
          ) : (
            <>{!loading && <div>No data found</div>}</>
          );
        }}
      </Query>
      {toLoadMore ? <LoadingMore loading={loading} /> : <EndOfPageMessage />}
    </>
  );
};

function loadMorePosts(variables, fetchMore, setStopLoading) {
  fetchMore({
    variables,
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult.magazines.length) {
        setStopLoading();
        return previousResult;
      }
      return {
        previousResult,
        ...{
          magazines: [
            ...previousResult.magazines,
            ...fetchMoreResult.magazines,
          ],
        },
      };
    },
  });
}

export default withRouter(MagazineTab);
