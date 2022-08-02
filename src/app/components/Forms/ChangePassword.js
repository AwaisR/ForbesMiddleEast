import React, { useEffect, useState } from "react";
import { Form, message } from "antd";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import qs from "querystring";
import { TextInput, SubmitButton } from "@components/FormElements";
import FormTemplate from "@templates/form-modal";
import { apiPost } from "@services";

const Header = ({ t }) => (
  <>
    <h4>{t("changePassword")}</h4>
    <p>{t("enterYourNewPassword")}</p>
  </>
);

const ChangePassword = ({ form, history }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const query = qs.parse(history.location.search.substr(1));
    if (query && !query.token) {
      history.push("/");
    } else {
      setCode(query.token);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        setLoading(true);
        apiPost(
          "/auth/reset-password",
          {
            code,
            password: values.password,
            passwordConfirmation: values.password,
          },
          (response) => {
            message.success("Password successfully changed");
            // history.push("/");
            setLoading(false);
          },
          (error) => {
            console.log("An error occurred:", error);
            message.error("Something went wrong! Please try again");
            setLoading(false);
          }
        );
      }
    });
  };

  return (
    <FormTemplate
      header={<Header t={t} />}
      content={
        <Form onSubmit={handleSubmit}>
          <TextInput
            form={form}
            name="password"
            type="password"
            label={t("enterNewPassword")}
          />
          <SubmitButton
            saveLabel={t("save")}
            style={{ width: "100%" }}
            saving={loading}
          />
        </Form>
      }
      // footer={<Footer handleAction={handleAction} />}
    />
  );
};
export default Form.create({ name: "reset_password_form" })(
  withRouter(ChangePassword)
);
