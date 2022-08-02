import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import EventDetailPage from "../event-detail-view";
// import ListTemplate from "@templates/article-template-list";

const EventView = ({
  loadedData: { data, show, redirect = false },
  ...props
}) => {
  useEffect(() => {
    if (redirect) {
      props.history.push("/404");
    }
  }, []);
  return <>{show && <EventDetailPage data={data} />}</>;
};

export default withRouter(EventView);
