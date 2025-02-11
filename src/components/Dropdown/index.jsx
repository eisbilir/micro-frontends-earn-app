/**
 * Dropdown component.
 */
import React, { useState, useRef, useEffect } from "react";
import PT from "prop-types";
import _ from "lodash";
import ReactSelect from "react-select";
import "./styles.scss";
import iconDown from "assets/icons/dropdown-arrow.png";

function Dropdown({
  options,
  label,
  required,
  placeholder,
  onChange,
  errorMsg,
  size,
}) {
  const [internalOptions, setInternalOptions] = useState(options);
  const selectedOption = _.find(internalOptions, { selected: true });
  const [focused, setFocused] = useState(false);
  const delayedOnChange = useRef(
    _.debounce((q, cb) => cb(q), process.env.GUIKIT.DEBOUNCE_ON_CHANGE_TIME) // eslint-disable-line no-undef
  ).current;
  const sizeStyle = size === "lg" ? "lgSize" : "xsSize";
  useEffect(() => {
    setInternalOptions(options);
  }, [options]);
  return (
    <div
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
      className="dropdownContainer"
      styleName={`container ${sizeStyle} ${selectedOption ? "haveValue" : ""} ${
        errorMsg ? "haveError" : ""
      } ${focused ? "isFocused" : ""}`}
    >
      <div styleName="relative">
        <ReactSelect
          autosize={false}
          autoBlur
          options={internalOptions.map((o) => ({
            value: o.label,
            label: o.label,
          }))}
          value={selectedOption ? selectedOption.label : null}
          onChange={(value) => {
            if (value) {
              const newOptions = internalOptions.map((o) => ({
                selected: value.label === o.label,
                label: o.label,
              }));
              setInternalOptions(newOptions);
              delayedOnChange(_.cloneDeep(newOptions), onChange);
            }
          }}
          placeholder={`${placeholder}${placeholder && required ? " *" : ""}`}
          clearable={false}
        />
        <img
          width="15"
          height="9"
          styleName="iconDropdown"
          src={iconDown}
          alt="dropdown-arraow-icon"
        />
      </div>
      {label ? (
        <span styleName="label" className="dropdownLabel">
          {label}
          {required ? <span>&nbsp;*</span> : null}
        </span>
      ) : null}
      {errorMsg ? <span styleName="errorMessage">{errorMsg}</span> : null}
    </div>
  );
}

Dropdown.defaultProps = {
  placeholder: "",
  label: "",
  required: false,
  onChange: () => {},
  errorMsg: "",
  size: "lg",
};

Dropdown.propTypes = {
  options: PT.arrayOf(
    PT.shape({
      label: PT.string.isRequired,
      selected: PT.bool.isRequired,
    })
  ).isRequired,
  placeholder: PT.string,
  label: PT.string,
  required: PT.bool,
  onChange: PT.func,
  errorMsg: PT.string,
  size: PT.oneOf(["xs", "lg"]),
};

export default Dropdown;
