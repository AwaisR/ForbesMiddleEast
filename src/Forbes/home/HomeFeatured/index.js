// Deployed
import React, { useEffect, useState } from "react";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import { isMobileOnly } from "react-device-detect";
import Cookies from "js-cookie";
import _ from "lodash";

import { DFPSlotsProvider, AdSlot } from "react-dfp";

import AdWrapper from "@ads";
import { homePage } from "@adsConfig";
import { CompanyItemBrandvoice, ListItem } from "@components/NonArticleBlocks";
import ArticleItem from "@components/ArticleItem";
import ArticlePopular from "@components/ArticlePopular";
import SocialLinks from "@components/SocialLinks";
import Tabs from "@components/Tabs";
import Container from "@components/Container";
import client from "@apolloClient";
import { getConfiguration, getMostRecentBlogs } from "@queries";
import { extractLanguage } from "@utils";
import {
  setHomeFeaturedItems,
  setHomeEditorsPick,
  setHomePopular
} from "@redux/general-actions";
import style from "./styles.scss";

const HomeFeatured = ({
  homeFeaturedItems,
  homeEditorsPick,
  homePopular,
  setHomeFeaturedItems,
  setHomeEditorsPick,
  setHomePopular,
  featuredItems,
  featured,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const language = extractLanguage(props.location.pathname);
  const isEnglish = language !== "ar";

  useEffect(() => {
    if (!homePopular.length) {
      getPopular();
    }
    if (!homeEditorsPick.length) {
      getEditorsPick();
    }
  }, []);

  const getEditorsPick = async () => {
    const response = await client.query({
      query: getConfiguration,
      variables: {
        where: { key: `editorsPickConfig${isEnglish ? "" : "AR"}` }
      }
    });
    const data = response.data.configurations[0];
    setHomeEditorsPick(data.value);
  };

  const getPopular = async () => {
    const response = await client.query({
      query: getMostRecentBlogs,
      variables: {
        where: {
          category_null: false,
          status: "Published",
          language: language,
          category: {
            slug_ne: "spotlight",
            parent: {
              slug_ne: "press-room"
            }
          }
        }
      }
    });
    const { blogs } = response.data;
    setHomePopular(blogs);
  };

  return (
    <DFPSlotsProvider collapseEmptyDivs>
      <Container className={style.content} fluidMobile={true}>
        <Row type="flex">
          <Col span={24}>
            <AdWrapper>
              {isMobileOnly ? (
                <AdSlot
                  dfpNetworkId="21752631353"
                  sizes={[[320, 50]]}
                  adUnit={
                    isEnglish
                      ? homePage.mobile.en.wideBanner.adUnit
                      : homePage.mobile.ar.wideBanner.adUnit
                  }
                />
              ) : (
                <AdSlot
                  dfpNetworkId="21752631353"
                  sizes={[[728, 90]]}
                  adUnit={
                    isEnglish
                      ? homePage.desktop.en.wideBanner.adUnit
                      : homePage.desktop.ar.wideBanner.adUnit
                  }
                />
              )}
            </AdWrapper>
            <h2 className={`h4 ${style.h2}`}>{t("forbesNow")}</h2>
          </Col>
        </Row>
        <Row
          type="flex"
          gutter={{
            xs: 0,
            sm: 25
          }}
        >
          <Col lg={16}>
            {!loading && !_.isEmpty(featuredItems) ? (
              <Row
                type="flex"
                gutter={{
                  xs: 0,
                  sm: 25
                }}
              >
                {featuredItems.featuredBlog ? (
                  <Col
                    md={24}
                    className={`${
                      isMobileOnly ? style.featured__mobile : ""
                    } ant-column-force`}
                  >
                    <ArticleItem
                      className={style.forbes__article}
                      data={featuredItems.featuredBlog}
                      tag={"h1"}
                      featured
                    />
                  </Col>
                ) : null}
                {isMobileOnly ? null : (
                  <>
                    {featuredItems.featuredBlog2 ? (
                      <Col xs={24} sm={24} md={12}>
                        <ArticleItem
                          className={`${style.forbes__article} ${style.forbes__article__extra} ant-column-force`}
                          data={featuredItems.featuredBlog2}
                          tag={"h2"}
                        />
                      </Col>
                    ) : null}
                    {featuredItems.featuredList ? (
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        className={`${style.forbes__article} ant-column-force`}
                      >
                        <ListItem
                          list
                          item={featuredItems.featuredList}
                          parent="home"
                        />
                      </Col>
                    ) : null}

                    {featuredItems.featuredBrandvoice ? (
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        className={`${style.forbes__article} ant-column-force`}
                      >
                        <CompanyItemBrandvoice
                          item={featuredItems.featuredBrandvoice}
                        />
                      </Col>
                    ) : null}
                  </>
                )}
              </Row>
            ) : null}
          </Col>

          <Col xs={24} sm={24} md={24} lg={8}>
            <Tabs className={style.tabs}>
              <div label={t("popular")}>
                <ArticlePopular list={homePopular} />
              </div>
              <div label={t("editorsPick")}>
                <ArticlePopular list={homeEditorsPick} />
              </div>
            </Tabs>

            <AdWrapper margin="15px 22px 35px">
              {isMobileOnly ? (
                <AdSlot
                  dfpNetworkId="21752631353"
                  sizes={[
                    [300, 250],
                    [300, 600]
                  ]}
                  adUnit={
                    isEnglish
                      ? homePage.mobile.en.mpu.adUnit
                      : homePage.mobile.ar.mpu.adUnit
                  }
                />
              ) : (
                <AdSlot
                  dfpNetworkId="21752631353"
                  sizes={[
                    [300, 250],
                    [300, 600]
                  ]}
                  adUnit={
                    isEnglish
                      ? homePage.desktop.en.mpu.adUnit
                      : homePage.desktop.ar.mpu.adUnit
                  }
                />
              )}
            </AdWrapper>
          </Col>
        </Row>
        <Row type="flex">
          <Col span={24} className={style.forbes__social}>
            <h6>{t("forbesSocialMedia")}</h6>
            <SocialLinks />
          </Col>
          {!loading && !_.isEmpty(featuredItems) && isMobileOnly ? (
            <>
              {featuredItems.featuredList ? (
                <Col xs={24} sm={24} md={12} className={style.forbes__article}>
                  <ListItem
                    list
                    item={featuredItems.featuredList}
                    parent="home"
                  />
                </Col>
              ) : null}
              {featuredItems.featuredBrandvoice ? (
                <Col xs={24} sm={24} md={12} className={style.forbes__article}>
                  <CompanyItemBrandvoice
                    item={featuredItems.featuredBrandvoice}
                  />
                </Col>
              ) : null}
            </>
          ) : null}
        </Row>
      </Container>
    </DFPSlotsProvider>
  );
};

const mapStateToProps = (state, ownProps) => {
  const {
    homeFeaturedItems,
    homeEditorsPick,
    homePopular
  } = state.generalReducer;
  return {
    homeFeaturedItems,
    homeEditorsPick,
    homePopular
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { setHomeFeaturedItems, setHomeEditorsPick, setHomePopular },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HomeFeatured));
