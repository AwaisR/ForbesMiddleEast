import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Form, Row, Col, Icon, Modal } from "antd";
import _ from "lodash";

import Container from "@components/Container";
import SocialLinks from "@components/SocialLinks";
import MagazineCard from "@components/MagazineCard";
import { TextInput, SubmitButton } from "@components/FormElements";

import Logo from "@images/logo-black.svg";

import {
  setFooterEvents,
  setFooterMagazines,
  setFooterLists
} from "@redux/general-actions";
import client from "@apolloClient";
import {
  allEventsQuery,
  getLatestCategories,
  subscribeNewsletter,
  getFeaturedList
} from "@queries";

import { ArrowSubscribe } from "@icons";
import { extractLanguage } from "@utils";
import EventItem from "./EventItem";
import style from "./styles.scss";
import config from "./config";

const Listing = ({ title, list, language, t, className, lists }) => (
  <>
    <h6 className={style.title}>{title}</h6>
    <ul className={className}>
      {_.map(list, (item, index) => (
        <li key={index} className={style.listing}>
          {item.showNormalLink ? (
            <a href={item.href} target="_blank">
              {t(item.title)}
            </a>
          ) : (
            <Link to={`${language === "ar" ? "/ar" : ""}${item.href}`}>
              {t(item.title)}
            </Link>
          )}
        </li>
      ))}

      {_.map(lists, (item, index) => (
        <li key={index} className={style.listing}>
          <Link to={`${language === "ar" ? "/ar" : ""}/list/${item.slug}`}>
            {t(item.name)}
          </Link>
        </li>
      ))}
    </ul>
  </>
);

const Footer = ({
  footerEvents,
  footerMagazines,
  footerLists,
  setFooterEvents,
  setFooterMagazines,
  setFooterLists,
  headerCategories,
  form,
  ...props
}) => {
  const { t } = useTranslation();
  // const [email, setEmail] = useState("");
  const defaultLang = extractLanguage(props.location.pathname);
  const isEnglish = defaultLang !== "ar";

  useEffect(() => {
    if (!footerEvents.length) {
      getFooterEvents();
    }
    if (!footerMagazines.length) {
      getFooterMagazines();
    }

    if (!footerLists.length) {
      getFooterLists();
    }
  }, []);

  const getFooterLists = async () => {
    const response = await client.query({
      query: getFeaturedList,
      variables: {
        where: {
          language: defaultLang,
          status: "Published"
        },
        limit: 6
      }
    });
    const { lists } = response.data;
    setFooterLists(lists);
  };

  const getFooterEvents = async () => {
    const response = await client.query({
      query: allEventsQuery,
      variables: {
        where: {
          language: defaultLang,
          status: "Published",
          date_gt: moment().toISOString()
        },
        sort: "date:asc",
        limit: 12
      }
    });
    const { events } = response.data;
    setFooterEvents(events);
  };

  const getFooterMagazines = async () => {
    const response = await client.query({
      query: getLatestCategories,
      variables: {
        where: {
          language: defaultLang,
          status: "Published",
          magazinetags: {
            name_in: ["FooterFeatured"]
          }
        }
      }
    });
    const { magazines } = response.data;
    setFooterMagazines(magazines);
  };

  const handleSubmit = e => {
    e.preventDefault();

    form.validateFields((errors, values) => {
      if (!errors) {
        submit(values);
      }
    });
  };

  const submit = async values => {
    const response = await client.mutate({
      mutation: subscribeNewsletter,
      variables: {
        input: {
          data: {
            ...values
          }
        }
      }
    });

    if (response.data) {
      Modal.success({
        centered: true,
        title: t("success"),
        content: t("newsletterSuccess")
      });
    }
  };

  return (
    <div className={style.footer} id="footer">
      <Container medium={true}>
        <Row
          type="flex"
          gutter={25}
          align="middle"
          className={style.footer__top}
        >
          <Col xs={24} sm={24} md={24} lg={24} xl={6}>
            <Link to={`${isEnglish ? "" : "/ar"}`}>
              <img src={Logo} alt="Forbes Middle East" />
            </Link>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={18}>
            <ul className={style.footer__categories}>
              {_.map(config.categories, (category, index) => {
                return (
                  <li key={index}>
                    <Link to={`${isEnglish ? "" : "/ar"}${category.href}`}>
                      {t(category.title)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Col>
        </Row>
        <Row type="flex" gutter={25} className={style.footer__bottom}>
          <Col lg={6}>
            {defaultLang !== "ar" ? (
              <>
                <h6 className={style.title}>{t("events")}</h6>
                <EventItem footerEvents={footerEvents} />
              </>
            ) : null}
            <Listing
              t={t}
              language={defaultLang}
              title={t("newsletter")}
              list={config.newsletters}
            />
            <Listing
              t={t}
              language={defaultLang}
              title={t("products")}
              list={config.products}
            />
          </Col>

          <Col lg={6}>
            <Listing
              t={t}
              language={defaultLang}
              title={t("companyInfo")}
              list={config.staticLinks}
            />
            <Listing
              t={t}
              language={defaultLang}
              title={t("forbesMiddleEastList")}
              list={config.lists}
              lists={footerLists}
            />
          </Col>

          <Col lg={12}>
            {footerMagazines.length ? (
              <>
                <h6 className={style.title}>{t("magazines")}</h6>
                <Row gutter={25} type="flex">
                  {_.map(footerMagazines, (magazine, index) => (
                    <Col sm={8} xs={index === 2 ? 0 : 12} key={index}>
                      <MagazineCard item={magazine} hideTitle={true} />
                    </Col>
                  ))}
                </Row>
              </>
            ) : null}

            <Listing
              t={t}
              language={defaultLang}
              title={t("forbesGlobal")}
              list={config.forbesGlobal}
              className={style.column}
            />

            <Form onSubmit={handleSubmit}>
              <div
                className={`${style.footer__subscribe} ${defaultLang === "ar" &&
                  style.footer__subscribe__ar}`}
              >
                <TextInput
                  form={form}
                  name="email"
                  type="email"
                  placeholder={t("enterEmail")}
                  isEmail={true}
                  required={true}
                />
                <SubmitButton
                  saveLabel={
                    <>
                      {t("subscribe")} <Icon component={ArrowSubscribe} />
                    </>
                  }
                />
              </div>
            </Form>
          </Col>
          <Col
            xs={24}
            sm={12}
            className={`${style.footer__social} ${!isEnglish &&
              style.footer__social__ar}`}
          >
            <SocialLinks dark={true} />
          </Col>
          <Col
            xs={24}
            sm={12}
            className={`${style.footer__copyright} ${!isEnglish &&
              style.footer__copyright__ar}`}
          >
            <p>
              © {moment().format("YYYY")} {t("allRightsReserved")}
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
const mapStateToProps = (state, ownProps) => {
  const {
    footerEvents,
    footerMagazines,
    footerLists,
    headerCategories
  } = state.generalReducer;
  return {
    footerEvents,
    footerMagazines,
    footerLists,
    headerCategories
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { setFooterEvents, setFooterMagazines, setFooterLists },
    dispatch
  );
};

const FormFooter = Form.create({ name: "footer" })(Footer);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FormFooter));
