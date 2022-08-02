import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { Row, Col } from "antd";
import _ from "lodash";
import BottomScrollListener from "react-bottom-scroll-listener";
import moment from "moment";

import { LoadingMore } from "@components/Loader";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import { EventItem } from "@components/NonArticleBlocks";
import Layout from "@components/Layout";
import { Query } from "react-apollo";
import NoAccess from "@modules/NoAccess";
import { isLoggedIn } from "@utils";
import style from "./styles.scss";
// gql
import client from "@apolloClient";
import { allEventsQuery } from "@queries";
const defaultLang = "en";

const EventsPage = ({ history, ...props }) => {
  const [isLoading, setLoading] = useState(false);
  const [toLoadMore, setToLoadMore] = useState(true);
  const [toLoadFeatured, setToLoadFeatured] = useState(true);
  const [featuredEvent, setFeaturedEvent] = useState([]);

  useEffect(() => {
    if (toLoadFeatured) {
      getFeaturedEvent();
    }
  }, []);

  const getFeaturedEvent = async () => {
    setLoading(true);
    const response = await client.query({
      query: allEventsQuery,
      variables: {
        where: {
          language: defaultLang,
          status: "Published",
          date_gt: moment().toISOString()
        },
        sort: "date:asc",
        limit: 1
      }
    });
    const { events } = response.data;
    setFeaturedEvent(events);
    setLoading(false);
    setToLoadFeatured(false);
  };

  const allEventsQueryVars = {
    where: {
      language: defaultLang,
      status: "Published",
      ...(featuredEvent.length ? { id_ne: featuredEvent[0].id } : {})
    },
    sort: "date:desc"
  };
  // if(!isLoggedIn()){
  //   return <NoAccess/>
  // }
  return (
    <Layout footer={!toLoadMore}>
      <Container className={style.container}>
        <Breadcrumbs
          trail={[
            {
              title: "Forbes",
              slug: "/"
            },
            {
              title: "Events",
              slug: "/events"
            }
          ]}
        />
        {featuredEvent.length ? (
          <Row type="flex" gutter={25}>
            <Col xs={24} style={{ marginBottom: 25 }}>
              <EventItem featured={true} item={featuredEvent[0]} />
            </Col>
          </Row>
        ) : null}
        {toLoadFeatured ? null : (
          <>
            <Query
              client={client}
              query={allEventsQuery}
              variables={allEventsQueryVars}
              onCompleted={() => {
                setLoading(false);
              }}
            >
              {({ loading, error, data: { events }, fetchMore }) => {
                if (error) return <div>Error loading posts</div>;
                if (loading) return <div>Loading</div>;

                const posts = events || [];
                // console.log(posts);
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
                          { ...allEventsQueryVars, ...{ skip: posts.length } },
                          fetchMore,
                          () => {
                            setToLoadMore(false);
                          }
                        );
                      }}
                    />
                    <Row type="flex" gutter={25}>
                      {_.map(posts, (item, index) => (
                        <Col
                          key={index}
                          md={12}
                          lg={8}
                          style={{ marginBottom: 25 }}
                        >
                          <EventItem item={item} />
                        </Col>
                      ))}
                    </Row>
                  </>
                ) : (
                  <div>No data found</div>
                );
              }}
            </Query>
            {toLoadMore ? <LoadingMore loading={isLoading} /> : null}
          </>
        )}
      </Container>
    </Layout>
  );
};

function loadMorePosts(variables, fetchMore, setStopLoading) {
  fetchMore({
    variables,
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult.events.length) {
        setStopLoading();
        return previousResult;
      }
      return {
        previousResult,
        ...{
          events: [...previousResult.events, ...fetchMoreResult.events]
        }
      };
    }
  });
}

export default withRouter(EventsPage);
