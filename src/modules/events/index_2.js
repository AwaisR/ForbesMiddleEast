import React, { Component } from "react";
import { Row, Col } from "antd";
import _ from "lodash";
import BottomScrollListener from "react-bottom-scroll-listener";
import moment from "moment";

import { LoadingMore } from "@components/Loader";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import { EventItem } from "@components/NonArticleBlocks";
import { Query } from "react-apollo";
import style from "./styles.scss";
// gql
import client from "@apolloClient";
import { allEventsQuery } from "@queries";
const defaultLang = "en";

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      toLoadMore: true,
      loadFeatured: true
    };
  }

  setLoading = bool => {
    this.setState({ loading: bool });
  };

  render() {
    const { toLoadMore, loadFeatured } = this.state;
    const featuredEventQueryVar = {
      where: {
        language: defaultLang,
        status: "Published",
        date_gt: moment().toISOString()
      },
      sort: "date:asc",
      limit: 1
    };
    const allEventsQueryVars = {
      where: {
        language: defaultLang,
        status: "Published"
      },
      sort: "date:desc"
    };
    return (
      // <Layout header={false}>
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
        <Query
          client={client}
          query={allEventsQuery}
          variables={loadFeatured ? featuredEventQueryVar : allEventsQueryVars}
          onCompleted={() => {
            this.setLoading(false);
            this.setState({ loadFeatured: false });
          }}
        >
          {({ loading, error, data: { events }, fetchMore }) => {
            if (error) return <div>Error loading posts</div>;
            if (loading) return <div>Loading</div>;

            const posts = events || [];
            return posts.length ? (
              <>
                <BottomScrollListener
                  offset={200}
                  onBottom={() => {
                    if (this.state.loading && !toLoadMore) {
                      return;
                    }
                    this.setLoading(true);
                    loadMorePosts(
                      { ...allEventsQueryVars, ...{ skip: posts.length } },
                      fetchMore,
                      () => {
                        this.setState({ toLoadMore: false });
                      }
                    );
                  }}
                />
                <Row type="flex" gutter={25}>
                  {_.map(posts, (item, index) => (
                    <Col
                      key={index}
                      md={index === 0 ? 24 : 12}
                      lg={index === 0 ? 24 : 8}
                      style={{ marginBottom: 25 }}
                    >
                      <EventItem featured={index === 0} item={item} />
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <div>No data found</div>
            );
          }}
        </Query>
        {toLoadMore ? <LoadingMore loading={this.state.loading} /> : null}
      </Container>
      // </Layout>
    );
  }
}

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

export default Events;
