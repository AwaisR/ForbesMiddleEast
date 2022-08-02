import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Form } from 'antd';

const CheckInput = ({
  form,
  name,
  label,
  labelSpan,
  wrapperSpan,
  extra,
  help,
  validateStatus,
  hasFeedback,
  error,
  initialValue,
  required,
}) => {
  const status = error ? 'error' : validateStatus;
  const helpMessage = error || help;
  return (
    <Form.Item
      colon={false}
      labelCol={{ span: labelSpan || null }}
      wrapperCol={{ span: wrapperSpan || null }}
      validateStatus={status}
      help={helpMessage}
      extra={extra}
      hasFeedback={hasFeedback}
      className="switch-input"
      label={label}
    >
      {form.getFieldDecorator(name, {
        valuePropName: 'checked',
        initialValue,
        rules: [
          {
            required,
            transform: value => value || undefined, // Those two lines
            type: 'boolean', // Do the magic
            message: `${label} is required`,
          },
        ],
      })(<Checkbox />)}
    </Form.Item>
  );
};

CheckInput.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  help: PropTypes.string,
  extra: PropTypes.string,
  initialValue: PropTypes.bool,
  validateStatus: PropTypes.string,
  error: PropTypes.string,
  hasFeedback: PropTypes.bool,
  labelSpan: PropTypes.number,
  wrapperSpan: PropTypes.number,
};

export default CheckInput;
