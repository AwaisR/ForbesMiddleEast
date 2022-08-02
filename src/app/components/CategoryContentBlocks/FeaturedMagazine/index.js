import React from "react";
import { Row, Col } from "antd";
import { Fade } from "react-reveal";
import _ from "lodash";
import Container from "@components/Container";
import Button from "@components/Button";
import ArticleItem from "@components/ArticleItem";
import MagazineCard from "@components/MagazineCard";
import Magazine from "@images/m2.jpg";
import style from "./styles.scss";

const FeaturedMagazine = ({ items }) => {
  return (
    <Container>
      <Row>
        {items.featuredMagazine ? (
          <Col xs={24} sm={12} md={6} className={style.magazine}>
            <div>
              <MagazineCard item={items.featuredMagazine} featured={true} />
              {/* <img src={Magazine} /> */}
              <h3 className="h2">{items.featuredMagazine.name}</h3>
              <p>{/* Language: English <br /> */}</p>
              {/* <Button type="primary">Subscribe</Button> */}
              {/* <Button>Get Your Issue Now</Button> */}
            </div>
          </Col>
        ) : null}
        <Col
          md={{
            span: 16,
            offset: 2
          }}
          sm={12}
          xs={0}
        >
          <Row
            type="flex"
            gutter={{
              xs: 0,
              sm: 25
            }}
          >
            {_.map(items && items.relatedBlogs, (item, index) => {
              return (
                <Col key={index} lg={12} style={{ marginBottom: 30 }}>
                  <ArticleItem tag="h4" medium={true} data={item} />
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default FeaturedMagazine;
