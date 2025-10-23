import React from "react";

/**
 * @param {Object} props
 */
export default function SelectInput({label, options, ...props}) {
    return <select {...props} >
        <option value="">{label}</option>
        {
            options && options.map((option, index) => {
                if (typeof option === 'object') {
                    return <option key={index} value={option.value}>{option.label}</option>
                } else {
                    return <option key={index} value={option}>{option}</option>
                }
            })
        }
    </select>
}