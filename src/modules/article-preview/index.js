import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import NormalView from './NormalView';
import LongReadView from './LongReadView';

const ArticleView = ({
  loadedData: { template, articleDetails, breadcrumbTrail, redirect = false, ignoreParentUrl, preview },
  ...props
}) => {
  useEffect(() => {
    if (redirect) {
      props.history.push('/404');
    }
  }, []);
  return (
    <>
      {
        {
          normal: (
            <NormalView
              breadcrumbTrail={breadcrumbTrail}
              articleDetails={articleDetails}
              ignoreParentUrl={ignoreParentUrl}
              preview={preview}
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
