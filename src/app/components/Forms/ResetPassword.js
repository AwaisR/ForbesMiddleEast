import React from "react";
import { Form, message } from "antd";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TextInput, SubmitButton } from "@components/FormElements";
import FormTemplate from "@templates/form-modal";
import { apiPost } from "@services";
const Header = ({ t }) => (
  <>
    <h4>{t("resetPassword")}</h4>
    <p>{t("resetPasswordSub")}</p>
  </>
);

const Footer = ({ handleAction, t }) => (
  <>
    <p>
      {t("alreadyHaveAccount")}
      <a onClick={() => handleAction("login")}>{t("login")}</a>
    </p>
  </>
);

const ResetPassword = ({ form, setStatus, history, ...props }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        // console.log(values);
        apiPost(
          "/auth/forgot-password",
          {
            email: values.email,
          },
          (response) => {
            message.success("Success! We sent instructions on your email.");
            // history.push("/");
          },
          (error) => {
            console.log("An error occurred:", error);
            message.error("Something went wrong! Please try again");
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
      header={<Header t={t} />}
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
          <SubmitButton saveLabel={t("sendEmail")} style={{ width: "100%" }} />
        </Form>
      }
      footer={<Footer t={t} handleAction={handleAction} />}
    />
  );
};
export default Form.create({ name: "reset_password_form" })(
  withRouter(ResetPassword)
);
