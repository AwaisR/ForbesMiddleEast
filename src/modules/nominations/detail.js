import React from "react";

import { Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import JotformEmbed from "./jotform";
import style from "./styles.scss";

const NominationDetail = ({ loadedData: { data } }) => {
  // const { title } = data;
  const { t } = useTranslation();
  const { title, formLink, featuredImage, content } = data;
  const image = featuredImage
    ? `https://d1epq84pwgteub.cloudfront.net/${featuredImage}`
    : "https://i.imgur.com/gBFEoyU.jpg";
  return (
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
      <Row gutter={25} type="flex">
        <Col md={24} lg={20} className={style.detail}>
          <h1 className="h2">{title}</h1>
          <img src={image} alt={title} />
          <div
            className={style.article__content}
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {/* <JotformEmbed src={formLink} /> */}
        </Col>
      </Row>
    </Container>
  );
};

export default NominationDetail;
