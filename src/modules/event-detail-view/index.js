import React, { useEffect, useState } from "react";
import moment from "moment";
import { Row, Col, Divider, Avatar } from "antd";
import Cookies from "js-cookie";
import _ from "lodash";
import Gallery from "react-photo-gallery";
import { ReactBnbGallery } from "react-bnb-gallery";
// import 'react-bnb-gallery/dist/style.css';

import { getImageUrl } from "@utils";
import config from "@config";
import Button from "@components/Button";
import Layout from "@components/Layout";
import Container from "@components/Container";

import NoAccess from "@modules/NoAccess";
import { isLoggedIn } from "@utils";

import MapContainer from "./Map";
import style from "./styles.scss";
// import "./justifiedgallery/jquery.justifiedGallery.min";

const isEnglish = true;

const EventDetailPage = ({ data }) => {
  const {
    name,
    subtitle,
    synopsis,
    featuredImage,
    date,
    location,
    agenda,
    locationCoordinates,
    speakers,
    attendLink,
    attendButtonText,
    attendButtonTextAR,
    sponsors,
    images,
    contact,
  } = data;
  const [bnbGalleryImages, setBnbGalleryImages] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isUserLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (window) {
        if (document.getElementById(window.location.hash.substr(1))) {
          document
            .getElementById(window.location.hash.substr(1))
            .scrollIntoView();
        }
      }
    }, 1000);
    if (data.images.length) {
      // $(".imageGrid").justifiedGallery({
      //   rowHeight: 200,
      //   margins: 5
      // });

      const galleryImages = _.map(images, (image) => {
        return {
          src: getImageUrl(image.image),
          width: Math.floor(Math.random() * 3) + 2,
          height: 2,
        };
      });

      setGalleryPhotos(galleryImages);
      const bnbimages = _.map(images, (image) => {
        return {
          photo: `${config.s3bucketLink}${image.image}`,
          caption: image.title,
          subcaption: image.description,
          thumbnail: `${config.s3bucketLink}${image.image}`,
        };
      });
      setBnbGalleryImages(bnbimages);
    }
  }, []);

  const latLng = locationCoordinates && locationCoordinates.split(",");
  return (
    <Layout footer={false} lightHeader={true}>
      {attendLink ? (
        <div
          className={`${style.attendbar} ${!isEnglish && style.attendbar__ar}`}
        >
          <Container>
            <Button
              type="primary"
              size="small"
              style={{
                width: 140,
              }}
              link
              href={attendLink}
              target="_blank"
            >
              {attendButtonText ? attendButtonText : "Attend"}
            </Button>
          </Container>
        </div>
      ) : null}

      <div className={style.article__banner__wrapper}>
        <div
          className={style.article__banner}
          style={{
            backgroundImage: `url(${config.s3bucketLink}${featuredImage})`,
          }}
        />
        <Container className={style.article__banner__text}>
          <Row gutter={25} align="middle" justify="center">
            <Col span={24}>
              <div>
                {/* <Fade
                  bottom
                  duration={700}
                  distance="100px"
                  delay={300}
                  ssrReveal
                > */}
                <div className={style.article__title}>
                  <h2>{name}</h2>
                  <p>{moment(date).format("MMMM DD, YYYY")}</p>
                  {attendLink ? (
                    <Button
                      type="action__light"
                      link
                      href={attendLink}
                      target="_blank"
                    >
                      {attendButtonText ? attendButtonText : "Attend"}
                    </Button>
                  ) : null}
                </div>
                {/* </Fade> */}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className={style.container}>
        <Row gutter={25} type="flex">
          <Col md={8} order={isEnglish ? 2 : 1}>
            <h4 id="about" className={style.h4}>
              Location
            </h4>
            <p className={style.paragraph}>{location}</p>
          </Col>
          <Col md={14} order={isEnglish ? 1 : 2}>
            <h4 className={style.h4}>About the Event</h4>
            <div
              dangerouslySetInnerHTML={{ __html: synopsis }}
              className={style.paragraph}
            ></div>
          </Col>
        </Row>
        <Divider />
        <Row gutter={25}>
          <Col
            lg={{
              span: 16,
              offset: isEnglish ? 0 : 8,
            }}
          >
            <h4 id="agenda" className={style.event__agenda}>
              Agenda
            </h4>
            <div className={style.event__date}>
              <h5>{moment(date).format("MMM D, YYYY")}</h5>
            </div>
            <div className={style.event__item__wrapper}>
              {agenda && agenda.data && agenda.data.length
                ? _.map(agenda.data, (ag, i) => {
                    return (
                      <Row
                        key={i}
                        gutter={25}
                        type="flex"
                        className={style.event__item}
                      >
                        <Col md={4} lg={3} order={isEnglish ? 2 : 1}>
                          <span>{moment(ag.date).format("hh:mm A")}</span>
                        </Col>
                        <Col md={20} lg={21} order={isEnglish ? 1 : 2}>
                          <h6>{ag.title}</h6>
                          <p>{ag.description}</p>
                        </Col>
                      </Row>
                    );
                  })
                : null}
            </div>
          </Col>
        </Row>

        {speakers && speakers.length ? (
          <Row gutter={25} className={style.event__speaker__wrapper}>
            <Col span={24}>
              <h6 id="speakers" className={style.event__speaker__title}>
                Speakers
              </h6>
            </Col>

            <Col span={24}>
              <Row gutter={25} type="flex" align="top">
                {_.map(speakers, (speaker, i) => (
                  <Col xs={12} sm={8} md={6} lg={4} key={i}>
                    <div className={style.event__speaker}>
                      <Avatar
                        size={98}
                        src={`${config.s3bucketLink}${speaker.photo}`}
                      />
                      <h6>{speaker.fullName}</h6>
                      <p>{speaker.title}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        ) : null}

        {sponsors && sponsors.length ? (
          <Row className={style.event__partner__wrapper}>
            <Col span={24}>
              <h6 id="partners" className={style.event__speaker__title}>
                Our Partners
              </h6>
            </Col>
            <Col span={24}>
              <Row gutter={25} type="flex" align="middle">
                {_.map(_.uniqBy(sponsors, "link"), (sponsor, i) => (
                  <Col xs={12} sm={8} md={6} lg={4} key={i}>
                    <a href={sponsor.link} target="_blank">
                      <img
                        src={`${config.s3bucketLink}${sponsor.logo}`}
                        className={style.sponsor__image}
                      />
                    </a>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        ) : null}

        {isUserLoggedIn && images && images.length ? (
          <Row className={style.event__partner__wrapper}>
            <Col span={24}>
              <h6 id="images" className={style.event__speaker__title}>
                Event Images
              </h6>
            </Col>
            <Col span={24}>
              <Row gutter={25} type="flex" align="middle">
                <div className="imageGrid">
                  <Gallery
                    photos={galleryPhotos}
                    onClick={(index, photo) => {
                      setActivePhotoIndex(photo.index);
                      setGalleryOpen(true);
                    }}
                  />
                </div>
                <ReactBnbGallery
                  activePhotoIndex={activePhotoIndex}
                  show={galleryOpen}
                  photos={bnbGalleryImages}
                  onClose={() => setGalleryOpen(false)}
                  backgroundColor="rgba(0, 0, 0, 0.9)"
                />
              </Row>
            </Col>
          </Row>
        ) : null}
      </Container>
      {/* <Container fluid={true}>
        <Carousel className={style.carousel} longread={true} />
      </Container> */}
      <Container>
        <Row gutter={25}>
          <Col span={24}>
            <div id="location">
              <h6 className={style.event__speaker__title}>
                {location}
                <Button
                  link
                  href={`http://maps.google.com/maps?z=12&t=m&q=${locationCoordinates}`}
                  target="_blank"
                  size="small"
                  className={!isEnglish && style.route__ar}
                >
                  Route on Google Maps
                </Button>
              </h6>
            </div>
          </Col>
        </Row>
      </Container>
      {locationCoordinates ? (
        <Container fluid={true}>
          {/* <img
          src="https://i.imgur.com/tss7vuy.jpg"
          style={{ width: "100%", marginBottom: 50 }}
        /> */}
          <div className={style.mapwrapper}>
            <MapContainer lat={latLng[0]} lng={latLng[1]} />
          </div>
          {/* <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2194.279484334547!2d55.26096751341813!3d25.183664736228685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69d047294591%3A0x9ad7e353822dc797!2sThe%20Citadel%20Tower!5e0!3m2!1sen!2sae!4v1569333087967!5m2!1sen!2sae"
          height="545"
          frameborder="0"
          style="border:0;"
          allowfullscreen=""
          style={{ width: "100%", marginBottom: 50 }}
        ></iframe> */}
        </Container>
      ) : null}
      <Container className={style.bottom__pad}>
        <Row gutter={25} type="flex">
          <Col span={24}>
            <div id="contact">
              <h6 className={style.event__speaker__title}>Contact</h6>
            </div>
          </Col>
          <Col lg={8}>
            <div
              className={style.paragraph}
              dangerouslySetInnerHTML={{ __html: contact }}
            ></div>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};
export default EventDetailPage;
