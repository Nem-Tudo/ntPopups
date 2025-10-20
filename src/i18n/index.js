// /src/i18n/index.js

import en from './en';
import ptbr from './ptbr';
// Importe novos idiomas aqui:
// import es from './es'; 

// Mapeamento de todos os idiomas disponíveis
const languageMap = {
    en,
    ptbr,
    // es,
};

export const defaultLanguage = 'en';
export const availableLanguages = Object.keys(languageMap);

/**
 * Função utilitária para obter a tradução para uma chave e idioma.
 * Suporta chaves aninhadas usando notação de ponto (ex: 'confirm.title').
 * * @param {string} key - A chave da string (ex: 'confirm.title').
 * @param {string} lang - O idioma desejado (ex: 'pt').
 * @returns {string} A string traduzida ou uma mensagem de erro.
 */
export function getTranslation(key, lang = defaultLanguage) {
    const language = languageMap[lang] || languageMap[defaultLanguage];
    const keys = key.split('.');
    
    let result = language;
    for (const k of keys) {
        if (result && result[k] !== undefined) {
            result = result[k];
        } else {
            // Fallback: Retorna a chave se a tradução não for encontrada
            return `[${key} in ${lang}]`;
        }
    }

    return result;
}