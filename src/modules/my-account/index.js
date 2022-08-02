import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

import {
  Row,
  Col,
  Form,
  Input,
  Upload,
  Avatar,
  Icon,
  Button,
  message,
} from "antd";
import {
  TextInput,
  SubmitButton,
  SelectInput,
  SwitchInput,
  CheckInput,
} from "@components/FormElements";
import Container from "@components/Container";
import Breadcrumbs from "@components/Breadcrumbs";
import { apiPostAuth, apiPutAuth } from "@services";
import {
  getUser,
  setUser,
  isLoggedIn,
  getImageUrl,
  generateAvatarFromString,
} from "@utils";
import countryList, { phoneCodeList } from "../../libs/country";
import style from "./styles.scss";

const ChangePasswordForm = withTranslation()(
  Form.create({
    name: "change_password_form",
  })(({ form, t }) => {
    const handleChangePassword = (e) => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          apiPostAuth(
            "/auth/change-password",
            {
              password: values.password,
              passwordConfirmation: values.passwordConfirmation,
            },
            (response) => {
              form.resetFields();
              message.success("password changed successfully!");
            },
            (error) => {
              const err = error.response.data.message[0];
              message.error(err.messages[0].message);
            }
          );
        }
      });
    };
    return (
      <Form onSubmit={handleChangePassword}>
        <TextInput
          form={form}
          name="password"
          label={t("password")}
          required={true}
          type={"password"}
        />
        <TextInput
          form={form}
          name="passwordConfirmation"
          label="Confirm Password"
          required={true}
          type={"password"}
        />
        <div className="align-right">
          <SubmitButton
            type="secondary"
            saveLabel={t("changePasswordButton")}
            className={style.button__changepassword}
          />
        </div>
      </Form>
    );
  })
);

class MyAccount extends React.Component {
  constructor(props) {
    super(props);
    this.isEnglish = this.props.i18n.language !== "ar";
    this.state = {
      user: getUser(),
      saving: false
    };
    if (!isLoggedIn()) {
      props.history.push("/");
    }
  }

