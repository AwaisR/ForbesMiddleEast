import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { withRouter } from "react-router-dom";
import styles from "./styles.scss";
import { extractLanguage } from "@utils";

const StyledButton = ({
  type,
  children,
  style,
  className,
  size,
  link,
  ...props
}) => {
  const language = extractLanguage(props.location.pathname);
  const isEnglish = language !== "ar";
  const styl = `button__${type}`;
  const sze = `button__${size}`;

  return link ? (
    <a
      style={style}
      className={`${styles.button} ${className} ${styles[styl]} ${
        styles[sze]
      } ${!isEnglish && styles.button__ar}`}
      {...props}
    >
      {children}
    </a>
  ) : (
    <button
      style={style}
      className={`${styles.button} ${className} ${styles[styl]} ${
        styles[sze]
      } ${!isEnglish && styles.button__ar}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default withRouter(StyledButton);
