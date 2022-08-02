import React, { useState, useEffect } from "react";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import Layout from "@components/Layout";
import _ from "lodash";
// import CompanyItem from '@components/NonArticleBlocks';
import { ListItem } from "@components/NonArticleBlocks";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import client from "@apolloClient";
import { getListCategories, getFeaturedList } from "@queries";
import { setListCategories } from "@redux/general-actions";
import { extractLanguage } from "@utils";

import ListTab from "./ListTab";

const { TabPane } = Tabs;

const ListPage = ({ listCategories, setListCategories, ...props }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(
    listCategories.length ? listCategories[0].slug : ""
  );

  const [featuredList, setFeaturedList] = useState([]);
  const language = extractLanguage(props.location.pathname);
  const defaultLang = language;
  const isEnglish = defaultLang !== "ar";

  useEffect(() => {
    getFeatured();
    if (!listCategories.length) {
      getCategories();
    }
  }, []);

  const getFeatured = async () => {
    const response = await client.query({
      query: getFeaturedList,
      variables: {
        where: {
          categories_null: false,
          slug_null: false,
          language: defaultLang,
          // featureOnPage: true,
          status: "Published",
        },
        limit: 1,
      },
    });
    const { lists } = response.data;
    setFeaturedList(lists);
  };
  const getCategories = async () => {
    const response = await client.query({
      query: getListCategories,
      variables: {
        where: {
          status: true,
          slug_null: false,
        },
      },
    });
    const {
      data: { listcategories },
    } = response;
    setListCategories(listcategories);
    setActiveTab(listcategories.length ? listcategories[0].slug : "");
  };

  return (
    // <Layout header={false}>
    <Container>
      <Breadcrumbs
        trail={[
          {
            title: t("forbes"),
            slug: "/",
          },
          {
            title: t("lists"),
            slug: "/list",
          },
        ]}
      />
      <Row gutter={25}>
        {_.map(featuredList, (item, index) => (
          <Col key={index} span={24} style={{ marginBottom: 25 }}>
            <ListItem item={item} featured />
          </Col>
        ))}
      </Row>

      <Tabs activeKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
        {_.map(listCategories, (tab, index) => {
          return (
            <TabPane tab={isEnglish ? tab.name : tab.nameAR} key={tab.slug}>
              {activeTab === tab.slug ? (
                <ListTab slug={tab.slug} language={language} />
              ) : null}
            </TabPane>
          );
        })}
      </Tabs>
    </Container>
    // </Layout>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { listCategories } = state.generalReducer;
  return {
    listCategories,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setListCategories }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListPage));
