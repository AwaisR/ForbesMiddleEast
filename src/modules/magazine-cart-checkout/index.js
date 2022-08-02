import React, { useEffect, useState } from "react";
import { Row, Col, Form, message, Input } from "antd";
import { useTranslation } from "react-i18next";

import { TextInput, SelectInput } from "@components/FormElements";
import Button from "@components/Button";
import Container from "@components/Container";
import Layout from "@components/Layout";
import Breadcrumbs from "@components/Breadcrumbs";

import {
  getUser,
  getUserShippingAddress,
  setPaymentReference,
  getPaymentReference,
  isLoggedIn,
} from "@utils";
import style from "./styles.scss";
import success from "../../resources/images/checked.svg";
import error from "../../resources/images/failed.svg";
import { apiPostAuth, apiPutAuth, apiGetAuth } from "@services";
import countryList, { phoneCodeList } from "../../libs/country";

const Checkout = ({ form, history, location }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const isEnglish = language !== "ar";
  const [order, hookOrder] = useState(null);
  const [userAddressData, hookUserAddressData] = useState({});
  const [user, hookUser] = useState({});
  let query = new URLSearchParams(location.search);
  const paymentStatus = query.get("response_code");
  const pid = query.get("pt_invoice_id");
  const resultText = query.get("result");
  const pidLocal = getPaymentReference();

  useEffect(() => {
    const userData = getUser();
    const userAddress =
      userData && userData.useraddresses
        ? getUserShippingAddress(userData.useraddresses)
        : {};
    hookUser(userData);
    hookUserAddressData(userAddress);
  }, []);

  const getOrder = () => {
    apiGetAuth(
      "/get-cart",
      (response) => {
        hookOrder(response.data);
      },
      (error) => {
        console.log("An error occurred:", error);
        history.push(isEnglish ? "/magazines/cart" : "/ar/magazines/cart");
      }
    );
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      history.push("/login");
      return null;
    }
    if (!(paymentStatus || pid)) {
      getOrder();
    }
  }, []);

  const getDiscountPrice = (price, qty, discount) => {
    const p = Number(price) * parseInt(qty);
    const d = Number(discount) * parseInt(qty);
    if (p > d) {
      return p - d;
    }
    return p;
  };

  const goToCheckout = () => {
    if (isEnglish) {
      history.push("/magazines/cart/checkout");
    } else {
      history.push("/ar/magazines/cart/checkout");
    }
  };
  const goToMyOrders = () => {
    if (isEnglish) {
      history.push("/my-account/orders");
    } else {
      history.push("/ar/my-account/orders");
    }
  };

  const handleAddress = (data, cb) => {
    const resp = (response) => {
      cb && cb();
    };

    const err = (error) => {
      const err = error.response.data.message[0];
      message.error(err.messages[0].message);
    };

    if (userAddressData.isShipping && userAddressData.address) {
      apiPutAuth(
        `/useraddresses/${userAddressData.address.id}`,
        data,
        resp,
        err
      );
    } else {
      apiPostAuth("/useraddresses", data, resp, err);
    }
  };

  const payment = () => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const addressData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phone,
        countryCode: values.countryCode,
        country: values.country,
        address: values.address,
        state: values.state,
        city: values.city,
        postalCode: values.postalCode,
        user: user ? user.id : null,
        isShipping: true,
        isBilling: true,
        isActive: true,
      };

      handleAddress(addressData, () => {
        if (!order) return;
        apiPostAuth(
          "/pay_tabs/create_pay_page",
          {
            orderId: order ? order.id : 0,
          },
          (res) => {
            setPaymentReference(res.data.p_id);
            window.location.href = res.data.payment_url;
          },
          (err) => {
            console.log(err);
            message.error("Something went wrong! please try again");
          }
        );
      });
    });
  };

  if (paymentStatus && pidLocal && pid) {
    if (paymentStatus == "100" && pid === pidLocal) {
      return (
        <Layout header={false}>
          <Container className={style.container}>
            <img src={success} alt="Success" />
            <h1 className="h2">Payment success</h1>
            <h1 className="h2">{resultText}</h1>
            <Button
              type={"primary"}
              onClick={goToMyOrders}
              className={style.payment_step_btn}
            >
              View My Orders & Subscriptions
            </Button>
          </Container>
        </Layout>
      );
    }

    if (paymentStatus != "100" && pid === pidLocal) {
      return (
        <Layout header={false}>
          <Container className={style.container}>
            <img src={error} alt="Error" />
            <h1 className="h2">Payment failed</h1>
            <h2>
              {resultText ||
                "Payment was declined by your bank or credit card provider"}
            </h2>
            <Button
              type={"primary"}
              onClick={goToCheckout}
              className={style.payment_step_btn}
            >
              Change payment method
            </Button>
          </Container>
        </Layout>
      );
    }
  }

  const { address } = userAddressData;

  return (
    <Container className={style.containerPad}>
      <Breadcrumbs
        trail={[
          {
            title: t("forbes"),
            slug: "/",
          },
          {
            title: t("magazines"),
            slug: `${isEnglish ? "" : "/ar"}/magazines`,
          },
          {
            title: t("checkout"),
          },
        ]}
      />
      <div className={style.attendbar}>
        <Container>
          <Row gutter={25} type="flex" align="middle">
            <Col sm={12} md={6}>
              <div className={style.total}>
                <span>{t("total")}</span>
                <h6>
                  {order && order.total ? (
                    <>
                      {order && order.discount > 0 ? (
                        <span className={style.strikeit}>${order.total}</span>
                      ) : (
                        ""
                      )}
                      ${getDiscountPrice(order.total, 1, order.discount)}
                    </>
                  ) : (
                    0
                  )}{" "}
                  USD
                </h6>
              </div>
            </Col>
            <Col sm={12} md={14}>
              {/*<div className={style.discount}>*/}
              {/*  <input type="text" placeholder="Coupon Code" />*/}
              {/*  <Button*/}
              {/*    onClick={}*/}
              {/*    type="secondary"*/}
              {/*    size="small"*/}
              {/*    style={{*/}
              {/*      width: 85*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    Apply*/}
              {/*  </Button>*/}
              {/*</div>*/}
            </Col>
            <Col sm={24} md={4}>
              <Button
                onClick={payment}
                type="primary"
                size="small"
                style={{
                  width: 130,
                }}
              >
                {t("purchase")}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      <h1 className={`h4 ${style.h1}`}>
        {t("checkout")} : Order #{order ? order.id : "-"}
      </h1>
      <Row gutter={25} align="middle" justify="center" type="flex">
        <Col md={12}>
          <Form className={style.form}>
            <TextInput
              form={form}
              name="firstName"
              label={t("firstName")}
              required={true}
              initialValue={user && user.firstName}
              focused={user && user.firstName}
            />
            <TextInput
              form={form}
              name="lastName"
              label={t("lastName")}
              required={true}
              initialValue={user && user.lastName}
              focused={user && user.lastName}
            />
            <TextInput
              form={form}
              name="email"
              type="email"
              label={t("emailAddress")}
              isEmail={true}
              required={true}
              initialValue={user && user.email}
              focused={user && user.email}
            />

            <div>
              <label>Phone</label>
              <Input.Group compact>
                <SelectInput
                  form={form}
                  style={{ width: 82 }}
                  name="countryCode"
                  list={phoneCodeList}
                  optionLabelProp={"value"}
                  dropdownMatchSelectWidth={false}
                  placeholder={"+971"}
                  optionFilterProp="value"
                  required={true}
                  showSearch={true}
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  initialValue={address && address.countryCode}
                />
                <TextInput
                  form={form}
                  name="phone"
                  placeholder="Phone"
                  initialValue={address && address.phoneNumber}
                  required={true}
                />
              </Input.Group>
            </div>

            <TextInput
              form={form}
              name="address"
              label="Shipping Address"
              required={true}
              initialValue={address && address.address}
              focused={address && address.address}
            />
            <TextInput
              form={form}
              name="city"
              required={true}
              label={t("city")}
              initialValue={address && address.city}
              focused={address && address.city}
            />
            <TextInput
              form={form}
              name="state"
              label={t("state")}
              required={true}
              initialValue={address && address.state}
              focused={address && address.state}
            />
            <SelectInput
              form={form}
              name="country"
              required={true}
              list={countryList}
              label={t("country")}
              showSearch={true}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              initialValue={address && address.country}
              focused={address && address.country}
            />
            <TextInput
              form={form}
              name="postalCode"
              label={t("zipCode")}
              initialValue={address && address.postalCode}
              focused={address && address.postalCode}
              required={true}
            />
          </Form>
        </Col>

        <Col md={12}>
          <h6 className={style.h6}>
            Please check your shipping address before placing your order.
          </h6>
        </Col>
      </Row>
    </Container>
  );
};

export default Form.create({ name: "checkout" })(Checkout);
