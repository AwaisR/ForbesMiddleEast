import React from "react";
import { Fade } from "react-reveal";
import PropTypes from "prop-types";
import _ from "lodash";
import style from "./styles.scss";

const FeaturedListStats = ({ items }) => {
  return (
    <div className={style.content}>
      <Fade bottom duration={700} distance="100px" ssrReveal={true} cascade>
        <div className={style.row}>
          {_.map(items, (item, i) => {
            return (
              <div key={i} className={style.column}>
                <img src={item.image} alt={item.name} />
                <h6>{item.name}</h6>
              </div>
            );
          })}
        </div>
      </Fade>
    </div>
  );
};

FeaturedListStats.propTypes = {
  items: PropTypes.array.isRequired
};

export default FeaturedListStats;
