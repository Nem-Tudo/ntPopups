import React from "react";

/**
 * @param {Object} props
 */
export default function DateInput({ value, ...props }) {
    return <input type="date" value={formatDateToInputDate(value)} {...props} />
}

function formatDateToInputDate(date) {
    date = new Date(date);

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}