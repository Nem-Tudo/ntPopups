import React from "react";

export default function RadioInput(props) {
    const {
        options = [],
        value: selectedValue,
        defaultValue,
        onChange,
        id,
        ...rest
    } = props;

    const isControlled = props.hasOwnProperty("value") && props.value !== undefined;

    return (
        <div>
            {options.map((option, index) => {
                const optValue = typeof option === "object" ? option.value : option;
                const optLabel = typeof option === "object" ? option.label : option;
                const checked = isControlled ? String(selectedValue) === String(optValue) : undefined;
                const defaultChecked =
                    !isControlled && defaultValue !== undefined
                        ? String(defaultValue) === String(optValue)
                        : undefined;

                return (
                    <label key={index} style={{ display: "block" }}>
                        <input
                            id={id + "-" + optValue}
                            type="radio"
                            value={optValue}
                            onChange={onChange}
                            checked={checked}
                            defaultChecked={defaultChecked}
                            {...rest}
                        />
                        <span>{optLabel}</span>
                    </label>
                );
            })}
        </div>
    );
}