import React, { useEffect, useState, useMemo } from "react";
import FormComponent from "./form/FormComponent.jsx";
import updateStateKey from "../../utils/updateStateKey.js"; // Presumindo que este util está disponível

// ---------------------------------------------------------------------
// 🚀 1. Funções de Validação (Curried com translate)
// ---------------------------------------------------------------------


const createValidator = (translate) => {

    /**
     * Verifica a validade de componentes de texto (text/textarea/password).
     * @param {string} value O valor atual do campo.
     * @param {Object} componentData O objeto de configuração do componente.
     * @returns {string | null} Mensagem de erro se inválido, null se válido.
     */
    const validateTextComponent = (value, componentData) => {
        const { required, minLength, maxLength, matchRegex, label } = componentData;
        const fieldName = label || componentData.id;

        const stringValue = String(value || "");

        if (required === true && stringValue.trim().length === 0) {
            return translate('validation.required')(fieldName);
        }

        if (!required && stringValue.trim().length === 0) {
            return null; // Não é obrigatório e está vazio -> Válido
        }

        if (minLength != null && stringValue.length < minLength) {
            return translate('validation.minLength')(fieldName, minLength);
        }

        if (maxLength != null && stringValue.length > maxLength) {
            return translate('validation.maxLength')(fieldName, maxLength);
        }

        if (matchRegex) {
            try {
                const regex = new RegExp(matchRegex);
                if (!regex.test(stringValue)) {
                    return translate('validation.regexMismatch')(fieldName);
                }
            } catch (error) {
                console.error(`Invalid regex for component ${componentData.id}: ${matchRegex}`, error);
                return translate('validation.regexInternalError')(fieldName);
            }
        }

        return null; // Válido
    };

    /**
     * Verifica a validade de componentes de e-mail.
     * @param {string} value O valor atual do campo.
     * @param {Object} componentData O objeto de configuração do componente.
     * @returns {string | null} Mensagem de erro se inválido, null se válido.
     */
    const validateEmailComponent = (value, componentData) => {
        const { required, label } = componentData;
        const fieldName = label || componentData.id;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (required === true && !value) {
            return translate('validation.required')(fieldName);
        }

        if (!value) {
            return null; // Não é obrigatório e está vazio -> Válido
        }

        if (!emailRegex.test(value)) {
            return translate('validation.invalidEmail')(fieldName);
        }

        return null; // Válido
    };

    /**
     * Verifica a validade de componentes numéricos.
     * @param {number|string} value O valor atual do campo.
     * @param {Object} componentData O objeto de configuração do componente.
     * @returns {string | null} Mensagem de erro se inválido, null se válido.
     */
    const validateNumberComponent = (value, componentData) => {
        const { required, min: _min, max, label } = componentData;
        const fieldName = label || componentData.id;

        const min = _min ?? 0;

        if (required === true && (value == null || value === "")) {
            return translate('validation.required')(fieldName);
        }

        if (!required && (value == null || value === "")) {
            return null; // Não é obrigatório e está vazio -> Válido
        }

        const numberValue = Number(value);
        if (isNaN(numberValue)) {
            return translate('validation.notANumber')(fieldName);
        }

        if (min != null && numberValue < min) {
            return translate('validation.minNumber')(fieldName, min);
        }

        if (max != null && numberValue > max) {
            return translate('validation.maxNumber')(fieldName, max);
        }

        return null; // Válido
    };

    /**
     * Verifica a validade de componentes de senha. (Chaves de tradução específicas para senha)
     * @param {string} value O valor atual do campo.
     * @param {Object} componentData O objeto de configuração do componente.
     * @returns {string | null} Mensagem de erro se inválido, null se válido.
     */
    const validatePasswordComponent = (value, componentData) => {
        const { required, minLength, maxLength, label } = componentData;
        const fieldName = label || componentData.id;
        const stringValue = String(value || "");

        if (required === true && stringValue.trim().length === 0) {
            return translate('validation.required')(fieldName);
        }

        if (!required && stringValue.trim().length === 0) {
            return null; // Não é obrigatório e está vazio -> Válido
        }

        if (minLength != null && stringValue.length < minLength) {
            return translate('validation.passwordMinLength')(minLength);
        }

        if (maxLength != null && stringValue.length > maxLength) {
            return translate('validation.passwordMaxLength')(maxLength);
        }

        return null; // Válido
    };

    /**
     * Verifica a validade de componentes de rádio.
     * @param {string} value O valor atual do campo.
     * @param {Object} componentData O objeto de configuração do componente.
     * @returns {string | null} Mensagem de erro se inválido, null se válido.
     */
    const validateRadioComponent = (value, componentData) => {
        const { required, label } = componentData;
        const fieldName = label || componentData.id;

        if (required === true && !value) {
            return translate('validation.selectOption')(fieldName);
        }

        return null; // Válido
    };

    /**
     * Verifica a validade de componentes de seleção (select).
     * @param {string|number} value O valor atual do campo.
     * @param {Object} componentData O objeto de configuração do componente.
     * @returns {string | null} Mensagem de erro se inválido, null se válido.
     */
    const validateSelectComponent = (value, componentData) => {
        const { required, label } = componentData;
        const fieldName = label || componentData.id;

        if (required === true && (value == null || value === "")) {
            return translate('validation.selectOption')(fieldName);
        }

        return null; // Válido
    };

    /**
     * Verifica a validade de componentes de tempo.
     * @param {string} value O valor atual do campo.
     * @param {Object} componentData O objeto de configuração do componente.
     * @returns {string | null} Mensagem de erro se inválido, null se válido.
     */
    const validateTimeComponent = (value, componentData) => {
        const { required, label } = componentData;
        const fieldName = label || componentData.id;

        if (required === true && !value) {
            return translate('validation.required')(fieldName);
        }

        return null; // Válido
    };

    /**
     * Verifica a validade de componentes de checkbox.
     * @param {boolean} value O valor atual do campo.
     * @param {Object} componentData O objeto de configuração do componente.
     * @returns {string | null} Mensagem de erro se inválido, null se válido.
     */
    const validateCheckboxComponent = (value, componentData) => {
        const { required, label } = componentData;
        const fieldName = label || componentData.id;

        if (required === true && value !== true) {
            return translate('validation.acceptCheckbox')(fieldName);
        }
        return null; // Válido
    };

    /**
     * Verifica a validade de componentes de arquivo.
     * @param {File[] | null} value O valor atual do campo.
     * @param {Object} componentData O objeto de configuração do componente.
     * @returns {string | null} Mensagem de erro se inválido, null se válido.
     */
    const validateFileComponent = (value, componentData) => {
        const { required, label } = componentData;
        const fieldName = label || componentData.id;

        if (required === true && (!value || (Array.isArray(value) && value.length === 0))) {
            return translate('validation.requiredFile')(fieldName);
        }
        return null; // Válido
    };

    /**
     * Verifica a validade de componentes de data.
     * @param {string | Date} value O valor atual do campo.
     * @param {Object} componentData O objeto de configuração do componente.
     * @returns {string | null} Mensagem de erro se inválido, null se válido.
     */
    const validateDateComponent = (value, componentData) => {
        const { required, minDate, maxDate, label } = componentData;
        const fieldName = label || componentData.id;

        if (required === true && !value) {
            return translate('validation.required')(fieldName);
        }

        if (!required && !value) {
            return null; // Não é obrigatório e está vazio -> Válido
        }

        const dateValue = new Date(value);
        if (isNaN(dateValue.getTime())) {
            return translate('validation.invalidDate')(fieldName);
        }

        if (minDate != null) {
            const min = new Date(minDate);
            if (isNaN(min.getTime())) {
                console.error(`Invalid minDate for component ${componentData.id}: ${minDate}`);
                return translate('validation.minDateInternalError')(fieldName);
            }
            // Compara ignorando a parte do tempo para ser mais fiel à validação de "data"
            const dateOnlyValue = new Date(dateValue.getUTCFullYear(), dateValue.getUTCMonth(), dateValue.getUTCDate());
            const dateOnlyMin = new Date(min.getUTCFullYear(), min.getUTCMonth(), min.getUTCDate());

            if (dateOnlyValue < dateOnlyMin) {
                // Passa a data formatada para a tradução
                return translate('validation.minDateError')(fieldName, minDate);
            }
        }

        if (maxDate != null) {
            const max = new Date(maxDate);
            if (isNaN(max.getTime())) {
                console.error(`Invalid maxDate for component ${componentData.id}: ${maxDate}`);
                return translate('validation.maxDateInternalError')(fieldName);
            }
            // Compara ignorando a parte do tempo
            const dateOnlyValue = new Date(dateValue.getUTCFullYear(), dateValue.getUTCMonth(), dateValue.getUTCDate());
            const dateOnlyMax = new Date(max.getUTCFullYear(), max.getUTCMonth(), max.getUTCDate());

            if (dateOnlyValue > dateOnlyMax) {
                // Passa a data formatada para a tradução
                return translate('validation.maxDateError')(fieldName, maxDate);
            }
        }

        return null; // Válido
    };

    const validationFunctions = {
        'text': validateTextComponent,
        'textarea': validateTextComponent,
        'email': validateEmailComponent,
        'number': validateNumberComponent,
        'password': validatePasswordComponent,
        'radio': validateRadioComponent,
        'select': validateSelectComponent,
        'time': validateTimeComponent,
        'checkbox': validateCheckboxComponent,
        'file': validateFileComponent,
        'date': validateDateComponent,
    };

    /**
     * Função principal para validar qualquer tipo de componente.
     * @param {any} value O valor atual do campo.
     * @param {Object} componentData O objeto de configuração do componente.
     * @returns {string | null} Mensagem de erro se inválido, null se válido.
     */
    return (value, componentData) => {
        const validator = validationFunctions[componentData.type];
        if (validator) {
            return validator(value, componentData);
        }

        // Assume que componentes sem validador específico são válidos.
        return null;
    };
};

