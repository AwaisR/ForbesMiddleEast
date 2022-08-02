import React, { useState, useEffect } from "react";
import { bindActionCreators } from "redux";
import { Waypoint } from "react-waypoint";

import { connect } from "react-redux";
import config from "@config";
import { addLoadedImage } from "@redux/general-actions";

const ProgressiveImage = ({
  alt,
  backgroundPosition,
  image,
  loadedImages,
  objectFit,
  addLoadedImage
}) => {
  const [imageSrc, setImageSrc] = useState(config.defaultImage);
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   if (loadedImages.indexOf(image) === -1) {
  //     setLoading(true);
  //     requestImage();
  //   }
  // }, []);

  const requestImage = () => {
    const imgLoad = new Image();
    imgLoad.src = image;
    imgLoad.addEventListener("load", e => {
      setImageSrc(image);
      setLoading(false);
      addLoadedImage(image);
    });
  };
  const initializeRequest = () => {
    if (loadedImages.indexOf(image) === -1) {
      setLoading(true);
      requestImage();
    } else {
      setImageSrc(image);
    }
  };
  const style = {
    filter: `${loading ? "blur(50px)" : ""}`,
    objectPosition: `${backgroundPosition ? backgroundPosition : "center"}`
  };
  if (objectFit) {
    style.objectFit = objectFit;
  }
  return (
    <Waypoint onEnter={initializeRequest}>
      <img style={style} src={imageSrc} alt={alt} />
    </Waypoint>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { loadedImages } = state.generalReducer;
  return {
    loadedImages
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ addLoadedImage }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProgressiveImage);
