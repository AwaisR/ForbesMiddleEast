import React, { useState } from "react";
import { Row, Col } from "antd";
import _ from "lodash";
import BottomScrollListener from "react-bottom-scroll-listener";

import {
  NetworkError,
  NoDataFoundError,
  EndOfPageMessage,
} from "@components/Errors";
import { LoadingMore } from "@components/Loader";
import { ListItem } from "@components/NonArticleBlocks";
import { Query } from "react-apollo";
// gql
import client from "@apolloClient";
import { getListsPerCategory } from "@queries";

const ListTab = ({ slug, language }) => {
  const [isLoading, setLoading] = useState(false);
  const [toLoadMore, setToLoadMore] = useState(true);

  const tabItemsQueryVars = {
    where: {
      language,
      status: "Published",
      categories: {
        slug,
      },
    },
  };

  return (
    <>
      <Query
        client={client}
        query={getListsPerCategory}
        variables={tabItemsQueryVars}
        onCompleted={(data) => {
          if (data.lists.length < 6) {
            setToLoadMore(false);
          }
          setLoading(false);
        }}
      >
        {({ loading, error, data: { lists }, fetchMore }) => {
          if (error) return <NetworkError />;
          if (loading) return <LoadingMore loading={true} />;

          const posts = lists || [];
          return posts.length ? (
            <Row gutter={25} type="flex">
              <BottomScrollListener
                offset={200}
                onBottom={() => {
                  if (isLoading && !toLoadMore) {
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
                  md={12}
                  lg={8}
                  style={{ marginBottom: 25 }}
                >
                  <ListItem item={item} parent={slug} />
                </Col>
              ))}
            </Row>
          ) : (
            <NoDataFoundError />
          );
        }}
      </Query>
      {toLoadMore ? <LoadingMore loading={isLoading} /> : <EndOfPageMessage />}
    </>
  );
};

function loadMorePosts(variables, fetchMore, setStopLoading) {
  fetchMore({
    variables,
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult.lists.length || fetchMoreResult.lists.length < 6) {
        setStopLoading();
        return previousResult;
      }
      return {
        previousResult,
        ...{
          lists: [...previousResult.lists, ...fetchMoreResult.lists],
        },
      };
    },
  });
}

export default ListTab;