// ---------------------------------------------------------------------
// 🚀 2. Componente Principal Form
// ---------------------------------------------------------------------

/**
 * Componente principal que renderiza um formulário dinâmico,
 * gerenciando o estado e a validação de seus componentes.
 *
 * @param {Object} properties
 * @param {(hasAction: boolean) => void} properties.closePopup Função para fechar o popup.
 * @param {Object} [properties.popupstyles] Estilos CSS.
 * @param {(key: string, ...args: (string|number)[]) => string} properties.translate Função de tradução.
 * @param {Boolean} properties.requireAction Se uma ação (OK/Done) é requerida.
 * @param {Object} [properties.data] Dados de configuração do formulário.
 * @param {React.ReactNode} [properties.data.message=""] Mensagem de cabeçalho.
 * @param {React.ReactNode} [properties.data.title="Title"] Título do formulário.
 * @param {React.ReactNode} [properties.data.doneLabel="Done"] Rótulo do botão principal.
 * @param {Array<Object | Array<Object>>} [properties.data.components] Array de configurações de componentes.
 * @param {React.ReactNode} [properties.data.icon="ⓘ"] Ícone de cabeçalho.
 * @param {(arg0: object) => void} [properties.data.onSubmit=() => {}] Callback ao submeter.
 * @param {(arg0: object) => void} [properties.data.onChange=() => {}] Callback ao alterar um valor.
 * @returns {React.JSX.Element}
 */
