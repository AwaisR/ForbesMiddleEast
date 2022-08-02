import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Checkbox, Col, Form, Icon, message, Radio, Row, Select} from "antd";
import { getImageUrl } from "@utils";
import { apiPostAuthFormData } from "@services";
import AppButton from "@components/Button";
import {FLAGS, INPUT_TYPE, INPUT_LANG, TYPE, LANG} from "./magazineConfig";
import style from "./styles.scss";

const setRegionVal = (regionName, regionArr, id) => {
  for (let i = 0; i < regionArr.length; i++){
    const currentRegion = regionArr[i];
    if(currentRegion.name === regionName) return id ? i : currentRegion;
  }
}

const AddToCart = ({form, item, history, closePopup, ...props}) => {
  const regionPrices = (item.magazine && item.magazine.prices) ? Object.values(item.magazine.prices) : [];

  const [quantity, hookQuantity] = useState(parseInt(item.quantity));
  const type = INPUT_TYPE[item.subscriptionType];
  const [price, hookPrice] = useState(Number(item.subscriptionPrice));
  const region = setRegionVal(item.region, regionPrices);
  const language = INPUT_LANG[item.subscriptionType];
  const [subscriptionType, hookSubscriptionType] = useState(item.subscriptionType);
  const {
    t,
    i18n
  } = useTranslation();
  const isEnglish = i18n.language !== "ar";


  const getDiscountPrice = (price, qty, discount) => {
    const p = Number(price);
    const d = Number(discount) * parseInt(qty);
    if( p > d){
      return p - d;
    }
    return p
  }

  const handleQuantityAdd = () => {
    const newQuantity = quantity + 1;
    if(type === 'D'){
      hookQuantity(1);
    }else{
      hookQuantity(newQuantity);
    }
  };

  const handleQuantityMinus = () => {
    const newQuantity = quantity <= 1 ? 1 : quantity - 1;
    if(type === 'D'){
      hookQuantity(1);
    }else{
      hookQuantity(newQuantity);
    }
  };

  const calculatePrice = () => {
    let p = 0;
    if (region && type && language && language.length > 0) {
      if (type === 'D' && language.length === 2) {
        p = Number(region.dSingleEnAr);
        p = quantity * p;
        hookSubscriptionType(item.magazine.subscription ? FLAGS.DIGITAL.SUB.ENAR : FLAGS.DIGITAL.SINGLE.ENAR);
        return p
      }
      let subType = '';
      language.forEach((lang) => {
        if(item.magazine.subscription){
          if (lang === 'en') {
            p = p + (type === 'D' ? Number(region.dSubs) : Number(region.pSubs));
            subType = (type === 'D' ? FLAGS.DIGITAL.SUB.EN : FLAGS.PRINT.SUB.EN);
          } else {
            p = p + (type === 'D' ? Number(region.dSubsAR) : Number(region.pSubsAR));
            subType = (type === 'D' ? FLAGS.DIGITAL.SUB.AR : FLAGS.PRINT.SUB.AR);
          }
        } else {
          if (lang === 'en') {
            p = p + (type === 'D' ? Number(region.dSingle) : Number(region.pSingle));
            subType = (type === 'D' ? FLAGS.DIGITAL.SINGLE.EN : FLAGS.PRINT.SINGLE.EN);
          } else {
            p = p + (type === 'D' ? Number(region.dSingleAR) : Number(region.pSingleAR));
            subType = (type === 'D' ? FLAGS.DIGITAL.SINGLE.AR : FLAGS.PRINT.SINGLE.AR);
          }
        }

      })
      if(language.length === 2){
        subType = item.magazine.subscription ?  FLAGS.PRINT.SUB.ENAR : FLAGS.PRINT.SINGLE.ENAR;
      }
      hookSubscriptionType(subType);
      p = quantity * p;
      return p;
    }
  }

  useEffect(() => {
    hookPrice(calculatePrice());
  }, [quantity, region, language, type])

  const addToCart = () => {
    apiPostAuthFormData(
      "/add-to-cart",
      {
        magazine: item.magazine.id,
        region: region.name,
        subscriptionType,
        quantity
      },
      (response) => {
        message.success("Item updated!");
        closePopup(true);
      },
      (error) => {
        console.log("An error occurred:", error);
        message.error("Something went wrong! Please try again");
      }
    );
  }

  return (
    <Form>
      <div className={style.form}>
        <Row>
          <Col span={6}>
            <div className={style.wrap_title}>
              <h1>
                {item.magazine && item.magazine.name}
              </h1>
              <img src={getImageUrl(item.magazine && item.magazine.featuredImage)}/>
            </div>
          </Col>
        </Row>
        <Row type="flex"
             align="bottom"
             gutter={25}
             className={style.form__header}>
          <Col span={3}>
            <h6>{t("region")}</h6>
          </Col>
          <Col span={6}>
            <h6>{t("type")}</h6>
          </Col>
          <Col span={4}>
            <h6>{t("language")}</h6>
          </Col>
          <Col span={6}>
            <h6>{t("quantity")}</h6>
          </Col>
          <Col span={3}>
            <h6>{t("price")}</h6>
          </Col>
        </Row>
        <Row gutter={25} className={style.table__row}>
          <Col
            className={`${style.table__column} ${!isEnglish ? style.table__column__ar : ''}` }
            xs={24}
            sm={12}
            md={8}
            lg={3}>
            <label>{t("region")}</label>
            <h6 className={style.ellipsis}>{item.region}</h6>
          </Col>
          <Col
            className={`${style.table__column} ${!isEnglish ? style.table__column__ar : ''}` }
            xs={24}
            sm={12}
            md={8}
            lg={6}
          >
            <label>{t("type")}</label>
            <h6>{TYPE[item.subscriptionType]}</h6>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={4}
            className={`ant-form-item switch-input no-border ${style.table__column} ${!isEnglish ? style.table__column__ar : ''}`}
          >
            <label>{t("language")}</label>
            <h6>{LANG[item.subscriptionType]}</h6>
          </Col>
          {

          }
          <Col
            className={`${style.table__column} ${!isEnglish ? style.table__column__ar : ''}` }
            xs={24}
            sm={12}
            md={8}
            lg={6}
          >
            <label>{t("quantity")}</label>
            <div className={style.quantity}>
              <Button
                type="secondary"
                shape="circle"
                icon="minus"
                onClick={handleQuantityMinus}
              />
              <span>{quantity}</span>
              <Button
                type="secondary"
                shape="circle"
                icon="plus"
                onClick={handleQuantityAdd}
              />
            </div>
          </Col>
          <Col
            className={`${style.table__column} ${!isEnglish ? style.table__column__ar : ''}` }
            xs={24}
            sm={12}
            md={8}
            lg={3}
          >
            <label>{t("price")}</label>
            <div className={style.price__container}>
                  { price && item && item.magazine && item.magazine.discount ? (
                    <span className={style.price}>
                             <span className={style.price__cut}>${price}</span> {' $'}{ getDiscountPrice(price, quantity, item.magazine.discount)}
                    </span>
                  ) : (
                    <span className={style.price}>
                      {price ? `$${price}` : "-"}
                    </span>
                  )
                  }
            </div>
          </Col>
        </Row>
        <Row>
          <Col offset={12}>
            <div className={style.popup_cart_ctrl} hidden={!price}>
              <AppButton
                type="primary"
                size="small"
                style={{
                  width: "auto",
                }}
                onClick={addToCart}
              >
                {t('update')}
              </AppButton>
            </div>
          </Col>
        </Row>

      </div>
    </Form>
  );


}
export default Form.create({name: "addToCart"})(AddToCart);
