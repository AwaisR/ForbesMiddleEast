import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import NormalView from "./NormalView";
import LongReadView from "./LongReadView";

const ArticleView = ({
  loadedData: {
    template,
    articleDetails,
    blogImages,
    breadcrumbTrail,
    ignoreParentUrl,
    preview,
    queryParams,
    structuredData,
  },
  ...props
}) => {
  return (
    <>
      {
        {
          normal: (
            <NormalView
              structuredData={structuredData}
              breadcrumbTrail={breadcrumbTrail}
              articleDetails={articleDetails}
              blogImages={blogImages}
              ignoreParentUrl={ignoreParentUrl}
              preview={preview}
              queryParams={queryParams}
              {...props}
            />
          ),
          longread: <LongReadView articleDetails={articleDetails} {...props} />,
        }[template]
      }
    </>
  );
};

export default withRouter(ArticleView);
