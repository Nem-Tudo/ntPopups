import React from "react";
import TextInput from "./componentTypes/TextInput.jsx";
import CheckboxInput from "./componentTypes/CheckboxInput.jsx";
import TextareaInput from "./componentTypes/TextareaInput.jsx";
import FileInput from "./componentTypes/FileInput.jsx";
import RadioInput from "./componentTypes/RadioInput.jsx";
import DateInput from "./componentTypes/DateInput.jsx";
import EmailInput from "./componentTypes/EmailInput.jsx";
import NumberInput from "./componentTypes/NumberInput.jsx";
import PasswordInput from "./componentTypes/PasswordInput.jsx";
import SelectInput from "./componentTypes/SelectInput.jsx";
import TimeInput from "./componentTypes/TimeInput.jsx";

import styles from "../../../styles/Form.module.css";

export default function FormComponent({ value, data, onValueChange, isInvalid, autoFocus, translate, id }) {
    const renderInput = () => {
        switch (data.type) {
            case 'checkbox':
                return <CheckboxInput id={id} autoFocus={autoFocus} checked={value} disabled={data.disabled} onChange={e => onValueChange(e.target.checked)} valid={String(isInvalid === null)} />;
            case 'date':
                return <DateInput id={id} autoFocus={autoFocus} value={value} disabled={data.disabled} placeholder={data.placeholder} onChange={e => onValueChange(e.target.value)} valid={String(isInvalid === null)} />;
            case 'email':
                return <EmailInput id={id} autoFocus={autoFocus} value={value} disabled={data.disabled} placeholder={data.placeholder} onChange={e => onValueChange(e.target.value)} valid={String(isInvalid === null)} />;
            case 'file':
                return <FileInput id={id} translate={translate} autoFocus={autoFocus} disabled={data.disabled} placeholder={data.placeholder} onChange={e => onValueChange(e.target.files)} valid={String(isInvalid === null)} accept={data.accept} multiple={data.multiple} />;
            case 'number':
                return <NumberInput id={id} min={data.min || 0} max={data.max} autoFocus={autoFocus} value={value} disabled={data.disabled} placeholder={data.placeholder} onChange={e => onValueChange(e.target.value)} valid={String(isInvalid === null)} />;
            case 'password':
                return <PasswordInput id={id} autoFocus={autoFocus} value={value} disabled={data.disabled} placeholder={data.placeholder} onChange={e => onValueChange(e.target.value)} valid={String(isInvalid === null)} />;
            case 'radio':
                return <RadioInput id={id} options={data.options} value={value} disabled={data.disabled} defaultValue={data.defaultValue} onChange={e => onValueChange(e.target.value)} valid={String(isInvalid === null)} />;
            case 'select':
                return <SelectInput id={id} label={data.label} options={data.options} value={value} disabled={data.disabled} onChange={e => onValueChange(e.target.value)} valid={String(isInvalid === null)} />;
            case 'textarea':
                return <TextareaInput id={id} autoFocus={autoFocus} value={value} disabled={data.disabled} placeholder={data.placeholder} onChange={e => onValueChange(e.target.value)} valid={String(isInvalid === null)} noresize={String(data.disableResize)} />;
            case 'text':
                return <TextInput id={id} autoFocus={autoFocus} value={value} disabled={data.disabled} placeholder={data.placeholder} onChange={e => onValueChange(e.target.value)} valid={String(isInvalid === null)} />;
            case 'time':
                return <TimeInput id={id} autoFocus={autoFocus} value={value} disabled={data.disabled} placeholder={data.placeholder} onChange={e => onValueChange(e.target.value)} valid={String(isInvalid === null)} />;
            default:
                return null;
        }
    };

    return (
        <>
            <span>{data.label}{data.required && <span style={{ color: "var(--ntpopups-color-danger)" }}>*</span>}</span>
            {renderInput()}
            {
                (isInvalid != null) && <span className={`${styles.componentInvalid} ntpopups-form-component-invalid`}>{isInvalid}</span>
            }
        </>
    );
}