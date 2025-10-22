import React, { useEffect, useState, useMemo } from "react";
import FormComponent from "./form/FormComponent.jsx";
import updateStateKey from "../../utils/updateStateKey.js"; // Presumindo que este util está disponível

/**
 * Verifica se um valor de componente (apenas text/textarea) é válido
 * com base nas regras de validação.
 * @param {string} value O valor atual do campo.
 * @param {Object} componentData O objeto de configuração do componente.
 * @returns {boolean} True se o valor for válido, false caso contrário.
 */
const validateTextComponent = (value, componentData) => {
    const { required, minLength, maxLength, matchRegex, type } = componentData;

    // Apenas aplica validações complexas para 'text' e 'textarea'
    if (type !== 'text' && type !== 'textarea') {
        return true;
    }

    const stringValue = String(value || "");

    // 1. Validação Required
    // Se 'required' é true e o valor (após remover espaços) é vazio, é inválido.
    if (required === true && stringValue.trim().length === 0) {
        return false;
    }

    // Se não é requerido E está vazio, passa nas outras validações de tamanho/regex
    if (!required && stringValue.trim().length === 0) {
        return true;
    }

    // 2. Validação minLength
    if (minLength != null && stringValue.length < minLength) {
        return false;
    }

    // 3. Validação maxLength
    if (maxLength != null && stringValue.length > maxLength) {
        return false;
    }

    // 4. Validação matchRegex
    if (matchRegex) {
        try {
            // Permite que o usuário passe a regex como string (ex: "^[a-zA-Z]+$")
            const regex = new RegExp(matchRegex);
            if (!regex.test(stringValue)) {
                return false;
            }
        } catch (error) {
            console.error(`Regex inválida para o componente ${componentData.id}: ${matchRegex}`, error);
            // Considera inválido se a regex for malformada
            return false;
        }
    }

    // Passou por todas as regras
    return true;
};

// Mapeamento de funções de validação por tipo (para expansões futuras)
const validationFunctions = {
    'text': validateTextComponent,
    'textarea': validateTextComponent,
    // Adicionar outros tipos aqui (ex: 'email': validateEmailComponent)
};

/**
 * Função principal para validar qualquer tipo de componente.
 * @param {string} value O valor atual do campo.
 * @param {Object} componentData O objeto de configuração do componente.
 * @returns {boolean} True se o componente for válido, false caso contrário.
 */
const validateComponent = (value, componentData) => {
    const validator = validationFunctions[componentData.type];
    if (validator) {
        return validator(value, componentData);
    }

    // Assume que componentes sem validador específico são válidos.
    return true;
};

// ---------------------------------------------------------------------
// 🚀 2. Componente Principal Form (Semântico)
// ---------------------------------------------------------------------

