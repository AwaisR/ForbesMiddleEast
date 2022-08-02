import React from "react";
import { Carousel } from "antd";
import PropTypes from "prop-types";
import _ from "lodash";
import Container from "@components/Container";
import { CompanyItemBrandvoice } from "@components/NonArticleBlocks";
import ArrowLeft from "@images/slider-arrow-left.svg";
import ArrowRight from "@images/slider-arrow-right.svg";
import style from "./styles.scss";
import { isMobileOnly } from "react-device-detect";

const PageListSlider = ({ items, carouselClass }) => {
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: <img src={ArrowRight} className={style.arrow__next} />,
    prevArrow: <img src={ArrowLeft} className={style.arrow__prev} />,
    responsive: [
      {
        breakpoint: 767
      }
    ]
  };
  return (
    <Container fluidMobile={true}>
      <Carousel
        {...settings}
        className={`${style.carousel} ${carouselClass} brandvoice-home-carousel`}
      >
        {_.map(items, (item, index) => (
          <div key={index}>
            <CompanyItemBrandvoice
              featured
              key={index}
              tag="h3"
              item={item}
              textWrapperStyle={style.itemBrandvoiceWrapper}
            />
          </div>
        ))}
      </Carousel>
    </Container>
  );
};

PageListSlider.propTypes = {
  items: PropTypes.array.isRequired,
  brandvoice: PropTypes.bool
};

PageListSlider.defaultProps = {
  brandvoice: false
};

export default PageListSlider;
