import React from "react";

/**
 * @param {Object} props
 */
export default function DateInput({ value, ...props }) {
    const finalValue = value ? typeof value === 'string' ? value : formatDateToInputDate(value) : '';
    return <input type="date" value={finalValue} {...props} />
}

function formatDateToInputDate(date) {
    date = new Date(date);

    const year = date.getUTCFullYear();

    const month = String(date.getUTCMonth() + 1).padStart(2, '0');

    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}