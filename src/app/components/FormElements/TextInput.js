import React from "react";
import PropTypes from "prop-types";
import { Input, Form } from "antd";
const TextInput = ({
  form,
  name,
  label,
  required,
  placeholder,
  initialValue,
  formItemLayout,
  max,
  min,
  rows,
  extra,
  help,
  validateStatus,
  hasFeedback,
  error,
  onChange,
  isEmail,
  disabled,
  size,
  prefix,
  suffix,
  className,
  type,
  focused,
  normalLabel,
  visibilityToggle,
  validator
}) => {
  const maxLength = max || (name === "_id" ? 30 : 1000);
  const status = error ? "error" : validateStatus;
  const helpMessage = error || help;
  const email = isEmail
    ? {
        type: "email",
        message: "Please enter a valid email address"
      }
    : {};

  const onFocus = e => {
    const $label = e.target.closest(".ant-form-item-control-wrapper")
      .previousSibling;
    if ($label) {
      $label.classList.add("focused");
      e.target.classList.add("focused");
    }
  };
  const onBlur = e => {
    const $label = e.target.closest(".ant-form-item-control-wrapper")
      .previousSibling;
    const val = e.target.value;
    if (!val && $label) {
      $label.classList.remove("focused");
      e.target.classList.remove("focused");
    }
  };
  return (
    <Form.Item
      label={label}
      className={`${!rows && !normalLabel ? "input-text" : ""} ${
        focused ? "default-focused" : ""
      }`}
      validateStatus={status}
      help={helpMessage}
      extra={extra}
      hasFeedback={hasFeedback}
      {...formItemLayout}
    >
      {form.getFieldDecorator(name, {
        initialValue,
        validateTrigger: false,
        rules: [
          {
            required,
            message: `${label ? label : "Field"} is required`
          },
          {
            max: maxLength,
            message: `${
              label ? "Field" : "Field"
            } cannot exceed ${maxLength} characters`
          },
          {
            min,
            message: `${
              label ? "Field" : "Field"
            } must be at least ${min} characters`
          },
          { ...email },
          { ...validator }
        ]
      })(
        !rows ? (
          type === "password" ? (
            <Input.Password
              placeholder={placeholder}
              maxLength={maxLength}
              className={className}
              onChange={onChange}
              disabled={disabled}
              size={size}
              prefix={prefix}
              type={type}
              onFocus={onFocus}
              onBlur={onBlur}
              visibilityToggle={visibilityToggle}
              suffix={suffix}
            />
          ) : (
            <Input
              placeholder={placeholder}
              maxLength={maxLength}
              className={className}
              onChange={onChange}
              disabled={disabled}
              size={size}
              prefix={prefix}
              type={type}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          )
        ) : (
          <Input.TextArea
            placeholder={placeholder}
            maxLength={maxLength}
            rows={rows}
            onChange={onChange}
            disabled={disabled}
            size={size}
          />
        )
      )}
    </Form.Item>
  );
};

TextInput.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  size: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  help: PropTypes.string,
  extra: PropTypes.string,
  validateStatus: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  whitespace: PropTypes.bool,
  hasFeedback: PropTypes.bool,
  isEmail: PropTypes.bool,
  disabled: PropTypes.bool,
  max: PropTypes.number,
  min: PropTypes.number,
  rows: PropTypes.number,
  formItemLayout: PropTypes.object
};

TextInput.defaultProps = {
  visibilityToggle: true
};
export default TextInput;
