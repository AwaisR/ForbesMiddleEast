import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { withRouter } from "react-router-dom";
import _ from "lodash";

import { useTranslation } from "react-i18next";
import BottomScrollListener from "react-bottom-scroll-listener";
import { NetworkError, NoDataFoundError } from "@components/Errors";
import { LoadingMore } from "@components/Loader";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import { CompanyItemBrandvoice } from "@components/NonArticleBlocks";
import { Query } from "react-apollo";
import style from "./styles.scss";
// gql
import client from "@apolloClient";
import { allCompaniesQuery } from "@queries";
import { extractLanguage } from "@utils";

const defaultLang = "en";

const BrandvoicePage = ({ history, ...props }) => {
  const [isLoading, setLoading] = useState(false);
  const [toLoadMore, setToLoadMore] = useState(true);

  const { t } = useTranslation();
  const language = extractLanguage(props.location.pathname);
  const isEnglish = language !== "ar";
  const allCompaniesQueryVars = {
    where: {
      language: defaultLang,
      status: "Published",
      language: isEnglish ? "en" : "ar"
    }
  };

  useEffect(() => {
    if (defaultLang === "ar") {
      history.push("/404");
    }
  }, []);

  return (
    // <Layout header={false}>
    <Container className={style.container}>
      <Breadcrumbs
        trail={[
          {
            // title: t("forbes"),
            title: "Forbes",
            slug: isEnglish ? "/" : "/ar"
          },
          {
            title: t("brandvoice"),
            slug: isEnglish ? "/brandvoice" : "/ar/brandvoice"
          }
        ]}
      />
      <Query
        client={client}
        query={allCompaniesQuery}
        variables={allCompaniesQueryVars}
        onCompleted={data => {
          setLoading(false);
        }}
      >
        {({ loading, error, data: { companies }, fetchMore }) => {
          if (error) return <NetworkError />;
          if (loading) return <LoadingMore loading={true} />;

          const posts = companies || [];
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
                    { ...allCompaniesQueryVars, ...{ skip: posts.length } },
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
                    md={index === 0 ? 24 : 12}
                    lg={index === 0 ? 24 : 8}
                    style={{ marginBottom: 25 }}
                  >
                    <CompanyItemBrandvoice
                      featured={index === 0}
                      brandvoice
                      item={item}
                    />
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <NoDataFoundError />
          );
        }}
      </Query>
      {toLoadMore ? <LoadingMore loading={isLoading} /> : null}
    </Container>
    // </Layout>
  );
};

function loadMorePosts(variables, fetchMore, setStopLoading) {
  fetchMore({
    variables,
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult.companies.length) {
        setStopLoading();
        return previousResult;
      }
      return {
        previousResult,
        ...{
          companies: [...previousResult.companies, ...fetchMoreResult.companies]
        }
      };
    }
  });
}

export default withRouter(BrandvoicePage);