export default function Form({
    closePopup,
    popupstyles = {},
    translate,
    requireAction,
    data: {
        title,
        icon = "ⓘ",
        message = "",
        doneLabel,
        components = [{ id: "text01", type: "text", label: "Text", defaultValue: "", disabled: false }],
        onSubmit = () => { },
        onChange = () => { },
    } = {}
}) {

    const validateComponent = useMemo(() => createValidator(translate), [translate]);


    /**
     * Auxiliar para ter uma lista plana de todos os componentes
     * @type {Array<Object>}
     */
    const flattenedComponents = useMemo(() => {
        const flat = [];
        for (const componentOrArray of components) {
            if (Array.isArray(componentOrArray)) {
                flat.push(...componentOrArray);
            } else {
                flat.push(componentOrArray);
            }
        }
        return flat;
    }, [components]);

    if (flattenedComponents.some(component => (!component.id) || (!component.type))) throw new Error("Form components must have an id and a type");

    /**
     * Inicializa os valores do estado baseado nos defaults dos componentes.
     * @param {Array<Object | Array<Object>>} components Configurações dos componentes.
     * @returns {Object} Objeto de valores iniciais.
     */
    const getInitialValue = (components) => {
        const initialValue = {};
        const idSet = new Set();
        const falsyByType = {
            "text": "",
            "textarea": "",
            "password": "",
            "email": "",
            "date": "",
            "time": "",
            "number": "",
            "checkbox": false,
            "radio": "",
            "select": "",
            "file": []
        };

        const processComponent = (component) => {
            if (idSet.has(component.id)) {
                return console.error(`Duplicated component id: ${component.id}`);
            } else {
                idSet.add(component.id);
            }
            initialValue[component.id] = component.defaultValue ?? falsyByType[component.type];
        };

        for (const componentOrArray of components) {
            if (Array.isArray(componentOrArray)) {
                const componentsArray = componentOrArray;
                for (const component of componentsArray) {
                    processComponent(component);
                }
            } else {
                const component = componentOrArray;
                processComponent(component);
            }
        }

        return initialValue;
    };

    const [values, setValues] = useState(() => getInitialValue(components));
    // 🚀 Estado para rastrear se o formulário inteiro é válido
    const [isFormValid, setIsFormValid] = useState(false);

    const [lastChangedComponent, setLastChangedComponent] = useState(null);

    /**
     * Função para recalcular a validade de TODO o formulário.
     * @param {Object} currentValue Objeto com todos os valores do formulário.
     * @returns {boolean} True se o formulário for válido, false caso contrário.
     */
    const checkFormValidity = (currentValue) => {
        // Itera sobre todos os componentes (achatados)
        for (const component of flattenedComponents) {
            // Se o componente estiver desabilitado, não precisa validar
            // if (component.disabled) {
            //     continue;
            // }

            const componentValue = currentValue[component.id];

            // A chamada correta: validateComponent(value, componentData) retorna string ou null
            if (validateComponent(componentValue, component)) {
                // Se retornar uma string (truthy), é inválido.
                return false;
            }
        }

        // Se todos os componentes forem válidos
        return true;
    };

    // 🚀 Efeito para recalcular a validade sempre que 'values' (os dados) mudar
    useEffect(() => {
        const isValid = checkFormValidity(values);
        setIsFormValid(isValid);

        if (lastChangedComponent) {
            // A chamada correta: validateComponent(value, componentData) retorna string ou null
            const componentData = flattenedComponents.find(comp => comp.id === lastChangedComponent);
            const validationResult = componentData ? validateComponent(values[lastChangedComponent], componentData) : null;

            onChange({
                changedComponentState: {
                    id: lastChangedComponent,
                    // isValid é o oposto de isInvalid (validationResult === null)
                    isValid: validationResult === null,
                    value: values[lastChangedComponent]
                },
                formState: { values: values, isValid: isValid }
            });
        }
    }, [values, flattenedComponents, validateComponent, lastChangedComponent, onChange]);

    // Valores padrão de tradução
    const finalTitle = title ?? translate('form.title');
    const finalDoneLabel = doneLabel ?? translate('util.done');

    const classes = {
        header: `${popupstyles.header} ntpopups-header`,
        row: `${popupstyles.row} ntpopups-form-row`,
        icon: `${popupstyles.icon} ntpopups-icon`,
        body: `${popupstyles.body} ${popupstyles.formScrollable} ntpopups-body ntpopups-form-body`,
        formMessage: `${popupstyles.formMessage} ntpopups-form-message`,
        footer: `${popupstyles.footer} ntpopups-footer`,
        componentContainer: `${popupstyles.componentContainer} ntpopups-form-component-container`,
        baseButton: `${popupstyles.baseButton} ntpopups-basebutton`,
    };

    return (
        <form
            // Tag Semântica: O <form> envolve os campos de entrada e botões de submissão.
            onSubmit={(e) => { e.preventDefault(); /* Previne o submit nativo*/ }}
        >
            <header className={classes.header}>
                <div className={classes.icon} aria-hidden="true">
                    {icon}
                </div>
                {finalTitle}
            </header>

            <section className={classes.body}>
                {message && <p className={classes.formMessage}>{message}</p>}
                {
                    components.map((componentOrArray, index) => {
                        if (Array.isArray(componentOrArray)) {
                            const componentsArray = componentOrArray;
                            return (
                                <div role="group" className={classes.row} key={`row-${index}`}>
                                    {componentsArray.map((component) => {
                                        // 🚀 Validade individual (retorna string ou null)
                                        const invalidReason = validateComponent(values[component.id], component);
                                        return <div key={`rc-${index}-${component.id}`} className={classes.componentContainer} component-type={component.type}>
                                            <FormComponent
                                                id={component.id}
                                                translate={translate}
                                                autoFocus={index === 0}
                                                data={component}
                                                value={values[component.id]}
                                                // 🚀 isInvalid: string (erro) ou null (válido)
                                                isInvalid={invalidReason}
                                                onValueChange={(inputvalue) => {
                                                    setLastChangedComponent(component.id);
                                                    updateStateKey(setValues, values, [component.id, inputvalue])
                                                }}
                                            />
                                        </div>
                                    })}
                                </div>
                            );
                        } else {
                            const component = componentOrArray;
                            // 🚀 Validade individual (retorna string ou null)
                            const invalidReason = validateComponent(values[component.id], component);
                            return <div key={`cc-${index}-${component.id}`} className={classes.componentContainer} component-type={component.type}>
                                <FormComponent
                                    id={component.id}
                                    translate={translate}
                                    autoFocus={index === 0}
                                    data={component}
                                    value={values[component.id]}
                                    // 🚀 isInvalid: string (erro) ou null (válido)
                                    isInvalid={invalidReason}
                                    onValueChange={(inputvalue) => {
                                        setLastChangedComponent(component.id);
                                        updateStateKey(setValues, values, [component.id, inputvalue]);
                                    }}
                                />
                            </div>
                        }
                    })
                }
            </section>

            <footer className={classes.footer}>
                {
                    !requireAction && <button
                        type="button"
                        onClick={() => closePopup(false)}
                        className={classes.baseButton}
                        base-button-style={"1"}
                        base-button-no-flex={"true"}
                    >
                        {translate('util.cancelLabel')}
                    </button>
                }
                <button
                    className={classes.baseButton}
                    base-button-no-flex={"true"}
                    disabled={!isFormValid}
                    onClick={() => {
                        onSubmit(values);
                        closePopup(true);
                    }}
                    type="submit"
                >
                    {finalDoneLabel}
                </button>
            </footer>
        </form>
    );
}