  handleSave = (userAddressId) => {
    const { user } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({saving: true});
        const addressData = {
          firstName: values.firstName,
          lastName: values.lastName,
          countryCode: values.countryCode,
          country: values.country,
          phoneNumber: values.phone,
          address: values.address,
          state: values.state,
          city: values.city,
          postalCode: values.postalCode,
          user: user.id,
          isBilling: true,
          isActive: true,
        };
        this.handleAddress(userAddressId, addressData, () => {
          this.handleUserUpdates(user.id, values);
        });
      }
    });
  };

  handleUpload = () => {
    const { file, user } = this.state;

    this.setState({
      uploading: true,
      fileList: [file],
    });
    if (file) {
      let formData = new FormData();
      formData.append("files", file);
      message.info("Your profile picture is being uploaded!");
      apiPostAuth("/upload", formData, (results) => {
        let result = results.data[0];
        const url = getImageUrl(result.url);
        this.handleProfilePicUpdate(user.id, url);
      });
    }
  };

  handleProfilePicUpdate = (id, url) => {
    apiPutAuth(
      `/users/${id}`,
      {
        userAvatar: url,
      },
      (response) => {
        setUser(response.data);
        this.setState(
          {
            user: response.data,
            file: null,
            uploading: false,
          },
          () => {
            message.success("user profile picture updated successfully!");
          }
        );
      },
      (error) => {
        const err = error.response.data.message[0];
        message.error(err.messages[0].message);
      }
    );
  };

  handleUserUpdates = (id, values) => {
    apiPutAuth(
      `/users/${id}`,
      {
        firstName: values.firstName,
        lastName: values.lastName,
        pushNotification: values.pushNotification,
        brandvoiceNotification: values.brandvoiceNotification,
        listUpdates: values.listUpdates,
        newIssue: values.newIssue,
      },
      (response) => {
        setUser(response.data);
        this.setState(
          {
            user: response.data,
            saving: false
          },
          () => {
            message.success("User details updated successfully!");
          }
        );
      },
      (error) => {
        this.setState({saving: false});
        const err = error.response.data.message[0];
        message.error(err.messages[0].message);
      }
    );
  };

  handleAddress = (id, data, cb) => {
    const resp = (response) => {
      // message.success("user address updated successfully!");
      cb && cb();
    };

    const err = (error) => {
      const err = error.response.data.message[0];
      message.error(err.messages[0].message);
      this.setState({saving: false});
    };

    if (id) {
      apiPutAuth(`/useraddresses/${id}`, data, resp, err);
    } else {
      apiPostAuth("/useraddresses", data, resp, err);
    }
  };

  getAddress = () => {
    const { user } = this.state;
    let useraddresses = [];
    let useraddress = {};
    if (user && user.useraddresses) {
      useraddresses = user.useraddresses;
      useraddress = useraddresses[0];
    }
    return useraddress;
  };

  render() {
    const { form, t } = this.props;
    const { user, saving } = this.state;
    const useraddress = this.getAddress();
    let userAddressId = 0;
    if (useraddress && useraddress.id) {
      userAddressId = useraddress.id;
    }

    const uploadProps = {
      onRemove: (file) => {
        this.setState({
          file: null,
        });
      },
      beforeUpload: (file) => {
        this.setState({
          file: file,
        });
        setTimeout(() => {
          this.handleUpload();
        }, 0);
        return false;
      },
    };

    return (
      <Container className={style.container}>
        <Breadcrumbs
          trail={[
            {
              title: t("forbes"),
              slug: "/",
            },
            {
              title: t("account"),
              slug: `${this.isEnglish ? "" : "/ar"}/my-account`,
            },
          ]}
        />
        <h1 className="h4">{t("account")}</h1>
        <Form>
          <Row gutter={25} type="flex">
            <Col md={24} lg={2}>
              <div>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  {...uploadProps}
                >
                  <Icon
                    type="camera"
                    theme="filled"
                    className={style.avatar__camera}
                  />
                  <Avatar
                    className={style.avatar_profile}
                    size={80}
                    shape={"circle"}
                    src={user && user.userAvatar ? user.userAvatar : null}
                  >
                    {generateAvatarFromString(
                      `${user && user.firstName} ${user && user.lastName}`
                    )}
                  </Avatar>
                </Upload>
              </div>
            </Col>
            <Col md={24} lg={8}>
              <p className="tk-bold">{t("changeInfo")}</p>
              <TextInput
                form={form}
                name="firstName"
                label={t("firstName")}
                required={true}
                initialValue={user && user.firstName}
                focused={true}
              />
              <TextInput
                form={form}
                name="lastName"
                label={t("lastName")}
                required={true}
                initialValue={user && user.lastName}
                focused={true}
              />
              <TextInput
                disabled={true}
                form={form}
                name="email"
                type="email"
                label={t("emailAddress")}
                isEmail={true}
                required={true}
                initialValue={user && user.email}
                focused={true}
              />
            </Col>
            {user && user.provider === "local" ? (
              <Col md={24} lg={8}>
                <div className={style.wrap}>
                  <p className="tk-bold">{t("changePassword")}</p>
                  <ChangePasswordForm />
                </div>
              </Col>
            ) : null}
            <Col md={24} lg={6} className={style.subscription}>
              <p className="tk-bold">{t("subscriptionsOrders")}</p>
              <p>{t("subscriptionsDesc")}</p>
              <Link
                to={`${this.isEnglish ? "" : "/ar"}/my-account/orders`}
                className="link-with-arrow"
              >
                {t("manage")}
              </Link>
            </Col>
          </Row>
          <Row gutter={25} type="flex" className={style.row__second}>
            <Col md={24} lg={2} />
            <Col md={24} lg={8}>
              <p className="tk-bold">{t("addressOptional")}</p>
              <SelectInput
                form={form}
                name="country"
                list={countryList}
                placeholder={t("country")}
                showSearch={true}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                initialValue={useraddress && useraddress.country}
              />

              <Input.Group compact>
                <SelectInput
                  form={form}
                  style={{ width: 92 }}
                  name="countryCode"
                  list={phoneCodeList}
                  optionLabelProp={"value"}
                  dropdownMatchSelectWidth={false}
                  placeholder={"+971"}
                  showSearch={true}
                  optionFilterProp="value"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  initialValue={useraddress && useraddress.countryCode}
                />
                <TextInput
                  form={form}
                  name="phone"
                  placeholder="Phone"
                  initialValue={useraddress && useraddress.phoneNumber}
                />
              </Input.Group>

              <TextInput
                form={form}
                name="address"
                placeholder={t("addressOptional")}
                initialValue={useraddress && useraddress.address}
              />
              <TextInput
                form={form}
                name="city"
                placeholder={t("city")}
                initialValue={useraddress && useraddress.city}
              />
              <TextInput
                form={form}
                name="state"
                placeholder={t("state")}
                initialValue={useraddress && useraddress.state}
              />
              <TextInput
                form={form}
                name="postalCode"
                placeholder={t("postalCode")}
                initialValue={useraddress && useraddress.postalCode}
              />
            </Col>
            {/* <Col md={24} lg={8}>
              <div className={style.wrap}>
                <p className="tk-bold">Notifications</p>
                <SwitchInput
                  form={form}
                  name="pushNotification"
                  label="Push Notifications"
                  initialValue={user.pushNotification}
                />
                <CheckInput
                  form={form}
                  name="brandvoiceNotification"
                  label="Brandvoice"
                  initialValue={user.brandvoiceNotification}
                />
                <CheckInput
                  form={form}
                  name="listUpdates"
                  label="List Updates"
                  initialValue={user.listUpdates}
                />
                <CheckInput
                  form={form}
                  name="newIssue"
                  label="New Issue"
                  initialValue={user.newIssue}
                />
              </div>
            </Col> */}
          </Row>
          <Row>
            <Col span={24} className="align-right">
              <Form.Item>
                <Button
                  loading={saving}
                  type={"primary"}
                  onClick={() => {
                    this.handleSave(userAddressId);
                  }}
                  className={style.button__save}
                >
                  {t("save")}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}

export default withTranslation()(
  Form.create({ name: "profile_form" })(MyAccount)
);
