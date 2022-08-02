import React from "react";
import moment from "moment";
import { Avatar } from "antd";
import { Link, withRouter } from "react-router-dom";
import { isMobileOnly } from "react-device-detect";
import PlaceholderImage from "@components/PlaceholderImage";
import ImageZoom from "@components/ImageZoom";
import { getImageUrl, extractLanguage } from "@utils";
import style from "./styles.scss";

const Title = ({ tag, title, className }) => {
  return (
    <>
      {
        {
          h1: <h1 className={className}>{title}</h1>,
          h2: <h2 className={className}>{title}</h2>,
          h3: <h3 className={className}>{title}</h3>,
          h4: <h4 className={className}>{title}</h4>,
          h5: <h5 className={className}>{title}</h5>,
          h6: <h6 className={className}>{title}</h6>
        }[tag]
      }
    </>
  );
};

const CompanyItem = ({
  item: { image, company, title, featured, description },
  brandvoice,
  list,
  tag = "h2"
}) => (
  <div className={style.content}>
    <a>
      <ImageZoom
        src={image}
        alt={title}
        className={featured ? style.image__featured : style.image}
      />
      <div
        className={`${style.title__wrapper} ${
          featured ? style.title__wrapper__featured : null
        }`}
      >
        <div>
          {brandvoice && !list ? (
            <Avatar src={company.image} size={31} shape="circle" />
          ) : null}
          {/* {featured ? <h2>{title}</h2> : <h5>{title}</h5>} */}
          <Title tag={tag} title={title} className={featured ? "h2" : "h5"} />
          {brandvoice && !list ? (
            <div
              className={`${style.badge} ${
                featured ? style.badge__featured : null
              }`}
            >
              Voice
            </div>
          ) : null}
        </div>
        {!list ? (
          <p className={brandvoice ? style.moveleft : null}>{description}</p>
        ) : null}
      </div>
    </a>
  </div>
);

export const CompanyItemBrandvoice = withRouter(
  ({
    item: { name, slug, subtitle, featuredImage, bannerImage, thumbnailImage },
    featured,
    brandvoice = true,
    list,
    tag = "h2",
    textWrapperStyle,
    ...props
  }) => {
    const banner = featured
      ? getImageUrl(bannerImage)
      : getImageUrl(thumbnailImage);
    const image = getImageUrl(featuredImage);
    const language = extractLanguage(props.location.pathname);
    const isEnglish = language !== "ar";
    return (
      <div className={style.content}>
        <Link to={`${language === "ar" ? "/ar" : ""}/brandvoice/${slug}`}>
          <ImageZoom
            src={banner}
            alt={name}
            objectFit={"cover"}
            className={`${featured ? style.image__featured : style.image} ${
              style.image__brandvoice
            }`}
          />
          <div
            className={`${style.title__wrapper} ${
              featured ? style.title__wrapper__featured : null
            } ${textWrapperStyle}`}
          >
            <div
              className={`${style.title__wrapper__brandvoice} ${!isEnglish &&
                style.title__wrapper__brandvoice__ar}`}
            >
              <Avatar src={image} size={31} shape="circle" />
              <Title
                tag={tag}
                title={name}
                className={featured ? "h2" : "h5"}
              />
              <div
                className={`${style.badge} ${!isEnglish && style.badge__ar} ${
                  featured ? style.badge__featured : null
                }`}
              >
                Voice
              </div>
            </div>
            {!list ? (
              <p className={brandvoice ? style.moveleft : null}>{subtitle}</p>
            ) : null}
          </div>
        </Link>
      </div>
    );
  }
);

export const EventItem = ({
  item: { name, subtitle, slug, homepageEventImage, date, location },
  featured,
  tag = "h2"
}) => {
  const banner = homepageEventImage
    ? `https://d1epq84pwgteub.cloudfront.net/${homepageEventImage}`
    : "https://d1epq84pwgteub.cloudfront.net/files/1/default-image.png";

  return (
    <div className={style.content}>
      <Link to={`/events/${encodeURIComponent(slug)}`}>
        <ImageZoom
          src={banner}
          alt={name}
          className={featured ? style.image__featured : style.image}
        />
        <div
          className={`${style.title__wrapper} ${
            featured ? style.title__wrapper__featured : null
          }`}
        >
          <div>
            <Title tag={tag} title={name} className={featured ? "h2" : "h5"} />
          </div>
          <p>
            {moment(date).format("MMMM DD, YYYY HH:MM")} {location}
          </p>
        </div>
      </Link>
    </div>
  );
};

export const ListItem = withRouter(
  ({
    item: {
      name,
      slug,
      featuredCover,
      featuredImage,
      featuredRecommendedList,
      featuredLatestList,
      featuredCoverMonth,
      publishedDate
    },
    parent,
    featured,
    tag = "h2",
    ...props
  }) => {
    const language = extractLanguage(props.location.pathname);
    const isOld = moment(new Date(publishedDate)).isBefore(
      moment("09-01-2018", "MM-DD-YYYY")
    );
    const isHomePage = parent === "home";
    const banner = isHomePage
      ? getImageUrl(featuredImage ? featuredImage : featuredRecommendedList)
      : getImageUrl(featuredRecommendedList);
    const featuredBanner = isMobileOnly
      ? banner
      : getImageUrl(featuredCoverMonth);

    return (
      <div className={style.content}>
        <Link
          to={`${language === "ar" ? "/ar" : ""}/list/${encodeURIComponent(
            slug
          )}`}
        >
          {isOld ? (
            <PlaceholderImage
              title={name ? name : ""}
              image={banner}
              className={`${style.image__list} ${
                featured ? style.image__featured : style.image
              }`}
            />
          ) : (
            <ImageZoom
              src={featured ? featuredBanner : banner}
              alt={name ? name : ""}
              className={`${style.image__list} ${
                featured ? style.image__featured : style.image
              }`}
            />
          )}
          <div
            className={`${style.title__wrapper} ${
              featured ? style.title__wrapper__featured : null
            }`}
          >
            <div>
              <Title
                tag={tag}
                title={name}
                className={featured ? "h2" : "h5"}
              />
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

export const NominationItem = ({
  item: { title, slug, featuredImage, categories },
  parent,
  featured,
  tag = "h2"
}) => {
  const banner = featuredImage
    ? `https://d1epq84pwgteub.cloudfront.net/${featuredImage}`
    : "https://i.imgur.com/gBFEoyU.jpg";
  // const parentSlug = parent ? parent : categories && categories.length ? categories[0].slug : null;
  return (
    <div className={style.content}>
      <a href={`/nominations/${encodeURIComponent(slug)}`}>
        <ImageZoom
          src={banner}
          alt={title}
          className={`${style.image__list} ${
            featured ? style.image__featured : style.image
          }`}
        />
        <div
          className={`${style.title__wrapper} ${
            featured ? style.title__wrapper__featured : null
          }`}
        >
          <div>
            <Title tag={tag} title={title} className={featured ? "h2" : "h5"} />
          </div>
        </div>
      </a>
    </div>
  );
};

export default CompanyItem;
