import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import ListTemplate from "@templates/article-template-list";

const ListView = ({
  loadedData: { structuredData, listDetails, show, redirect = false },
  ...props
}) => {
  useEffect(() => {
    if (redirect) {
      props.history.push("/404");
    }
  }, []);
  return (
    <>
      {show && (
        <ListTemplate
          structuredData={structuredData}
          listDetails={listDetails}
        />
      )}
    </>
  );
};

export default withRouter(ListView);
