import React, { useState, useRef } from "react";

import { Form, message } from "antd";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";

import { TextInput, SubmitButton } from "@components/FormElements";
import FacebookIcon from "@images/social-logos/facebook-colored.svg";
import GoogleIcon from "@images/social-logos/google-colored.svg";
import FormTemplate from "@templates/form-modal";
import { setUser, setAuthToken } from "@utils";
import { apiPost } from "@services";
import config from "@config";

const Header = ({ handleAction, t }) => (
  <>
    <h4>{t("registerAccount")}</h4>
    <p>
      {t("alreadyHaveAccount")}{" "}
      <a onClick={() => handleAction("login")}>{t("login")}</a>
    </p>
  </>
);

const Footer = ({ t }) => (
  <>
    <p>{t("orSignUp")}</p>
    <ul>
      <a href={`${config.BASE_URL}/connect/facebook`} className="link">
        <li>
          <img src={FacebookIcon} />
        </li>
      </a>
      <a href={`${config.BASE_URL}/connect/google`} className="link">
        <li>
          <img src={GoogleIcon} />
        </li>
      </a>
    </ul>
  </>
);

const Register = ({ form, setStatus, history }) => {
  const [captcha_key, setCaptchaKey] = useState("");
  const captcha = useRef(null);
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        if (!captcha_key) {
          message.error("Invalid captcha key");
          return;
        }
        apiPost(
          "/auth/local/register",
          {
            firstName: values.firstName,
            lastName: values.lastName,
            username: `${values.firstName} ${values.lastName}`,
            email: values.email,
            password: values.password,
            captcha_key,
          },
          (response) => {
            setAuthToken(response.data.jwt);
            setUser(response.data.user);
            history.push(language === "ar" ? "/ar" : "/");
          },
          (error) => {
            message.error(error.response.data.message);
            captcha.current.reset();
            setCaptchaKey("");
          }
        );
      }
    });
  };

  const handleAction = (url) => {
    if (setStatus) {
      setStatus(url);
    } else {
      history.push(`${language === "ar" ? "/ar" : ""}/${url}`);
    }
  };

  return (
    <FormTemplate
      header={<Header handleAction={handleAction} t={t} />}
      content={
        <Form onSubmit={handleSubmit}>
          <TextInput
            form={form}
            name="firstName"
            label={t("firstName")}
            required={true}
          />
          <TextInput
            form={form}
            name="lastName"
            label={t("lastName")}
            required={true}
          />
          <TextInput
            form={form}
            name="email"
            type="email"
            label={t("emailAddress")}
            isEmail={true}
            required={true}
          />
          <TextInput
            form={form}
            name="password"
            label={t("password")}
            type="password"
            visibilityToggle={false}
            required={true}
            min={6}
            max={16}
          />
          <ReCAPTCHA
            ref={captcha}
            sitekey={config.GOOGLE_CAPTCHA_KEY}
            onChange={(captcha_key) => setCaptchaKey(captcha_key)}
          />
          <SubmitButton
            saveLabel={t("register")}
            style={{ marginTop: 20, width: "100%" }}
          />
        </Form>
      }
      // footer={null}
      footer={<Footer t={t} />}
    />
  );
};
export default Form.create({ name: "register_form" })(withRouter(Register));
