// TODO: CLEAN UP RENDER
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Row, Col } from "antd";
import _ from "lodash";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

import { NetworkError, NoDataFoundError } from "@components/Errors";
import { LoadingMore } from "@components/Loader";
import Container from "@components/Container";
import { NominationItem } from "@components/NonArticleBlocks";
import Breadcrumbs from "@components/Breadcrumbs";
import { isLoggedIn } from "@utils";
import { Query } from "react-apollo";
import NoAccess from "@modules/NoAccess";
import style from "./styles.scss";
// gql
import client from "@apolloClient";
import { getNominations } from "@queries";
import { isMobileOnly } from "react-device-detect";

const SubCategoryPage = () => {
  const [isLoading, setLoading] = useState(false);
  const [isUserLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const defaultLang = language !== "ar" ? "en" : "ar";
  const nominationsQueryVars = {
    where: {
      language: defaultLang,
      status: true
    }
  };

  // if (!isLoggedIn()) {
  //   return <NoAccess redirectUrl="?redirect=/nominations" />;
  // }
  useEffect(() => {
    setIsLoggedIn(isLoggedIn());
    setIsLoadingPage(false);
  }, []);

  if (isLoadingPage) {
    return null;
  }
  return (
    <>
      <Container>
        <Breadcrumbs
          trail={[
            {
              title: t("forbes"),
              slug: "/"
            },
            {
              title: t("nomination"),
              slug: "/nominations"
            }
          ]}
        />
      </Container>
      <Container className={style.container}>
        <Query
          client={client}
          query={getNominations}
          variables={nominationsQueryVars}
          onCompleted={data => {
            setLoading(false);
          }}
        >
          {({ loading, error, data: { nominations }, fetchMore }) => {
            if (error) return <NetworkError />;
            if (loading) return <LoadingMore loading={true} />;

            const posts = nominations || [];
            return posts.length ? (
              <>
                <Row type="flex" gutter={25}>
                  <Col span={24}>
                    <Row type="flex" gutter={25}>
                      {_.map(posts, (item, index) => (
                        <Col xs={24} md={12} lg={8} key={item.id}>
                          <NominationItem item={item} />
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </>
            ) : (
              <NoDataFoundError />
            );
          }}
        </Query>
      </Container>
    </>
  );
};

function loadMorePosts(variables, fetchMore, setStopLoading) {
  fetchMore({
    variables,
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult.nominations.length) {
        setStopLoading();
        return previousResult;
      }
      return {
        previousResult,
        ...{
          nominations: [...previousResult.blogs, ...fetchMoreResult.blogs]
        }
      };
    }
  });
}

export default SubCategoryPage;
