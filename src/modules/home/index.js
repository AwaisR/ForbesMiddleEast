import React from "react";
import Layout from "@components/Layout";
import HomeFeatured from "./HomeFeatured";
import HomeSections from "./HomeSections";

const HomePage = ({ loadedData: { featured } }) => {
  return (
    <Layout footer={true}>
      <HomeFeatured featuredItems={featured} />
      <HomeSections />
    </Layout>
  );
};

export default HomePage;
