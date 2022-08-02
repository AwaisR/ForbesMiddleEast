import React from "react";
import PropTypes from "prop-types";
import { Form, Button } from "antd";

const SaveButton = ({
  type,
  saveLabel,
  saving,
  savingLabel,
  disabled,
  size,
  style,
  icon,
  className,
  label
}) => (
  <Form.Item label={label}>
    <Button
      type={type}
      htmlType="submit"
      icon={icon}
      disabled={disabled}
      style={style}
      loading={saving}
      size={size}
      className={className}
    >
      {saving ? savingLabel : saveLabel || "Save"}
    </Button>
  </Form.Item>
);

SaveButton.propTypes = {
  cancelLink: PropTypes.string,
  span: PropTypes.number,
  offset: PropTypes.number,
  cancelLabel: PropTypes.string,
  saving: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  icon: PropTypes.string
};

SaveButton.defaultProps = {
  type: "primary"
};
export default SaveButton;
