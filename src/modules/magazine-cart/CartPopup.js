import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Checkbox, Col, Form, Icon, message, Radio, Row, Select} from "antd";
import { getImageUrl } from "@utils";
import { apiPostAuthFormData } from "@services";
import AppButton from "@components/Button";
import style from "./styles.scss";
import { FLAGS, isUnAvailable} from "./magazineConfig";

const AddToCart = ({form, magazine, history, closePopup, ...props}) => {
  const [quantity, hookQuantity] = useState(1);
  const [type, hookType] = useState('');
  const [price, hookPrice] = useState('');
  const [region, hookRegion] = useState('');
  const [language, hookLanguage] = useState([]);
  const [subscriptionType, hookSubscriptionType] = useState('');
  const regionPrices = magazine.prices ? Object.values(magazine.prices) : [];
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
    const newQuantity = magazine.free ? 1 : quantity + 1;
    if(type === 'D'){
      hookQuantity(1);
    }else{
      hookQuantity(newQuantity);
    }
  };

  const handleQuantityMinus = () => {
    const newQuantity = magazine.free ? 1 : quantity <= 1 ? 1 : quantity - 1;
    if(type === 'D'){
      hookQuantity(1);
    }else{
      hookQuantity(newQuantity);
    }
  };

  const setType = (type) => {
    hookType(type);
    if(type === 'D')
      hookQuantity(1);
  }
  const setRegion = (index) => {
    hookRegion(regionPrices[index]);
  }
  const setLanguage = (lang) => {
    hookLanguage(lang);
  }

  const calculatePrice = () => {
    if(!(region && type && language && language.length > 0)) return;

    let p = 0;

    if (type === 'D' && language.length === 2 && (Number(region.dSubsEnAr) || Number(region.dSingleEnAr))) {
      p = magazine.subscription ? Number(region.dSubsEnAr) : Number(region.dSingleEnAr);
      p = quantity * p;
      hookSubscriptionType(magazine.subscription ? FLAGS.DIGITAL.SUB.ENAR : FLAGS.DIGITAL.SINGLE.ENAR);
      return p
    }

    if (type === 'P' && language.length === 2 && (Number(region.pSubsEnAr) || Number(region.pSingleEnAr))) {
      p = magazine.subscription ? Number(region.pSubsEnAr) : Number(region.pSingleEnAr);
      p = quantity * p;
      hookSubscriptionType(magazine.subscription ? FLAGS.PRINT.SUB.ENAR : FLAGS.PRINT.SINGLE.ENAR);
      return p
    }

    let subType = '';
    language.forEach((lang) => {
      if(magazine.subscription){
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

    if(language.length === 2) {
      if(type === 'D'){
        subType = (magazine.subscription ? FLAGS.DIGITAL.SUB.ENAR : FLAGS.DIGITAL.SINGLE.ENAR);
      }else {
        subType = (magazine.subscription ? FLAGS.PRINT.SUB.ENAR : FLAGS.PRINT.SINGLE.ENAR);
      }
    }

    hookSubscriptionType(subType);
    p = quantity * p;
    return p;
  }

  useEffect(() => {
    hookPrice(calculatePrice());
  }, [quantity, region, language, type])

  const addToCart = (goToCart) => {
    apiPostAuthFormData(
      "/add-to-cart",
      {
        magazine: magazine.id,
        region: region.name,
        subscriptionType,
        quantity
      },
      (response) => {
        message.success("Added to cart!");
        if(goToCart){
          history.push(
            isEnglish
              ? "/magazines/cart"
              : "/ar/magazines/cart"
          );
        }
        closePopup();
      },
      (error) => {
        console.log("An error occurred:", error);
        message.error("Something went wrong! Please try again");
      }
    );
  }


  const disableDigital = isUnAvailable(region, 'D');
  const disablePrint = isUnAvailable(region, 'P');

  return (
    <Form>
      <div className={style.form}>
        <Row>
          <Col span={6}>
            <div className={style.wrap_title}>
              <h1>
                {magazine.name}
              </h1>
              <img src={getImageUrl(magazine.featuredImage)}/>
            </div>
          </Col>
        </Row>
        <Row type="flex"
             align="bottom"
             gutter={25}
             className={style.form__header}>
          <Col span={6}>
            <h6>{t("region")}</h6>
          </Col>
          <Col span={4}>
            <h6>{t("type")}</h6>
          </Col>
          <Col span={4}>
            <h6>{t("language")}</h6>
          </Col>
          <Col span={6}>
            <h6>{t("quantity")}</h6>
          </Col>
          <Col span={4}>
            <h6>{t("price")}</h6>
          </Col>
        </Row>
        <Row gutter={25}>
          <Col
            className={`${style.table__column} ${!isEnglish ? style.table__column__ar : ''}` }
            xs={24}
            sm={12}
            md={8}
            lg={6}>
            <label>{t("region")}</label>
            <Select
              suffixIcon={<Icon type="caret-down"/>}
              style={{minWidth: "100%"}}
              placeholder={t("selectRegion")}
              onChange={setRegion}
            >
              {regionPrices && regionPrices.map((price, index) => (
                <Select.Option key={index}>
                  {price.name.charAt(0).toUpperCase() + price.name.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col
            className={`${style.table__column} ${!isEnglish ? style.table__column__ar : ''}` }
            xs={24}
            sm={12}
            md={8}
            lg={4}
          >
            <label>{t("type")}</label>
            <Radio.Group onChange={(e) => setType(e.target.value)}>
              <Radio disabled={disableDigital} value="D">{t("digital")}</Radio>
              <Radio disabled={magazine.free || disablePrint} value="P">{t("hardCopy")}</Radio>
            </Radio.Group>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={4}
            className={`ant-form-item switch-input no-border ${style.table__column} ${!isEnglish ? style.table__column__ar : ''}`}
          >
            <label>{t("language")}</label>
            <Checkbox.Group
              onChange={setLanguage}
              options={[
                {label: t("english"), value: "en"},
                {label: t("arabic"), value: "ar"},
              ]}
            />
          </Col>
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
            lg={4}
          >
            <label>{t("price")}</label>
            <div className={style.price__container}>
                  { price && magazine && magazine.discount ? (
                      <span className={style.price}>
                        <span className={style.price__cut}>${price}</span> {' $'}{getDiscountPrice(price, quantity, magazine.discount)}
                      </span>
                    ) : (
                      <span className={`${style.price} ${magazine.free ? style.price__free : ''}`}>
                        {price ? `${price}` : "-"}
                      </span>
                    )
                  }
                  {price && magazine.free ? <span className={style.price}>{t('FREE')}</span> : null}
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
                onClick={() => { addToCart(true)}}
              >
                {magazine.subscription ? t('subscribeNow') : t("goToCart")}
              </AppButton>
              {
                magazine.subscription ? null : (
                  <AppButton
                    type="primary"
                    size="small"
                    style={{
                      width: "auto",
                    }}
                    onClick={() => { addToCart(false)}}
                  >
                    {t("addToCart")}
                  </AppButton>
                )
              }
            </div>
          </Col>
        </Row>

      </div>
    </Form>
  );


}
export default Form.create({name: "addToCart"})(AddToCart);
