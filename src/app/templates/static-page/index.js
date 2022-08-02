import React, { useEffect } from "react";
import { Row, Col } from "antd";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import style from "./styles.scss";

const StaticPage = ({ loadedData: { data, slug, redirect }, history }) => {
  const { title, description } = data;
  return (
    <Container className={style.container}>
      <Breadcrumbs
        trail={[
          {
            title: "Forbes",
            slug: "/"
          },
          {
            title
          }
        ]}
      />

      <h1 className={`${style.h1} h2`}>{title}</h1>

      <Row type="flex">
        <Col xs={24} sm={24} md={24} lg={18}>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(StaticPage);
