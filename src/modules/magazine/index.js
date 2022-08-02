import React, { useEffect, useState } from "react";
import { Row, Col, Tabs } from "antd";
import { withRouter } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import Layout from "@components/Layout";
import Button from "@components/Button";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import MagazineCard from "@components/MagazineCard";
import client from "@apolloClient";
import { extractLanguage, isLoggedIn } from "@utils";
import { getMagazineCategories, getSubscriptionMagazine, getLatestCategories } from "@queries";
import MagazineTab from "./MagazineTab";

import style from "./styles.scss";

const { TabPane } = Tabs;

const MagazinePage = (props) => {
  const defaultLang = extractLanguage(props.location.pathname);

  const isEnglish = defaultLang !== "ar";

  const [activeTab, setActiveTab] = useState("");
  const [magazineCategories, setMagazineCategories] = useState([]);
  const [latestMagazines, setLatestMagazines] = useState([]);
  const [subscribeMagazine, setSubscribeMagazine] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    if (!isLoggedIn()) {
      props.history.push(
        '/login?redirect=/magazines'
      );
    }
    getCategories();
    getLatest();
    getYrSubcribedMagaznine();
  }, []);

  const getLatest = async () => {
    const response = await client.query({
      query: getLatestCategories,
      variables: {
        where: {
          status: "Published",
          language: defaultLang,
        },
      },
    });
    const {
      data: { magazines },
    } = response;
    console.log(magazines);
    setLatestMagazines(magazines);
  };

  const getYrSubcribedMagaznine = async () => {
    const response = await client.query({
      query: getSubscriptionMagazine,
      variables: {
        where: {
          subscription: true,
          status: "Published",
        },
      },
    });
    const {
      data: { magazines },
    } = response;
    console.log(magazines);

    setSubscribeMagazine(magazines[0]);
  };

  const getCategories = async () => {
    const response = await client.query({
      query: getMagazineCategories,
    });
    const {
      data: { magazinecategories },
    } = response;

    setMagazineCategories(magazinecategories);
    setActiveTab(magazinecategories[0].slug);
  };
  return (
    <Layout header={false}>
      <Container>
        <Breadcrumbs
          trail={[
            {
              title: t("forbes"),
              slug: defaultLang === "ar" ? "/ar" : "/",
            },
            {
              title: t("magazines"),
              slug: `${defaultLang === "ar" ? "/ar/magazines" : "/magazines"}`,
            },
          ]}
        />

        {subscribeMagazine ? (
          <Row gutter={25} type="flex" className={style.featured}>
            <Col lg={16}>
              <div
                className={`${style.featured__title} ${
                  !isEnglish && style.featured__title__ar
                }`}
              >
                <MagazineCard featured item={subscribeMagazine} />
                <div
                  className={`${style.featured__content} ${
                    !isEnglish && style.featured__content__ar
                  } `}
                >
                  <h1 className={`h3 ${style.h1__max_width}`}>{subscribeMagazine.name ? subscribeMagazine.name.split('|')[0] : ''}</h1>
                  <div>
                    <p>{subscribeMagazine.name ? subscribeMagazine.name.split('|')[1] : ''}</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={8}>
              <h3 className={style.h3}>{t("alsoRead")}</h3>
              <Row gutter={25}>
                {_.map(latestMagazines, (item, i) => {
                  if (i === 0) {
                    return;
                  }
                  return (
                    <Col key={i} xs={24} sm={12}>
                      <MagazineCard item={item} />
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>
        ) : null}

        <Tabs
          activeKey={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          className={style.tabs}
        >
          {_.map(magazineCategories, (tab, index) => {
            // const splitted = _.chunk(tab.items, 5);
            return (
              <TabPane
                tab={
                  defaultLang === "en"
                    ? tab.name
                    : tab.nameAR
                    ? tab.nameAR
                    : tab.name
                }
                key={tab.slug}
              >
                {activeTab === tab.slug ? (
                  <MagazineTab slug={tab.slug} />
                ) : null}
              </TabPane>
            );
          })}
        </Tabs>
      </Container>
    </Layout>
  );
};

export default withRouter(MagazinePage);
