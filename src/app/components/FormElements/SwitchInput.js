import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Form } from 'antd';

const SwitchInput = ({
  form,
  name,
  label,
  required = false,
  initialValue,
  formItemLayout,
  extra,
  help,
  validateStatus,
  hasFeedback,
  error,
}) => {
  const status = error ? 'error' : validateStatus;
  const helpMessage = error || help;

  return (
    <Form.Item
      label={label}
      validateStatus={status}
      help={helpMessage}
      extra={extra}
      hasFeedback={hasFeedback}
      className="switch-input"
      {...formItemLayout}
    >
      {form.getFieldDecorator(name, {
        initialValue,
        valuePropName: 'checked',
        rules: [{ required, message: `${label} is required.` }],
      })(<Switch />)}
    </Form.Item>
  );
};

SwitchInput.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  size: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
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
  formItemLayout: PropTypes.object,
};

export default SwitchInput;
