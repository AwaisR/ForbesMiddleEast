import React from "react";
import { Row, Col } from "antd";
import { isMobileOnly } from "react-device-detect";
import ArticleItem from "@components/ArticleItem";
import Container from "@components/Container";
import style from "./styles.scss";

const FeaturedArticle = ({ items }) => {
  return (
    // <Container className={style.container} fluidMobile={true}>
    //   <ArticleItem tag='h3' data={items} featured={true} featuredHome={true} />
    // </Container>

    <Row type="flex" gutter={25}>
      <Col span={24}>
        <ArticleItem
          tag="h3"
          data={items}
          featured={true}
          featuredHome={true}
        />
      </Col>
    </Row>
  );
};

export default FeaturedArticle;
