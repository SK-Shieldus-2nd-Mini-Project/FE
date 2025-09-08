import React from "react";

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="input-field">
      <label htmlFor={name}>{label}</label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows="4"
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}

export default InputField;