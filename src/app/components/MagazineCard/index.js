import React, { useState, useEffect } from "react";
import _ from "lodash";
import { saveAs } from "./file-saver";
import { withRouter } from "react-router-dom";
import { Modal, Carousel, message, notification, Progress } from "antd";
import AppButton from "@components/Button";
import ArrowLeft from "@images/slider-arrow-left-light.svg";
import ArrowRight from "@images/slider-arrow-right-light.svg";
import config from "@config";
import { useTranslation } from "react-i18next";
import { apiPostAuthFormData } from "@services";
import style from "./styles.scss";
import { isLoggedIn } from "@utils";
import AddToCart from "../../../modules/magazine-cart/CartPopup";
import { withCookies } from "react-cookie";

const MagazineCard = ({ featured, item, hideName, hideTitle, history }) => {
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isCartVisible, setCartVisibility] = useState(false);
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { id, featuredImage, name, magazineimages } = item;
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const isEnglish = language !== "ar";
  const toggleModal = () => {
    setModalVisibility(!isModalVisible);
  };
  const toggleCartModal = () => {
    setCartVisibility(!isCartVisible);
  };

  useEffect(() => {
    setIsLoggedIn(isLoggedIn());
  }, []);

  const notificationArg = {
    key: "download_pdf_progress",
    message: `Downloading`,
    description: (
      <div>
        <p>Please wait while we download the magazine.</p>
        <Progress percent={downloadProgress} />
      </div>
    ),
    placement: "bottomRight",
    duration: 0,
  };

  useEffect(() => {
    downloading && notification.info(notificationArg);
  }, [downloadProgress]);

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: <img src={ArrowRight} />,
    prevArrow: <img src={ArrowLeft} />,
  };

  const downloadMagazine = () => {
    let timerProgress = null;
    let oldProgress = 0;
    message.success("PDF Download has been started!");
    setDownloading(true);
    apiPostAuthFormData(
      "/free-download",
      {
        magazine: item.id,
      },
      (response) => {
        try {
          const url = response.data.downloadLink;
          saveAs(url, item.name, {
            onDownloadComplete: (ev) => {
              setDownloading(false);
              notification.close("download_pdf_progress");
            },
            onDownloadProgress: (ev) => {
              const progress = Math.floor((100 * ev.loaded) / ev.total);
              if (oldProgress !== progress) {
                setDownloadProgress(progress);
                console.log("Progress", progress);
              }
              oldProgress = progress;
            },
          });
          notification.info(notificationArg);
        } catch (e) {
          console.log("error download pdf");
          message.error("Download failed!");
        }
        // const win = window.open(response.data.downloadLink, '_blank');
        // win.focus();
      },
      (error) => {
        console.log("An error occurred:", error);
        message.error("Something went wrong! Please try again");
      }
    );
  };

  const addToCart = () => {
    if (loggedIn) {
      if (item.free) {
        downloadMagazine();
      } else {
        toggleCartModal();
      }
    } else {
      message.warn("Login required!");
      history.push(`/login?redirect=${`${isEnglish ? "" : "/ar"}/magazines`}`);
    }
  };

  return (
    <>
      <div
        className={`${style.card} ${featured && style.card__featured}  ${
          !isEnglish && style.card__featured__ar
        }`}
      >
        {item.free ? <span className={style.free__magazine}>FREE</span> : ""}
        {!item.free && item.discount ? (
          <span className={style.free__magazine}>${item.discount} OFF</span>
        ) : (
          ""
        )}
        <img
          src={`${config.s3bucketLink}${featuredImage}`}
          alt={name}
          style={featured && { objectFit: "contain" }}
        />
        <div className={style.overlay}>
          <AppButton
            type="action__light"
            onClick={addToCart}
            className={downloading ? style.disabled_btn : ""}
          >
            {item.free
              ? downloading
                ? t("downloadProgress")
                : t("download")
              : t("addToCart")}
          </AppButton>
          {magazineimages && magazineimages.length ? (
            <AppButton type="action__light" onClick={toggleModal}>
              {t("preview")}
            </AppButton>
          ) : null}
        </div>
      </div>
      {hideTitle
        ? null
        : name && !featured && <h2 className={style.title}>{name}</h2>}

      <div className={style.mobile_buttons}>
        <AppButton
          type="primary"
          onClick={addToCart}
          className={downloading ? style.disabled_btn : ""}
        >
          {item.free
            ? downloading
              ? t("downloadProgress")
              : t("download")
            : t("addToCart")}
        </AppButton>
        {magazineimages && magazineimages.length ? (
          <AppButton type="primary" onClick={toggleModal}>
            {t("preview")}
          </AppButton>
        ) : null}
      </div>
      {magazineimages && magazineimages.length ? (
        <Modal
          footer={null}
          visible={isModalVisible}
          onCancel={toggleModal}
          className="magazine-modal"
        >
          <Carousel {...settings} className={style.carousel}>
            {_.map(magazineimages, (image) => (
              <div className={style.carousel__image}>
                <img src={`${config.s3bucketLink}${image.image}`} alt={name} />
              </div>
            ))}
          </Carousel>
        </Modal>
      ) : null}

      <Modal
        footer={null}
        width={860}
        visible={isCartVisible}
        wrapClassName={isEnglish ? "" : style.rtl}
        onCancel={toggleCartModal}
      >
        <AddToCart
          magazine={item}
          history={history}
          closePopup={toggleCartModal}
        />
      </Modal>
    </>
  );
};

export default withRouter(MagazineCard);
