import React from "react";
import TextInput from "./componentTypes/TextInput.jsx";
import CheckboxInput from "./componentTypes/CheckboxInput.jsx";
import TextareaInput from "./componentTypes/TextareaInput.jsx";
import FileInput from "./componentTypes/FileInput.jsx";

export default function FormComponent({ value, data, onValueChange, isValid, autoFocus }) {
    const renderInput = () => {
        switch (data.type) {
            case 'text':
                return <TextInput autoFocus={autoFocus} value={value} disabled={data.disabled} placeholder={data.placeholder} onChange={e => onValueChange(e.target.value)} valid={String(isValid)} />;
            case 'textarea':
                return <TextareaInput autoFocus={autoFocus} value={value} disabled={data.disabled} placeholder={data.placeholder} onChange={e => onValueChange(e.target.value)} valid={String(isValid)} noresize={String(data.disableResize)} />;
            case 'checkbox':
                return <CheckboxInput autoFocus={autoFocus} checked={value} disabled={data.disabled} onChange={e => onValueChange(e.target.checked)} valid={String(isValid)} />;
            case 'file':
                return <FileInput autoFocus={autoFocus} disabled={data.disabled} onChange={e => onValueChange(e.target.files)} valid={String(isValid)} accept={data.accept} multiple={data.multiple} />;
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