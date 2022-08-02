import React from "react";
import PropTypes from "prop-types";
import Container from "@components/Container";
import ImageZoom from "@components/ImageZoom";
import { ListItem } from "@components/NonArticleBlocks";

import config from "@config";
import style from "./styles.scss";

const FeaturedListPage = ({ item }) => {
  return (
    <Container className={style.content}>
      <ListItem item={item} featured tag="h3" />
    </Container>
  );
};

FeaturedListPage.propTypes = {
  item: PropTypes.object.isRequired,
  title: PropTypes.string
};

export default FeaturedListPage;
