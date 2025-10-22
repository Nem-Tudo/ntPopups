import React from "react";
import TextInput from "./componentTypes/TextInput.jsx"; // Adjust the import paths as necessary
import CheckboxInput from "./componentTypes/CheckboxInput.jsx"; // Example for checkbox
import TextareaInput from "./componentTypes/TextareaInput.jsx";

export default function FormComponent({ value, data, onValueChange, isValid, autoFocus }) {
    const renderInput = () => {
        switch (data.type) {
            case 'text':
                return <TextInput autoFocus={autoFocus} value={value} disabled={data.disabled} placeholder={data.placeholder} onChange={e => onValueChange(e.target.value)} valid={String(isValid)} />;
            case 'textarea':
                return <TextareaInput autoFocus={autoFocus} value={value} disabled={data.disabled} placeholder={data.placeholder} onChange={e => onValueChange(e.target.value)} valid={String(isValid)} noresize={String(data.disableResize)} />;
            case 'checkbox':
                return <CheckboxInput autoFocus={autoFocus} checked={value} disabled={data.disabled} onChange={e => onValueChange(e.target.checked)} valid={String(isValid)} />;
            default:
                return null;
        }
    };

    return (
        <>
            <span>{data.label}{data.required && <span style={{ color: "var(--ntpopups-color-danger)" }}>*</span>}</span>
            {renderInput()}
        </>
    );
}