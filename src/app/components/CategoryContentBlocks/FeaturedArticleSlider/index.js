import React from "react";
import { Carousel, Avatar } from "antd";
import PropTypes from "prop-types";
import _ from "lodash";
import { useTranslation } from "react-i18next";

import Container from "@components/Container";
import ArticleItem from "@components/ArticleItem";
import style from "./styles.scss";
import ArrowLeft from "@images/slider-arrow-left-light.svg";
import ArrowRight from "@images/slider-arrow-right-light.svg";

const FeaturedArticleSlider = ({ items }) => {
  const { t } = useTranslation();
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    // adaptiveHeight: true,
    nextArrow: <img src={ArrowRight} className={style.arrow__next} />,
    prevArrow: <img src={ArrowLeft} className={style.arrow__prev} />,
    responsive: [
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          adaptiveHeight: false,
          arrows: false,
          centerMode: true,
          centerPadding: "20px"
        }
      }
    ]
  };
  return (
    <Container fluid={true} className={style.container}>
      <div className={style.limit}>
        <h2>{t("featured")}</h2>
        <Carousel
          {...settings}
          className={`${style.carousel} slick-show-preview-mobile`}
        >
          {_.map(items, (item, index) => {
            return (
              <div key={index} className={style.content}>
                <ArticleItem
                  tag="h3"
                  data={item}
                  light={true}
                  featuredSlider={true}
                />
              </div>
            );
          })}
        </Carousel>
      </div>
    </Container>
  );
};

FeaturedArticleSlider.propTypes = {
  items: PropTypes.array.isRequired
};

FeaturedArticleSlider.defaultProps = {};

export default FeaturedArticleSlider;
