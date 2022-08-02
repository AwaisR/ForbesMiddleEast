import React from 'react';
import style from './styles.scss';
import ImageZoom from '@components/ImageZoom';
const PlaceholderImage = ({ className, title, inPage, image, imageMobile }) => {
  return (
    <>
      {inPage ? (
        <div className={`${className} ${style.image} ${inPage && style.image__inpage}`}>
          <img src={image} alt={title} />
          <img src={imageMobile} alt={title} />
          <div>
            <span>{title}</span>
          </div>
        </div>
      ) : (
        <ImageZoom src={image} alt={title} className={`${className} ${style.image} ${inPage && style.image__inpage}`}>
          <div>
            <span>{title}</span>
          </div>
        </ImageZoom>
      )}
    </>
  );
};

export default PlaceholderImage;
