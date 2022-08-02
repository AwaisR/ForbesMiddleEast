import React from 'react';
import ProgressiveImage from '@components/ProgressiveImage';

import style from './styles.scss';

const ImageZoom = ({
  children,
  src,
  alt,
  className,
  onClick,
  objectFit,
  backgroundPosition
}) => {
  return (
    <div className={`${className} ${style.imagezoom}`} onClick={onClick}>
      <ProgressiveImage
        image={src}
        alt={alt}
        backgroundPosition={backgroundPosition}
        objectFit={objectFit}
      />
      {/* <img src={src} alt={alt} /> */}
      {children}
    </div>
  );
};

export default ImageZoom;
