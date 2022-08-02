import React, { useState, useEffect } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import {TYPE, LANG} from "../magazine-cart/magazineConfig";

import { Row, Col } from "antd";

import { apiGetAuth } from "@services";
import style from "./styles.scss";

export default () => {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    getList();
  }, []);

  const getDiscountPrice = (price, qty, discount) => {
    const p = Number(price) * parseInt(qty);
    const d = Number(discount) * parseInt(qty);
    if( p > d){
      return p - d;
    }
    return p
  }

  const getList = () => {
    apiGetAuth(
      `/users/subscriptions?page=${page}`,
      (res) => {
        console.log(res.data);
        if (res.data && res.data.length) {
          setList(res.data);
        }
      },
      () => {}
    );
  };

  const SubscriptionList = list.map((item, index) => {

    const { id, subscriptionPrice, created_at, subscriptionType, region, magazineDiscount } = item;
    return (
      <Row type="flex" key={index}>
        <Col lg={24} className={style.list__item}>
          <Row type="flex" align="middle">
            <Col xs={24} sm={12} md={2}>
              <div>
                <h3 className="p">
                  {t('order') + ' #' + id}
                </h3>
              </div>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <div>
                <h3 className="p">
                  {TYPE[subscriptionType]}
                </h3>
              </div>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <div>
                <h3 className="p">
                  {region} | {LANG[subscriptionType]}
                </h3>
              </div>
            </Col>
            <Col xs={24} sm={12} md={2}>
              <div>
                <span className={style.list__date}>
                  {moment(created_at).format("DD MMM YYYY")}
                </span>
              </div>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <div>
                {
                  magazineDiscount && magazineDiscount > 0 ? (
                    <span className={style.list__price}><span className={style.stikeit}>${subscriptionPrice}</span> ${getDiscountPrice(subscriptionPrice, 1, magazineDiscount)} USD</span>
                  ) : (
                    <span className={style.list__price}>${subscriptionPrice} USD</span>

                  )
                }
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  });

  return (
    <div className={style.list}>
      {list.length ? SubscriptionList : <p>You have not subscribed to any magazines yet!</p>}
    </div>
  );
};

