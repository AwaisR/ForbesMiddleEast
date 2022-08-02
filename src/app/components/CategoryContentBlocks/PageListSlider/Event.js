import React from "react";
import { Carousel } from "antd";
import PropTypes from "prop-types";
import _ from "lodash";
import Container from "@components/Container";
import { EventItem } from "@components/NonArticleBlocks";
import ArrowLeft from "@images/slider-arrow-left.svg";
import ArrowRight from "@images/slider-arrow-right.svg";
import style from "./styles.scss";

const PageListSliderEvent = ({ items, carouselClass }) => {
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    nextArrow: <img src={ArrowRight} className={style.arrow__next} />,
    prevArrow: <img src={ArrowLeft} className={style.arrow__prev} />,
    responsive: [
      {
        breakpoint: 767
      }
    ]
  };
  return (
    <Container>
      <Carousel {...settings} className={`${style.carousel} ${carouselClass}`}>
        {_.map(items, (item, index) => (
          <div key={index}>
            <EventItem featured key={index} tag="h3" item={item} />
          </div>
        ))}
      </Carousel>
    </Container>
  );
};

PageListSliderEvent.propTypes = {
  items: PropTypes.array.isRequired,
  brandvoice: PropTypes.bool
};

PageListSliderEvent.defaultProps = {
  brandvoice: false
};

export default PageListSliderEvent;
