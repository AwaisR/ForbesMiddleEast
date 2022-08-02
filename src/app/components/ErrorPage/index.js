import React from "react";
import Layout from "@components/Layout";
import Container from "@components/Container";
import style from "./styles.scss";

const ErrorPage = () => {
  return (
    <Layout footer={false} header={false}>
      <Container className={style.container}>
        <h1>Something went wrong. </h1>
        <h2>The page will be available in few minutes.</h2>
      </Container>
    </Layout>
  );
};

export default ErrorPage;
