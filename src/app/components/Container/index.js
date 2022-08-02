import React from "react";
import PropTypes from "prop-types";
import style from "./styles.scss";

const Container = ({
  children,
  className,
  medium,
  fluid,
  fluidMobile,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`${className} ${medium && style.container__medium} ${
        fluid ? style.container__fluid : style.container
      } ${fluidMobile && style.container__mobile}`}
    >
      {children}
    </div>
  );
};

// Container.propTypes = {
//   children: PropTypes.node,
//   className: PropTypes.string,
//   fluid: PropTypes.bool,
// };

Container.defaultProps = {
  fluid: false
};

export default Container;
