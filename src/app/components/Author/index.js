import React from "react";
import moment from "moment";
import { Avatar } from "antd";
import { Link, withRouter } from "react-router-dom";
import { getImageUrl, extractLanguage } from "@utils";

import style from "./styles.scss";

const Author = ({
  author,
  position,
  className,
  date,
  noMargin = false,
  showTime = false,
  hideDate = false,
  hideImage = false,
  ...props
}) => {
  const language = extractLanguage(props.location.pathname);
  const isEnglish = language !== "ar";
  const authorName = isEnglish
    ? `${author && author.firstName && author.firstName} ${
        author && author.lastName ? author.lastName : ""
      }`
    : `${author && author.firstNameAR && author.firstNameAR} ${
        author && author.lastNameAR ? author.lastNameAR : ""
      }`;

  const authorRole = isEnglish
    ? author.role
      ? author.role.name
      : ""
    : author.role
    ? author.role.nameAR
    : "";
  return (
    <div
      className={`${style.article__author} ${style[className]} ${noMargin &&
        style.article__author__nomargin} ${!isEnglish &&
        style.article__author__ar}`}
    >
      {hideImage ? null : (
        <Link
          to={`${isEnglish ? "" : "/ar"}/author/${author &&
            author.slug &&
            author.slug.toLowerCase()}`}
          className={style.link}
        >
          {author && author.image ? (
            <img
              className={style.article__author__image}
              src={author && getImageUrl(author.userAvatar)}
              alt={authorName}
            />
          ) : (
            <Avatar
              size={30}
              shape="circle"
              className={style.article__avatar}
              src={author && getImageUrl(author.userAvatar)}
              alt={author && author.username}
            >
              {/* {generateAvatarFromString(author && author.username)} */}
            </Avatar>
          )}
        </Link>
      )}
      <div>
        By
        <b>
          <Link
            to={`${isEnglish ? "" : "/ar"}/author/${author &&
              author.slug &&
              author.slug.toLowerCase()}`}
          >
            <span
              itemProp="author"
              itemScope
              itemType="http://schema.org/Person"
            >
              <span itemProp="name">
                {authorName} {"  "}{" "}
              </span>
            </span>
          </Link>
        </b>
        <span
          className={`${style.authorTitle} ${!isEnglish &&
            style.authorTitle__ar}`}
        >
          {author && authorRole ? authorRole : null}
        </span>
      </div>
      {hideDate ? null : (
        <span
          itemProp="datePublished"
          style={{
            marginLeft: 15
          }}
        >
          {position
            ? null
            : moment(date).format(
                showTime ? "MMM DD, YYYY, H:mm A" : "MMM DD, YYYY"
              )}
        </span>
      )}
    </div>
  );
};
export default withRouter(Author);
