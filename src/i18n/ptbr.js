/**
 * Strings de tradução para Português (pt).
 */
export default {
    util: {
        cancelLabel: "Cancelar",
        confirmLabel: "Confirmar",
        closeLabel: "Fechar",
        ok: "Ok",
        resetLabel: "Resetar",
        applyLabel: "Aplicar",
        done: "Pronto",
    },
    confirm: {
        title: "Confirmação",
        message: "Tem certeza que deseja prosseguir?",
    },
    internalError: {
        title: "Erro: Tipo de Popup Inválido",
        message: "Tipo não reconhecido:",
    },
    cropImage: {
        title: "Editar Imagem",
    },
    generic: {
        title: "Aviso",
        message: "Mensagem"
    },
    form: {
        title: "Preencha"
    },
    file: {
        selectedFiles: (n) => `${n} arquivos selecionado${n !== 1 ? 's' : ''}`,
        fileSelect: "Selecione um arquivo"
    },
    validation: {
        required: (fieldName) => `O campo é obrigatório.`,
        minLength: (fieldName, length) => `O campo deve ter no mínimo ${length} caracteres.`,
        maxLength: (fieldName, length) => `O campo deve ter no máximo ${length} caracteres.`,
        regexMismatch: (fieldName) => `O campo não corresponde ao formato esperado.`,
        regexInternalError: (fieldName) => `Erro interno na validação do campo (Regex inválido).`,
        invalidEmail: (fieldName) => `O campo deve ser um email válido.`,
        notANumber: (fieldName) => `O campo deve ser um número.`,
        minNumber: (fieldName, min) => `O valor deve ser maior ou igual a ${min}.`,
        maxNumber: (fieldName, max) => `O valor deve ser menor ou igual a ${max}.`,
        selectOption: (fieldName) => `Selecione uma opção`,
        acceptCheckbox: (fieldName) => `Você deve aceitar a opção.`,
        requiredFile: (fieldName) => `O campo requer um arquivo.`,
        invalidDate: (fieldName) => `O campo não contém uma data válida.`,
        minDateError: (fieldName, date) => `A data deve ser igual ou posterior a ${localDateString(date)}.`,
        minDateInternalError: (fieldName) => `Erro interno na validação de data mínima.`,
        maxDateError: (fieldName, date) => `A data deve ser igual ou anterior a ${localDateString(date)}.`,
        maxDateInternalError: (fieldName) => `Erro interno na validação de data máxima.`,
        passwordMinLength: (length) => `A senha deve ter no mínimo ${length} caracteres.`,
        passwordMaxLength: (length) => `A senha deve ter no máximo ${length} caracteres.`,
    }
};

function localDateString(date) {
    date = new Date(date);

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
}