import React from "react";
import {useTranslation} from "react-i18next";
import {Col, Row} from "antd";
import {TYPE, LANG} from "../magazine-cart/magazineConfig";
import style from "../magazine-cart/styles.scss";

const OrderDetails = ({order, history, closePopup, ...props}) => {
  const {
    t,
    i18n
  } = useTranslation();
  const isEnglish = i18n.language !== "ar";
  const {orderitems = [], total, id} = order;

  const getDiscountPrice = (price, qty, discount) => {
    const p = Number(price) * parseInt(qty);
    const d = Number(discount) * parseInt(qty);
    if( p > d){
      return p - d;
    }
    return p
  }

  return (
    <div className={style.form}>
      <Row>
        <Col span={12}>
          <h6>{ t('order')+ ': #' + id}</h6>
        </Col>
        <Col span={12}>
          <h6 style={{textAlign: 'right'}}>
            {
              order && order.total ? (
                <>
                  { order && order.discount > 0 ? (<span className={style.strikeit}>${order.total}</span>) : ''}
                  TOTAL: {' '}  ${getDiscountPrice(order.total, 1, order.discount)} {' '} USD
                </>
              ) : 'FREE'
            }
          </h6>

        </Col>
      </Row>
      <p/>
      <Row
        type="flex"
        align="bottom"
        gutter={12}
        className={style.form__header}
      >
        <Col span={6}>
          <h6>{t("item")}</h6>
        </Col>
        <Col span={2}>
          <h6>{t("region")}</h6>
        </Col>
        <Col span={6}>
          <h6>{t("type")}</h6>
        </Col>
        <Col span={4}>
          <h6>{t("language")}</h6>
        </Col>
        <Col span={2}>
          <h6>{t("quantity")}</h6>
        </Col>
        <Col span={3}>
          <h6>{t("price")}</h6>
        </Col>
      </Row>
      {
        orderitems.length ? orderitems.map((item, index) => {
          return (
            <Row gutter={12} className={style.table__row} key={'order-item-'+index}>
              <Col className={`${style.table__column} ${!isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={6}>
                <label>{t("name")}</label>
                <h6 className={style.ellipsis}>{item.magazine.name}</h6>
              </Col>
              <Col className={`${style.table__column} ${!isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={2}>
                <label>{t("region")}</label>
                <h6>{item.region || '-'}</h6>
              </Col>
              <Col className={`${style.table__column} ${!isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={6}>
                <label>{t("type")}</label>
                <h6>{TYPE[item.subscriptionType] || '-'}</h6>
              </Col>
              <Col className={`${style.table__column} ${!isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={4}>
                <label>{t("language")}</label>
                <h6>{LANG[item.subscriptionType] || '-'}</h6>
              </Col>
              <Col className={`${style.table__column} ${!isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={2}>
                <label>{t("quantity")}</label>
                <h6>{item.quantity}</h6>
              </Col>
              <Col className={`${style.table__column} ${!isEnglish ? style.table__column__ar : ''}` } xs={24} sm={12} md={8} lg={3}>
                <label>{t("price")}</label>
                <div className={style.price__container}>
                      { Number(item.subscriptionPrice) && item.magazine && item.magazine.discount > 0 ? (
                        <span className={style.price}>
                                 <span className={style.price__cut}>${Number(item.subscriptionPrice) * parseInt(item.quantity)}</span> {' $'}{ getDiscountPrice(item.subscriptionPrice, item.quantity, item.magazine.discount)}
                          {' '} USD
                              </span>
                      ) : (
                        <span className={style.price}>
                            { Number(item.subscriptionPrice) ? (`$${(Number(item.subscriptionPrice) * parseInt(item.quantity))} USD`) : 'FREE'}
                        </span>
                      )
                      }
                </div>

              </Col>
            </Row>
          )
        }) : null
      }
    </div>
  );


}
export default OrderDetails;
