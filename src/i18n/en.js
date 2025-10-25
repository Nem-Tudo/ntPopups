/**
 * Strings de tradução para Inglês (en).
 */
export default {
    util: {
        error: "Error",
        cancelLabel: "Cancel",
        confirmLabel: "Confirm",
        closeLabel: "Close",
        ok: "Ok",
        resetLabel: "Reset",
        applyLabel: "Apply",
        done: "Done",
    },
    confirm: {
        title: "Confirmation",
        message: "Are you sure you want to proceed?",
    },
    internalError: {
        title: "Error: Invalid Popup Type",
        message: "Type not recognized:",
    },
    cropImage: {
        title: "Edit Image"
    },
    generic: {
        title: "Warn",
        message: "Message"
    },
    form: {
        title: "Form"
    },
    file: {
        selectedFiles: (n) => `${n} file${n !== 1 ? 's' : ''} selected`,
        fileSelect: "Select a file"
    },
    validation: {
        required: (fieldName) => `The field is required.`,
        minLength: (fieldName, length) => `The field must be at least ${length} characters long.`,
        maxLength: (fieldName, length) => `The field must be at most ${length} characters long.`,
        regexMismatch: (fieldName) => `The field does not match the expected format.`,
        regexInternalError: (fieldName) => `Internal error in validation for field (Invalid Regex).`,
        invalidEmail: (fieldName) => `The field must be a valid email.`,
        notANumber: (fieldName) => `The field must be a number.`,
        minNumber: (fieldName, min) => `The value must be greater than or equal to ${min}.`,
        maxNumber: (fieldName, max) => `The value must be less than or equal to ${max}.`,
        selectOption: (fieldName) => `Select an option`,
        acceptCheckbox: (fieldName) => `You must accept the option.`,
        requiredFile: (fieldName) => `The field requires a file.`,
        invalidDate: (fieldName) => `The field does not contain a valid date.`,
        minDateError: (fieldName, date) => `The date must be equal to or later than ${localDateString(date)}.`,
        minDateInternalError: (fieldName) => `Internal error in minimum date validation.`,
        maxDateError: (fieldName, date) => `The date must be equal to or earlier than ${localDateString(date)}.`,
        maxDateInternalError: (fieldName) => `Internal error in maximum date validation.`,
        passwordMinLength: (length) => `The password must be at least ${length} characters long.`,
        passwordMaxLength: (length) => `The password must be at most ${length} characters long.`,
    }
};

function localDateString(date) {
    date = new Date(date);

    const year = date.getUTCFullYear();

    const month = String(date.getUTCMonth() + 1).padStart(2, '0');

    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${day}/${month}/${year}`;
}