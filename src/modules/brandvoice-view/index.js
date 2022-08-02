import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import BrandvoiceDetail from "../brandvoice-detail-view";
// import ListTemplate from "@templates/article-template-list";

const BrandvoiceView = ({
  loadedData: { data, companyBlogs, show, redirect = false },
  ...props
}) => {
  useEffect(() => {
    if (redirect) {
      props.history.push("/404");
    }
  }, []);
  return (
    <>{show && <BrandvoiceDetail data={data} companyBlogs={companyBlogs} />}</>
  );
};

export default withRouter(BrandvoiceView);
