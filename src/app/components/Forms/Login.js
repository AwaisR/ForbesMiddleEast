import React, { useEffect, useState, useRef } from "react";
import { withRouter } from "react-router-dom";
import { Form, message } from "antd";
import { instanceOf } from "prop-types";
import { useTranslation } from "react-i18next";
import { withCookies, Cookies } from "react-cookie";
import ReCAPTCHA from "react-google-recaptcha";

import { TextInput, SubmitButton } from "@components/FormElements";
import FacebookIcon from "@images/social-logos/facebook-colored.svg";
import GoogleIcon from "@images/social-logos/google-colored.svg";
import FormTemplate from "@templates/form-modal";
import { apiPost } from "@services";
import { setUser, setAuthToken } from "@utils";
import config from "@config";

const Header = ({ handleAction, t }) => (
  <>
    <h4>{t("loginToForbes")}</h4>
    <p>
      <a onClick={() => handleAction("register")}>{t("createAccount")}</a>
    </p>
  </>
);

const Footer = ({ t, handleSocialLogin, handleSocialLoginFailure }) => (
  <>
    <p>{t("orCreateWith")}</p>
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

const Login = ({ form, setStatus, history, location, cookies, ...props }) => {
  const [captcha_key, setCaptchaKey] = useState("");
  const [saving, hookSaving] = useState(false);
  const captcha = useRef(null);

  const {
    t,
    i18n: { language },
  } = useTranslation();

  let query = new URLSearchParams(location.search);
  const redirect = query.get("redirect");
  let redirectURL = "/my-account";
  // console.log(redirect);
  if (redirect) {
    // redirectURL = atob(redirect);
    redirectURL = redirect;
  }

  useEffect(() => {
    cookies.set("redirectURL", redirectURL);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        if (!captcha_key) {
          message.error("Invalid captcha key");
          return;
        }
        hookSaving(true);
        apiPost(
          "/auth/local",
          {
            identifier: values.email,
            password: values.password,
            captcha_key,
          },
          (response) => {
            hookSaving(false);
            // console.log(history, location);
            setAuthToken(response.data.jwt);
            setUser(response.data.user);
            window.location.href =
              language === "ar" ? `/ar${redirectURL}` : redirectURL;
            // history.push(language === 'ar' ? `/ar${redirectURL}` : redirectURL);
          },
          (error) => {
            hookSaving(false);
            message.error(t("invalidUserNameAndPassword"));
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
            name="email"
            type="email"
            label={t("emailAddress")}
            isEmail={true}
            required={true}
          />
          <TextInput
            form={form}
            name="password"
            label="Password"
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
          <p style={{ marginTop: 15 }}>
            <a onClick={() => handleAction("reset-password")}>
              {t("forgotPassword")}
            </a>
          </p>
          <SubmitButton saving={saving} saveLabel={t("login")} style={{ width: "100%" }} />
        </Form>
      }
      // footer={null}
      footer={
        <Footer
          t={t}
          handleSocialLogin={() => {}}
          handleSocialLoginFailure={() => {}}
        />
      }
    />
  );
};
Login.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
};
export default Form.create({ name: "login_form" })(
  withRouter(withCookies(Login))
);
