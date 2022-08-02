import React from "react";
import { Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { ArrowRight } from "@icons";
import Container from "@components/Container";
import style from "../styles.scss";
import { extractLanguage } from "@utils";

const SectionTitle = ({ title, slug, ...props }) => {
  const language = extractLanguage(props.location.pathname);
  const { t } = useTranslation();
  const sectionTitle = {
    list: t("lists"),
    magazines: t("magazines")
  }[slug.toLowerCase()];

  return (
    <Container fluidMobile={true}>
      <div
        className={`${style.title} ${language === "ar" ? style.title__ar : ""}`}
        data-category={slug.toLowerCase()}
      >
        <Link
          to={`${language === "ar" ? "/ar" : ""}/${
            slug.toLowerCase() === "list" ? "list" : slug.toLowerCase()
          }`}
        >
          <h2>{sectionTitle ? sectionTitle : title}</h2>
          <Icon component={ArrowRight} />
        </Link>
      </div>
    </Container>
  );
};

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired
};

export default withRouter(SectionTitle);
