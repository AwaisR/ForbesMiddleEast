import React, { useState } from "react";

import { Row, Col } from "antd";
import { withRouter } from "react-router-dom";
import { DFPSlotsProvider, AdSlot } from "react-dfp";
import { isMobileOnly } from "react-device-detect";
import _ from "lodash";
import BottomScrollListener from "react-bottom-scroll-listener";
import { useTranslation } from "react-i18next";

import {
  NetworkError,
  NoDataFoundError,
  EndOfPageMessage,
} from "@components/Errors";
import { LoadingMore } from "@components/Loader";
import Container from "@components/Container";
import ArticleItem from "@components/ArticleItem";
import Breadcrumbs from "@components/Breadcrumbs";
import ArticleTrending from "@components/ArticleTrending";
import Layout from "@components/Layout";
import { Query } from "react-apollo";
import style from "./styles.scss";
// gql
import client from "@apolloClient";
import { allPostsQuery } from "@queries";
import { extractLanguage } from "@utils";
import AdWrapper from "@ads";
import { categoryView as adsConfig } from "@adsConfig";

const SubCategoryPage = ({ loadedData: { data }, ...props }) => {
  const language = extractLanguage(props.location.pathname);
  const isEnglish = language !== "ar";

  const [isLoading, setLoading] = useState(false);
  const [toLoadMore, setToLoadMore] = useState(true);
  const { parent, name, nameAR, slug } = data;
  const { t } = useTranslation();

  const allPostsQueryVars = {
    where: {
      language,
      author_null: false,
      category_null: false,
      status: "Published",
      category: {
        name: name,
        parent: {
          name: parent.name,
        },
      },
    },
  };

  const pageAdsForCurrentLanguage = !!adsConfig[parent.slug]
    ? isEnglish
      ? adsConfig[parent.slug]["en"]
      : adsConfig[parent.slug]["ar"]
    : null;

  return (
    <Layout footer={!toLoadMore}>
      <DFPSlotsProvider collapseEmptyDivs>
        <Container>
          <Breadcrumbs
            trail={[
              {
                title: t("forbes"),
                slug: "/",
              },
              {
                title: isEnglish
                  ? parent.name
                  : parent.nameAR
                  ? parent.nameAR
                  : parent.name,
                slug: `${language === "ar" ? "/ar" : ""}/${parent.slug}`,
              },

              {
                title: isEnglish ? name : nameAR ? nameAR : name,
                slug,
              },
            ]}
          />
        </Container>
        <Container className={style.container} fluidMobile={true}>
          <Query
            client={client}
            query={allPostsQuery}
            variables={allPostsQueryVars}
            onCompleted={(data) => {
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

              const recents = _.slice(posts, 0, 3) || [];
              const olds = _.slice(posts, 3) || [];
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
                  <Row type="flex" gutter={{ xs: 0, sm: 25 }}>
                    <Col
                      xs={{ span: 24, order: 2 }}
                      md={{ span: 24, order: 2 }}
                      lg={{ span: 16, order: 1 }}
                    >
                      <Row type="flex" gutter={{ xs: 0, sm: 25 }}>
                        {_.map(recents, (item, index) => (
                          <Col
                            xs={24}
                            md={index === 0 ? 24 : 12}
                            lg={index === 0 ? 24 : 12}
                            key={item.id}
                          >
                            <ArticleItem
                              tag={index === 0 ? "h1" : "h2"}
                              medium={index !== 0}
                              featured={index === 0}
                              className={style.article__item}
                              data={item}
                              category={name}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Col>
                    <Col
                      xs={{ span: 24, order: 1 }}
                      md={{ span: 24, order: 1 }}
                      lg={{ span: 8, order: 2 }}
                    >
                      <ArticleTrending
                        title={
                          isEnglish
                            ? parent.name
                            : parent.nameAR
                            ? parent.nameAR
                            : parent.name
                        }
                        categoryQuery={{
                          category: {
                            status: true,
                            parent: {
                              slug: parent.slug,
                            },
                          },
                        }}
                      />

                      {isMobileOnly && (
                        <AdWrapper margin="15px 22px 35px">
                          <AdSlot
                            dfpNetworkId="21752631353"
                            sizes={[[300, 250]]}
                            adUnit={
                              isEnglish
                                ? adsConfig.common.mobile.en.mpu.adUnit
                                : adsConfig.common.mobile.ar.mpu.adUnit
                            }
                          />
                        </AdWrapper>
                      )}
                      {pageAdsForCurrentLanguage && !isMobileOnly ? (
                        <>
                          <AdWrapper margin="15px 22px 35px" isCenter={false}>
                            <AdSlot
                              dfpNetworkId={
                                pageAdsForCurrentLanguage.halfPage.dfpNetworkId
                              }
                              sizes={pageAdsForCurrentLanguage.halfPage.sizes}
                              adUnit={pageAdsForCurrentLanguage.halfPage.adUnit}
                            />
                          </AdWrapper>
                          <AdWrapper margin="15px 22px 35px" isCenter={false}>
                            <AdSlot
                              dfpNetworkId={
                                pageAdsForCurrentLanguage["video"].dfpNetworkId
                              }
                              sizes={pageAdsForCurrentLanguage["video"].sizes}
                              adUnit={pageAdsForCurrentLanguage["video"].adUnit}
                            />
                          </AdWrapper>
                        </>
                      ) : null}
                    </Col>
                  </Row>
                  <Row type="flex" gutter={{ xs: 0, sm: 25 }}>
                    <Col span={24}>
                      <Row type="flex" gutter={{ xs: 0, sm: 25 }}>
                        {_.map(olds, (item, index) => (
                          <Col xs={24} md={12} lg={8} key={item.id}>
                            <ArticleItem
                              medium
                              className={style.article__item}
                              data={item}
                              category={name}
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
      </DFPSlotsProvider>
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
          blogs: [...previousResult.blogs, ...fetchMoreResult.blogs],
        },
      };
    },
  });
}

export default withRouter(SubCategoryPage);
