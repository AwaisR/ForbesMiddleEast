import React from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";

import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import OrderList  from "./orderlist";
import SubscriptionList  from "./subscriptionlist";
import style from "./styles.scss";

const MyAccount = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const isEnglish = language !== "ar";
  return (
    <Container className={style.container}>
      <Breadcrumbs
        trail={[
          {
            title: t("forbes"),
            slug: isEnglish ? "/" : "/ar",
          },
          {
            title: t("account"),
            slug: `${isEnglish ? "" : "/ar"}/my-account`,
          },
          {
            title: t("orders"),
            slug: `${isEnglish ? "" : "/ar"}/my-account/orders`,
          },
        ]}
      />
      <div className={style.orders}>
        <div className={style.header}>
          <h2 className="h4">{t("orders")}</h2>
        </div>
        <OrderList />
        <p/>
        <p/>
        <div className={style.header}>
          <h2 className="h4">{t("subscriptions")}</h2>
        </div>
        <SubscriptionList/>
      </div>
    </Container>
  );
};

export default MyAccount;
