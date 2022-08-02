import React from 'react';
import style from './styles.scss';

const FormTemplate = ({ header, content, footer }) => (
  <>
    <div className={style.form__title}>{header}</div>
    <div className={style.form__content}>{content}</div>
    <div className={style.form__footer}>{footer}</div>
  </>
);

export default FormTemplate;
