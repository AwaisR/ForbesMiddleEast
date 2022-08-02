import React from "react";
import { Layout } from "antd";

import Header from "../Header";
import Footer from "../Footer";
import style from "./styles.scss";

const AppLayout = ({ lightHeader, children, footer, header }) => {
  return (
    <Layout>
      {header ? <Header lightHeader={lightHeader} /> : null}
      <div className={style.children}>{children}</div>
      {footer ? <Footer /> : <div />}
    </Layout>
  );
};

AppLayout.defaultProps = {
  footer: true,
  header: true
};

export default AppLayout;
