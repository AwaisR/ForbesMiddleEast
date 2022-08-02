import React from "react";
import { Row, Col } from "antd";
import _ from "lodash";
import ArticleItem from "@components/ArticleItem";
import style from "./styles.scss";
const FeaturedArticleMultiple = ({ items }) => {
  return (
    <Row
      type="flex"
      gutter={{
        xs: 0,
        sm: 25
      }}
    >
      {_.map(items, (item, index) => {
        return (
          <Col
            md={24}
            lg={12}
            key={index}
            className={style.col}
            style={{
              marginBottom: 27
            }}
          >
            <ArticleItem
              tag="h4"
              data={item}
              key={index}
              showImageOnMobile={false}
              detailsGrid={{
                lg: {
                  span: 15,
                  offset: 1
                },
                md: {
                  span: 15,
                  offset: 1
                },
                sm: {
                  span: 24
                }
              }}
              imageGrid={{
                lg: {
                  span: 8
                },
                md: {
                  span: 8
                },
                sm: {
                  span: 24
                }
              }}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default FeaturedArticleMultiple;
