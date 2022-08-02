import React from "react";
import { Icon } from "antd";
import style from "./styles.scss";
import Logo from "@images/logo-white.svg";

export const LoadingMore = ({ loading }) => (
  <div className={`${style.loader} ${loading ? style.loader__loading : null}`}>
    <Icon type="loading" />
  </div>
);

export const PageLoading = () => <div className={style.pageloader}></div>;

export const PageLoader = () => {
  return (
    <div className={style.apploader}>
      {/* <img src={Logo} height='50px' alt='Forbes Middle East' /> */}
    </div>
  );
};

export const PageSearching = () => (
  <div
    className={`${style.loader} ${style.loader__loading} ${style.loader__search}`}
  >
    <Icon type="loading" />
    <p>Searching</p>
  </div>
);
