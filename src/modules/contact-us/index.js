import React, {useRef, useState} from "react";
import {Form, Row, Col, Modal, message} from "antd";
import { useTranslation } from "react-i18next";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import { SelectInput, TextInput, SubmitButton } from "@components/FormElements";
import ReCAPTCHA from "react-google-recaptcha";
import config from "@config";
import { InfoBox, Map } from "./views";
import style from "./styles.scss";
import { apiPost } from "@services";

const ContactUs = ({ form }) => {
  const {
    t,
    i18n: { language }
  } = useTranslation();

  const [captcha_key, setCaptchaKey] = useState("");
  const captcha = useRef(null);

  const isEnglish = language !== "ar";
  const handleSubmit = e => {
    e.preventDefault();

    form.validateFields((errors, values) => {
      if (!errors) {
        if (!captcha_key) {
          message.error("Invalid captcha key");
          return;
        }
        values.captcha_key = captcha_key;
        apiPost(
          "/contactforms",
          values,
          (response) => {
            Modal.success({
              centered: true,
              title: t("success"),
              content: t("contactSuccess")
            });
          },
          (error) => {
            message.error(t("contactError"));
            captcha.current.reset();
            setCaptchaKey("");
          }
        );

      }
    });
  };

  return (
    <Container className={style.container}>
      <Breadcrumbs
        trail={[
          {
            title: "Forbes",
            slug: "/"
          },
          {
            title: "Contact Us",
            slug: "/contact-us"
          }
        ]}
      />
      <h1 className={`${style.h1} h2`}>Contact Us</h1>
      <Row gutter={25}>
        <Col
          md={{
            span: 7,
            offset: isEnglish ? 0 : 3
          }}
        >
          <Form onSubmit={handleSubmit} className={style.form}>
            <SelectInput
              form={form}
              name="topic"
              required={true}
              list={[
                {
                  val: "Enquiry"
                },
                {
                  val: "Concern"
                }
              ]}
              placeholder="Choose a topic"
            />
            <TextInput
              form={form}
              name="fullName"
              label="Full Name"
              required={true}
            />
            <TextInput
              form={form}
              name="email"
              type="email"
              label="Email Address"
              isEmail={true}
              required={true}
            />
            <TextInput
              form={form}
              name="phoneNumber"
              label="Your phone"
              required={true}
            />
            <TextInput
              form={form}
              name="message"
              label="Your Message"
              required={true}
            />
            <Form.Item>
              <ReCAPTCHA
                ref={captcha}
                sitekey={config.GOOGLE_CAPTCHA_KEY}
                onChange={(captcha_key) => setCaptchaKey(captcha_key)}
              />
            </Form.Item>
            <SubmitButton
              saveLabel="Send"
              style={{ width: "100%", height: 35 }}
            />
          </Form>
          <InfoBox />
        </Col>
        <Col md={{ span: 11, offset: 3 }}>
          <Map />
        </Col>
      </Row>
    </Container>
  );
};

export default Form.create({ name: "contact_us" })(ContactUs);
