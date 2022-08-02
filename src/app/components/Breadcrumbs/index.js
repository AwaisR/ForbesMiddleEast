import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Link, withRouter } from "react-router-dom";
import { Breadcrumb } from "antd";
import { extractLanguage } from "@utils";
import style from "./styles.scss";

const NavCrumb = ({ trail, className, ...props }) => {
  const language = extractLanguage(props.location.pathname);
  return (
    <Breadcrumb className={`${className} ${style.breadcrumb}`}>
      {_.map(trail, (item, index) => {
        return (
          <Breadcrumb.Item key={index}>
            {item.slug ? (
              <Link
                to={`${language === "ar" && item.slug === "/" ? "/ar" : ""}${
                  item.slug
                }`}
                className={style.breadcrumb__link}
              >
                {item.title}
              </Link>
            ) : (
              <a className={style.breadcrumb__link}>{item.title}</a>
            )}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

NavCrumb.propTypes = {
  trail: PropTypes.array.isRequired
};

export default withRouter(NavCrumb);