/**
 * Text Input Popup Component
 * @param {Object} properties
 * @param {(hasAction: boolean) => void} properties.closePopup
 * @param {Object} [properties.popupstyles]
 * @param {(key: string) => string} properties.translate
 * @param {Object} [properties.data]
 * @param {React.ReactNode} [properties.data.message=""]
 * @param {React.ReactNode} [properties.data.title="Title"]
 * @param {React.ReactNode} [properties.data.doneLabel="Done"]
 * @param {Array} [properties.data.components=[{id: "text01", type: "text", label: "Text", defaultValue: "", disabled: false }]]
 * @param {React.ReactNode} [properties.data.icon="ⓘ"]
 * @param {(arg0: object) => void} [properties.data.onSubmit=() => {}]
 * @param {(arg0: object) => void} [properties.data.onChange=() => {}]
 * @param {Boolean} properties.requireAction Is action required?
 * */
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

    // 🚀 Auxiliar para ter uma lista plana de todos os componentes
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

    const getInitialValue = (components) => {
        const initialValue = {};
        const idSet = new Set();
        const falsyByType = {
            "text": "",
            "checkbox": false,
            "textarea": ""
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

    // 🚀 Função para recalcular a validade de TODO o formulário
    const checkFormValidity = (currentValue) => {
        // Itera sobre todos os componentes (achatados)
        for (const component of flattenedComponents) {
            // Se o componente estiver desabilitado, não precisa validar
            if (component.disabled) {
                continue;
            }

            const componentValue = currentValue[component.id];

            if (!validateComponent(componentValue, component)) {
                // Se um único componente for inválido, o formulário inteiro é inválido
                return false;
            }
        }

        // Se todos os componentes forem válidos
        return true;
    };

    // 🚀 Efeito para recalcular a validade sempre que 'value' (os dados) mudar
    useEffect(() => {
        const isValid = checkFormValidity(values);
        setIsFormValid(isValid);
    }, [values, flattenedComponents]);


    const finalTitle = title ?? translate('form.title');
    const finalDoneLabel = doneLabel ?? translate('util.done');

    const classes = {
        header: `${popupstyles.header} ntpopups-header`,
        row: `${popupstyles.row} ntpopups-form-row`,
        icon: `${popupstyles.icon} ntpopups-icon`,
        body: `${popupstyles.body} ${popupstyles.formScrollable} ntpopups-body ntpopups-form-body`,
        formMessage: `${popupstyles.formMessage} ntpopups-form-message`,
        footer: `${popupstyles.footer} ntpopups-footer`,
        componentContainer: `${popupstyles.componentContainer} ntpopups-form-componentcontainer`,
        baseButton: `${popupstyles.baseButton} ntpopups-basebutton`,
    };

    return (
        <form // **Tag Semântica:** O <form> envolve os campos de entrada e botões de submissão.
            // Para não quebrar o funcionamento (que usa onSubmit(value) customizado)
            // mantemos como está, mas em um formulário padrão React, o handler estaria aqui.
            onSubmit={(e) => { e.preventDefault(); /* A submissão é tratada no botão, mas previene o submit nativo*/ }}
        >
            <header className={classes.header}> {/* **Tag Semântica:** Para o cabeçalho do popup/formulário */}
                <div className={classes.icon} aria-hidden="true"> {/* O ícone é decorativo */}
                    {icon}
                </div>
                {finalTitle}
            </header>

            <section className={classes.body}> {/* **Tag Semântica:** Para o conteúdo principal e campos de formulário */}
                {message && <p className={classes.formMessage}>{message}</p>}
                {
                    components.map((componentOrArray, index) => {
                        if (Array.isArray(componentOrArray)) {
                            const componentsArray = componentOrArray;
                            return (
                                <fieldset className={classes.row} key={`row-${index}`}> {/* **Tag Semântica:** Agrupa componentes relacionados (neste caso, por linha) */}
                                    {componentsArray.map((component) => {
                                        // 🚀 Validade individual
                                        const isComponentValid = validateComponent(values[component.id], component);
                                        return <div key={`rc-${index}`} className={classes.componentContainer} component-type={component.type}>
                                            <FormComponent
                                                autoFocus={index === 0}
                                                data={component}
                                                value={values[component.id]}
                                                // 🚀 Passa o estado de validade individual
                                                isValid={isComponentValid}
                                                onValueChange={(inputvalue) => {
                                                    updateStateKey(setValues, values, [component.id, inputvalue])
                                                    onChange({ changedComponentState: { id: component.id, isValid: isComponentValid, value: inputvalue }, formState: { values: { ...values, [component.id]: inputvalue }, isValid: isFormValid } });
                                                }}
                                            />
                                        </div>
                                    })}
                                </fieldset>
                            );
                        } else {
                            const component = componentOrArray;
                            const isComponentValid = validateComponent(values[component.id], component);
                            return <div key={`cc-${index}`} className={classes.componentContainer} component-type={component.type}>
                                <FormComponent
                                    autoFocus={index === 0}
                                    data={component}
                                    value={values[component.id]}
                                    // 🚀 Passa o estado de validade individual
                                    isValid={isComponentValid}
                                    onValueChange={(inputvalue) => {
                                        updateStateKey(setValues, values, [component.id, inputvalue])
                                        onChange({ changedComponentState: { id: component.id, isValid: isComponentValid, value: inputvalue }, formState: { values: { ...values, [component.id]: inputvalue }, isValid: isFormValid } });
                                    }}
                                />
                            </div>
                        }
                    })
                }
            </section>

            <footer className={classes.footer}> {/* **Tag Semântica:** Para a área de botões/rodapé */}
                {
                    !requireAction && <button
                        type="button" // **Semântica:** Para indicar que não submete o form
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
                    type="submit" // **Semântica:** Indica que este é o botão principal de submissão.
                >
                    {finalDoneLabel}
                </button>
            </footer>
        </form>
    );
}