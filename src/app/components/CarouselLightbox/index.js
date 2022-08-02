import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Row, Col, Carousel } from "antd";
import Container from "@components/Container";
import ArrowLeft from "@images/slider-arrow-left.svg";
import ArrowRight from "@images/slider-arrow-right.svg";
import ArrowLongReadRight from "@images/longread-next.svg";
import ArrowLongReadLeft from "@images/longread-prev.svg";
import config from "@config";
import style from "./style.scss";
import { ReactBnbGallery } from "react-bnb-gallery";

// const items = [
//   {
//     image: 'https://i.imgur.com/gBFEoyU.jpg',
//     title:
//       'Aerodynamic Drone High Contrast LED Material Break Part Line Rendering Seamless Transparent Transport White',
//   },
//   {
//     image: 'https://i.imgur.com/gBFEoyU.jpg',
//     title: 'second',
//   },
// ];

const CarouselLightbox = ({ className, longread, items }) => {
  const [bnbGalleryImages, setBnbGalleryImages] = useState([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    if (!items.length) {
      return;
    }
    const bnbimages = _.map(items, image => {
      return {
        photo: `${config.s3bucketLink}${image.image}`,
        caption: image.title,
        subcaption: image.description,
        thumbnail: `${config.s3bucketLink}${image.image}`
      };
    });

    setBnbGalleryImages(bnbimages);
  }, []);

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <img src={longread ? ArrowLongReadRight : ArrowRight} />,
    prevArrow: <img src={longread ? ArrowLongReadLeft : ArrowLeft} />
  };
  return (
    <>
      <div>
        <Carousel
          {...settings}
          className={`${style.carousel} ${
            longread ? style.carousel__longread : null
          } ${className}`}
        >
          {_.map(items, (item, index) => {
            const Paragraph = () => (
              <span className={style.carousel__paragraph}>{item.title}</span>
            );
            return (
              <div
                key={index}
                onClick={() => {
                  setActivePhotoIndex(index);
                  setGalleryOpen(true);
                }}
              >
                <div
                  className={`${style.carousel__image} ${
                    longread ? style.carousel__image__longread : null
                  }`}
                >
                  <img
                    src={`${config.s3bucketLink}${item.image}`}
                    alt={item.title}
                  />
                </div>
                {longread ? (
                  <Container>
                    <Row>
                      <Col span={16} offset={4}>
                        <Paragraph />
                      </Col>
                    </Row>
                  </Container>
                ) : (
                  <Paragraph />
                )}
              </div>
            );
          })}
        </Carousel>
      </div>
      <div>
        <ReactBnbGallery
          activePhotoIndex={activePhotoIndex}
          show={galleryOpen}
          photos={bnbGalleryImages}
          onClose={() => setGalleryOpen(false)}
          backgroundColor="rgba(0, 0, 0, 0.9)"
        />
      </div>
    </>
  );
};

export default CarouselLightbox;
