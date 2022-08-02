import React, { useState } from "react";
import { isMobile, isBrowser } from "react-device-detect";
import PropTypes from "prop-types";
import { Row, Col, Icon, message } from "antd";
import { withRouter, Link } from "react-router-dom";
import { Waypoint } from "react-waypoint";

import Author from "@components/Author";
import ImageZoom from "@components/ImageZoom";
import SocialShare from "@components/SocialShare";
import {
  bookmarkItem,
  isItemBookmarked,
  getImageUrl,
  extractLanguage,
} from "@utils";
import style from "./styles.scss";
import { Share, Bookmark, ShareMobile } from "@icons";

const ShareArticle = ({ link, handleBookMark, handleCopy, isBookmarked }) => (
  <div
    className={`${style.article__social} ${
      isBookmarked ? style.article__social__bookmarked : null
    } share-article`}
  >
    <div className={style.article__image__share}>
      <div>
        <SocialShare link={link} hideCopy={true} />
      </div>
      <Icon component={Share} onClick={handleCopy} />
    </div>
    <Icon component={Bookmark} onClick={handleBookMark} />
  </div>
);

const ShareArticleMobile = ({
  link,
  handleBookMark,
  isBookmarked,
  language,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`${style.article__social__mobile} ${
        isBookmarked ? style.article__social__mobile__bookmarked : null
      } share-article ${
        language === "ar" && style.article__social__mobile__ar
      }`}
    >
      {language === "ar" ? (
        <>
          <div
            className={`${style.article__image__share__mobile} ${
              open ? style.share__mobile__open : null
            }`}
          >
            <SocialShare link={link} />
          </div>
          <Icon
            component={ShareMobile}
            // className={style.rotate}
            style={{
              transform: "scaleX(-1)",
              marginRight: 15,
            }}
            onClick={() => setOpen(!open)}
          />
          <Icon component={Bookmark} onClick={handleBookMark} />
        </>
      ) : (
        <>
          <Icon component={Bookmark} onClick={handleBookMark} />
          <Icon component={ShareMobile} onClick={() => setOpen(!open)} />
          <div
            className={`${style.article__image__share__mobile} ${
              open ? style.share__mobile__open : null
            }`}
          >
            <SocialShare link={link} />
          </div>
        </>
      )}
    </div>
  );
};

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
          h6: <h6 className={className}>{title}</h6>,
        }[tag]
      }
    </>
  );
};

const ArticleItem = ({
  history,
  featured,
  featuredHome,
  featuredSlider,
  data,
  className,
  light,
  medium,
  tag,
  showImageOnMobile,
  imageClassName,
  imageGrid,
  detailsGrid,
  ignoreParentUrl = false,
  hideAuthorImage,
  hideShare,
  ...props
}) => {
  const {
    featuredImage,
    title,
    author,
    publishedDate,
    slug,
    category,
    backgroundPosition,
  } = data;
  // console.log(language, props);
  const language = extractLanguage(props.location.pathname);
  ignoreParentUrl = category && category.slug === "press-room";
  const categoryName = (category && category.slug) || "";
  const categoryParent = category
    ? category.parent
      ? category.parent.slug
      : null
    : null;
  const cLink = ignoreParentUrl
    ? `${language === "ar" ? "/ar" : ""}/${categoryName}`
    : `${language === "ar" ? "/ar" : ""}/${categoryParent}/${categoryName}`;
  const image = getImageUrl(featuredImage);
  const [isBookmarked, setIsBookmarked] = useState(
    isItemBookmarked(`${cLink}/${encodeURIComponent(slug)}`)
  );

  const handleBookMark = (obj) => {
    // console.log('bookmark', obj);
    bookmarkItem(obj, (bool) => {
      setIsBookmarked(bool);
    });
  };

  const handleCopy = (link) => {
    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = link ? `${location.origin}${link}` : location.href;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    message.success("Link copied to clipboard");
  };

  const handleNavigate = (e, categoryName, slug) => {
    e.stopPropagation();
    e.preventDefault();
    history.push(`${categoryName}/${encodeURIComponent(slug)}`);
  };

  const imgGrid = imageGrid
    ? imageGrid
    : {
        span: 24,
      };
  const dGrid = detailsGrid
    ? detailsGrid
    : {
        span: 24,
      };
  const bookmarkObject = {
    type: "article",
    link: `${cLink}/${encodeURIComponent(slug)}`,
    title: title,
  };

  // console.log(encodeURIComponent(slug));
  const tasd = encodeURIComponent(slug);
  return (
    <Row
      type="flex"
      gutter={{
        xs: 0,
        sm: 5,
      }}
      align="middle"
      className={`${style.article__item} ${
        light && style.article__item__light
      } ${className}`}
    >
      <Col
        span={24}
        {...imgGrid}
        className={`${style.article__image__wrapper} ${
          !showImageOnMobile && style.article__image__hidemobile
        }`}
      >
        <Waypoint>
          <div>
            <ImageZoom
              src={image}
              alt={title}
              backgroundPosition={backgroundPosition}
              className={` article-image ${style.article__image} ${
                featured ? style.article__image__featured : null
              } ${medium ? style.article__image__medium : null} ${
                featuredHome && style.article__image__featured__home
              } ${
                featuredSlider && style.article__image__featured__slider
              } ${imageClassName}`}
              onClick={(e) => handleNavigate(e, cLink, slug)}
            />
          </div>
        </Waypoint>
        {isBrowser && !hideShare ? (
          <ShareArticle
            isBookmarked={isBookmarked}
            handleBookMark={() => handleBookMark(bookmarkObject)}
            handleCopy={() =>
              handleCopy(`${cLink}/${encodeURIComponent(slug)}`)
            }
            link={`${cLink}/${encodeURIComponent(slug)}`}
          />
        ) : null}
      </Col>
      <Col span={24} {...dGrid} className={style.article__padding}>
        <p className={style.article__category}>
          {category ? (
            <Link to={data.category ? cLink : null}>
              {language === "en"
                ? category.name
                : category.nameAR
                ? category.nameAR
                : category.name}
            </Link>
          ) : null}
        </p>
        <Link to={`${cLink}/${tasd}`}>
          <Title
            tag={tag}
            title={title}
            className={`${featured ? "h2" : "h5"} ${
              featured && style.title__featured
            }  ${style.title}`}
          />
        </Link>
        {author ? (
          <Author
            author={author}
            date={publishedDate}
            noMargin={true}
            hideImage={hideAuthorImage}
            hideDate={true}
          />
        ) : null}
        {isMobile ? (
          <ShareArticleMobile
            isBookmarked={isBookmarked}
            language={language}
            handleBookMark={() => handleBookMark(bookmarkObject)}
            handleCopy={() =>
              handleCopy(`${cLink}/${encodeURIComponent(slug)}`)
            }
            link={`${cLink}/${encodeURIComponent(slug)}`}
          />
        ) : null}
      </Col>
    </Row>
  );
};

ArticleItem.propTypes = {
  data: PropTypes.object.isRequired,
  featured: PropTypes.bool,
  showImageOnMobile: PropTypes.bool,
  light: PropTypes.bool,
  tag: PropTypes.string,
};

ArticleItem.defaultProps = {
  featured: false,
  light: false,
  tag: "h2",
  showImageOnMobile: true,
};

export default withRouter(ArticleItem);
