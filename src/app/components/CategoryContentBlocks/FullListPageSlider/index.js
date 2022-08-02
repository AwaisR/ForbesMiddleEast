import React from "react";
import { Carousel } from "antd";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import Container from "@components/Container";
import ArrowLeft from "@images/slider-arrow-left.svg";
import ArrowRight from "@images/slider-arrow-right.svg";
import { ListItem } from "@components/NonArticleBlocks";
import config from "@config";
import ImageZoom from "@components/ImageZoom";
import { getImageUrl } from "@utils";

import style from "./styles.scss";

const FullListPageSlider = ({ items }) => {
  const {
    i18n: { language },
  } = useTranslation();
  const isEnglish = language !== "ar";
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    adaptiveHeight: false,
    nextArrow: <img src={ArrowRight} className={style.arrow__next} />,
    prevArrow: <img src={ArrowLeft} className={style.arrow__prev} />,
    className: "slickasdasdas",
    spaceBetweenSlides: 25,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          adaptiveHeight: false,
          arrows: false,
          centerMode: true,
          centerPadding: "15px",
        },
      },
    ],
  };
  return (
    <Container>
      <div>
        <Carousel
          {...settings}
          className={`${style.carousel} slick-show-preview-mobile`}
        >
          {_.map(items, (item, index) => {
            return (
              <div key={index}>
                <Link
                  to={`${isEnglish ? "" : "/ar"}/list/${item.slug}`}
                  className={style.item}
                >
                  <ImageZoom
                    src={getImageUrl(
                      item.featuredImage
                        ? item.featuredImage
                        : item.featuredRecommendedList
                    )}
                    // src={`${config.s3bucketLink}${
                    //   item.featuredLatestList
                    //     ? item.featuredLatestList
                    //     : item.featuredImage
                    // }`}
                  />
                  <h3 className="h5">{item.name}</h3>
                </Link>
              </div>
            );
          })}
        </Carousel>
      </div>
    </Container>
  );
};

FullListPageSlider.propTypes = {
  items: PropTypes.array.isRequired,
};

export default FullListPageSlider;
