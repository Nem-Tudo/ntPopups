// ./FormComponent.jsx
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

/**
 * Componente que decide qual input renderizar baseado no 'data.type',
 * incluindo o suporte a componentes customizados.
 *
 * @param {object} props
 * @param {any} props.value - Valor atual do campo.
 * @param {object} props.data - Objeto de configuração do componente.
 * @param {(value: any) => void} props.onValueChange - Callback de mudança de valor.
 * @param {string | null} props.isInvalid - Mensagem de erro se inválido, null se válido.
 * @param {boolean} props.autoFocus - Se deve dar auto-foco.
 * @param {Function} props.translate - Função de tradução.
 * @param {string} props.id - ID do componente.
 * @param {Object.<string, import("../../../utils/types").CustomComponentDefinition>} props.customComponents - Definições de componentes customizados.
 * @returns {React.ReactNode}
 */
export default function FormComponent({ value, data, onValueChange, isInvalid, autoFocus, translate, id, customComponents = {} }) {

    // Checa se é um componente customizado
    const CustomComponentRender = customComponents[data.type]?.render;

    const renderInput = () => {
        if (CustomComponentRender) {
            // RENDERIZA COMPONENTE CUSTOMIZADO
            // Desestrutura 'data' para passar todas as props customizadas
            const {
                type,
                label,
                required,
                // Evita conflitos: emptyValue e validator são internos ao Form.jsx
                emptyValue,
                validator,
                ...rest
            } = data;

            return <CustomComponentRender
                id={id}
                value={value}
                disabled={data.disabled || false}
                required={data.required || false}
                placeholder={data.placeholder || ""}
                changeValue={onValueChange}
                valid={isInvalid === null}
                autoFocus={autoFocus || false}
                data={data} // Passa todos os dados originais
            />;
        }

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
                // Se não é nativo nem customizado, loga erro e retorna null
                console.warn(`Unknown or missing component type: ${data.type} for id: ${id}`);
                return <div style={{ color: "var(--ntpopups-color-danger)" }}>{translate('validation.unknownComponentType')(`[${data.type}]`)}</div>;
        }
    };

    return (
        <>
            <span>
                {data.label}
                {data.required && (
                    <span
                        style={{
                            color: "var(--ntpopups-color-danger)",
                            position: "relative",
                            cursor: "default"
                        }}
                        title={translate('validation.required')(data.label || data.id)}
                        aria-label={translate('validation.required')(data.label || data.id)}
                    >*</span>
                )}
            </span>
            {renderInput()}
            {
                (isInvalid != null && isInvalid != translate('validation.required')(data.label || data.id)) && <span className={`${styles.componentInvalid} ntpopups-form-component-invalid`}>{isInvalid}</span>
            }
        </>
    );
}