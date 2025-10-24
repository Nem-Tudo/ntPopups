"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import DisplayPopup from "../components/DisplayPopup.jsx";
import { internalPopupTypes } from "./popupTypes";

// IMPORTANTE: Certifique-se de que este caminho está correto.
// O arquivo '../utils/types' deve conter o typedef PopupContextValue.
/**
 * @typedef {import("../utils/types").PopupContextValue} PopupContextValue
 * @typedef {import("../utils/types").NtPopupConfig} NtPopupConfig
 * @typedef {import("../utils/types").PopupData} PopupData
 * @typedef {import("../utils/types").PopupSettings} PopupSettings
 */

import { getTranslation, defaultLanguage } from "../i18n/index";

// Duração da animação de fechamento em milissegundos. Deve corresponder ao CSS.
const CLOSE_ANIMATION_DURATION = 100;

// ==================== CONTEXT CREATION ====================

if (typeof createContext != "function") throw new Error(
    `ntPopups Error: NtPopupProvider and useNtPopups cannot be called on the server.\n` +
    `If you're in the App Router, ensure the component calling this function has "use client" at the top.`
)

// O JSDoc AGORA USA O TIPO EXTENDIDO CORRETO
/** @type {React.Context<PopupContextValue>} */
const PopupContext = createContext({
    popups: [],
    openPopup: () => null,
    closePopup: () => { },
    closeAllPopups: () => { },
    isPopupOpen: () => false,
    getPopup: () => null,
    updatePopup: () => null,
    language: defaultLanguage,
    translate: (key) => `[${key}]`,
});

PopupContext.displayName = "NtPopupsContext";

// ==================== PROVIDER COMPONENT ====================

/**
 * Provides the popup state and control functions to the application.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {NtPopupConfig} [props.config={}] - Global configuration for the popups.
 * @param {Object.<string, React.ComponentType>} [props.customPopups={}] - Map of user-defined React components { type: Component }.
 * @param {'en'|'ptbr'} [props.language="en"] - The current language for internal popups (e.g., "en", "pt").
 * @param {'white'|'dark'} [props.theme="white"] - The current language for internal popups (e.g., "en", "pt").
 */
export function NtPopupProvider({ children, config = {}, customPopups = {}, language: propLanguage = defaultLanguage, theme = "white" }) {
    const [popups, setPopups] = useState([]);

    useEffect(() => {
        console.log(`Loaded ntPopups https://www.npmjs.com/package/ntpopups`)
    }, [])

    // Idioma Ativo (Garante fallback para o defaultLanguage)
    const activeLanguage = propLanguage || defaultLanguage;

    // Função de tradução (Memoizada)
    const translate = useCallback((key) => getTranslation(key, activeLanguage), [activeLanguage]);


    // Refs for persistence
    const callbacksRef = useRef(new Map()); // popupId -> { onClose, onOpen }
    const timeoutsRef = useRef(new Map());   // popupId -> timeoutId
    /** @type {React.MutableRefObject<PopupData[]>} */
    const currentPopupsRef = useRef([]);

    // Queue system for race condition prevention
    const operationQueueRef = useRef([]);
    const isProcessingRef = useRef(false);

    // Merge internal popups with user-defined custom popups
    const allPopupTypes = { ...internalPopupTypes, ...customPopups };

    // Configuration parsing
    const { defaultSettings = {} } = config;
    const globalDefaults = defaultSettings.all || {};

    // ========== STATE SYNCHRONIZATION AND QUEUE PROCESSING ==========
    useEffect(() => {
        currentPopupsRef.current = popups;
        processQueue();
    }, [popups]);

    const processQueue = () => {
        if (isProcessingRef.current || operationQueueRef.current.length === 0) {
            return;
        }

        isProcessingRef.current = true;

        requestAnimationFrame(() => {
            const operation = operationQueueRef.current.shift();
            if (operation) {
                operation();
            }

            isProcessingRef.current = false;

            if (operationQueueRef.current.length > 0) {
                processQueue();
            }
        });
    };

    // ========== UNIQUE ID GENERATION ==========
    const generatePopupId = () => {
        return `ntpopup_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    };

    /**
     * Remove o pop-up do estado após a animação de fechamento.
     * @param {string} popupId 
     * @param {boolean} hasAction 
     */
    const removePopupFromState = useCallback((popupId, hasAction) => {
        setPopups(prev => {
            const closingPopup = prev.find(p => p.id === popupId);
            if (!closingPopup) return prev;

            // Execute onClose callback
            const callbacks = callbacksRef.current.get(popupId);
            if (callbacks?.onClose) {
                try {
                    callbacks.onClose(hasAction, popupId);
                } catch (error) {
                    console.error(`Error in onClose callback for popup ${popupId}:`, error);
                }
            }
            callbacksRef.current.delete(popupId);

            // Clear timeout
            const timeoutId = timeoutsRef.current.get(popupId);
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutsRef.current.delete(popupId);
            }

            const filtered = prev.filter(p => p.id !== popupId);

            // Restore replaced popup logic
            if (closingPopup.replacedPopupId) {
                const replacedPopup = prev.find(p => p.id === closingPopup.replacedPopupId && p.hidden);

                if (replacedPopup) {
                    // Make the replaced popup visible again with updated zIndex
                    return filtered.map(p =>
                        p.id === replacedPopup.id
                            ? { ...p, hidden: false, zIndex: 1000 + filtered.length }
                            : p
                    );
                }
            }

            return filtered;
        });
    }, []);

    // ========== CLOSE POPUP FUNCTION ==========
    /**
     * @param {string | boolean | undefined} popupIdOrHasAction
     * @param {boolean | undefined} [hasActionParam]
     */
    const closePopup = useCallback((popupIdOrHasAction, hasActionParam) => {
        setPopups(prev => {
            let popupId;
            let hasAction;

            // Parameter flexibility logic
            if (typeof popupIdOrHasAction === 'boolean') {
                // @ts-ignore
                popupId = prev.findLast(p => !p.hidden)?.id;
                hasAction = popupIdOrHasAction;
            } else if (typeof popupIdOrHasAction === 'string' && typeof hasActionParam === 'boolean') {
                popupId = popupIdOrHasAction;
                hasAction = hasActionParam;
            } else if (typeof popupIdOrHasAction === 'string') {
                popupId = popupIdOrHasAction;
                hasAction = false;
            } else {
                // @ts-ignore
                popupId = prev.findLast(p => !p.hidden)?.id;
                hasAction = false;
            }

            if (!popupId) return prev;

            const closingPopup = prev.find(p => p.id === popupId && !p.isClosing);
            if (!closingPopup) return prev;

            if (closingPopup.settings.requireAction && !hasAction) return prev;

            // 1. UPDATE STATE: Mark as closing
            const newState = prev.map(p =>
                p.id === popupId ? { ...p, isClosing: true } : p
            );

            // 2. SCHEDULE REMOVAL: Remove from state after animation
            // Importante: A função removePopupFromState agora contém a lógica de limpeza (callbacks, timeouts, overflow)
            setTimeout(() => {
                removePopupFromState(popupId, hasAction);
            }, CLOSE_ANIMATION_DURATION);


            // 3. HANDLE OVERFLOW: If it's the last one closing, ensure overflow is restored.
            // A lógica de overflow deve ser tratada aqui antes do agendamento, verificando
            // se este é o único pop-up *visível e não fechando* que resta.
            // const remainingVisiblePopups = prev.filter(p => p.id !== popupId && !p.hidden && !p.isClosing);
            // if (remainingVisiblePopups.length === 0) {
            //     // Esta lógica é um fallback, o useEffect de listener faz a limpeza final
            //     // mas é bom ter aqui para garantir que o scroll volte o mais rápido possível.
            //     if (!closingPopup.settings.allowPageBodyScroll) {
            //         document.querySelector("body").style.overflow = "";
            //         document.querySelector("html").style.overflow = "";
            //     }
            // }

            // Clear timeout, já que a ação manual está substituindo o auto-timeout
            const timeoutId = timeoutsRef.current.get(popupId);
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutsRef.current.delete(popupId);
            }

            // O retorno é o novo estado com o pop-up marcado para fechamento
            return newState;
        });
    }, [removePopupFromState]);


    // ========== UPDATE POPUP FUNCTION ==========
    /**
     * Altera reativamente as settings de um pop-up aberto.
     * @param {string} popupId - O ID do pop-up a ser atualizado.
     * @param {PopupSettings} newSettings - O novo objeto de settings (mescla com as settings existentes).
     */
    const updatePopup = useCallback((popupId, newSettings) => {
        let updatedPopup = null;

        setPopups(prev => {
            const popupIndex = prev.findIndex(p => p.id === popupId);

            if (popupIndex === -1 || prev[popupIndex].isClosing) {
                console.warn(`ntPopups Warning: Could not find open popup with id ${popupId} to update settings.`);
                // updatedPopup já é null
                return prev;
            }

            const currentPopup = prev[popupIndex];

            // 1. Cria uma cópia com as settings atualizadas.
            const tempUpdatedPopup = {
                ...currentPopup,
                settings: {
                    ...currentPopup.settings,
                    ...newSettings,
                    id: popupId // Garante que o ID não seja alterado
                },
            };

            updatedPopup = tempUpdatedPopup;

            // 2. Clear/Update Timeout se o 'timeout' foi alterado.
            if (newSettings.timeout !== undefined) {
                // Clear old timeout
                const oldTimeoutId = timeoutsRef.current.get(popupId);
                if (oldTimeoutId) {
                    clearTimeout(oldTimeoutId);
                    timeoutsRef.current.delete(popupId);
                }

                // Set new timeout if greater than 0
                if (newSettings.timeout && newSettings.timeout > 0) {
                    const newTimeoutId = setTimeout(() => {
                        closePopup(popupId, false); // HasAction false for timeout close
                    }, newSettings.timeout);
                    timeoutsRef.current.set(popupId, newTimeoutId);
                }
            }

            // 3. Retorna um novo array de estado com o pop-up atualizado.
            const newState = [...prev];
            newState[popupIndex] = updatedPopup; // Usa a variável que será retornada
            return newState;
        });

        return updatedPopup;
    }, [closePopup]);

    // ========== OPEN POPUP FUNCTION (Immediate Logic)  ==========
    /**
     * Lógica imediata para abertura de pop-up.
     * @param {string} popupType
     * @param {object} [settings]
     * @returns {PopupData | null} O objeto do pop-up recém-criado, ou null em caso de erro.
     */
    const openPopupImmediate = (popupType, settings = {}) => {
        const popupId = settings.id || generatePopupId();
        const keepLast = settings.keepLast !== undefined ? settings.keepLast : false;

        if (currentPopupsRef.current.some(p => p.id === popupId)) {
            console.error(`ntPopups Error: Popup with id ${popupId} already exists`);
            return null;
        }

        callbacksRef.current.set(popupId, {
            onClose: settings.onClose,
            onOpen: settings.onOpen
        });

        const typeDefaults = defaultSettings[popupType] || {};

        let newPopup; // Variável para armazenar o objeto criado antes do setPopups

        // Função para calcular a largura da barra de rolagem
        function getScrollbarWidth() {
            // Cria um elemento div temporário
            const outer = document.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.overflow = 'scroll'; // Força a barra de rolagem
            // @ts-ignore
            outer.style.msOverflowStyle = 'scrollbar'; // Para IE
            document.body.appendChild(outer);

            // Cria um div interno para medir a largura
            const inner = document.createElement('div');
            outer.appendChild(inner);

            // Calcula a diferença entre a largura total (outer.offsetWidth) e a largura do conteúdo (inner.offsetWidth)
            const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

            // Remove os elementos temporários
            outer.parentNode.removeChild(outer);

            return scrollbarWidth;
        }

        const body = document.querySelector("body");
        const html = document.querySelector("html");

        // Armazena a largura da barra de rolagem
        const scrollbarWidth = getScrollbarWidth();

        if (!settings.allowPageBodyScroll) {
            // 1. Verifica se a página PRECISA de scroll (se o conteúdo excede a altura da janela)
            // Uma maneira simples de verificar se há uma barra de rolagem vertical presente (no body ou html)
            const hasVerticalScrollbar = document.documentElement.scrollHeight > window.innerHeight;

            if (hasVerticalScrollbar) {
                // 2. Compensa a largura da barra de rolagem com padding-right
                body.style.paddingRight = `${scrollbarWidth}px`;
            }

            // 3. Desativa o scroll
            body.style.overflow = "hidden";
            html.style.overflow = "hidden"; // Opcional, mas boa prática para garantir

        }

        setPopups(prev => {
            const visiblePopups = prev.filter(p => !p.hidden && !p.isClosing);

            /** @type {PopupData} */
            const popupData = {
                id: popupId,
                popupType,
                isClosing: false,
                settings: {
                    // Default library settings (lowest priority)
                    closeOnEscape: true,
                    closeOnClickOutside: true,
                    requireAction: false,
                    timeout: 0,
                    keepLast: false,
                    allowPageBodyScroll: false,
                    interactiveBackdrop: false,
                    hiddenBackdrop: false,
                    hiddenHeader: false,
                    hiddenFooter: false,
                    disableOpenAnimation: false,
                    // 1. Global defaults from config
                    ...globalDefaults,
                    // 2. Type-specific defaults from config
                    ...typeDefaults,
                    // 3. User-provided settings (highest priority)
                    ...settings,
                    id: popupId
                },
                zIndex: 1000 + visiblePopups.length,
                replacedPopupId: null,
                hidden: false
            };

            newPopup = popupData;

            // Substitution logic
            if (!keepLast && visiblePopups.length > 0) {
                const lastVisiblePopup = visiblePopups[visiblePopups.length - 1];
                newPopup.replacedPopupId = lastVisiblePopup.id;

                return [
                    ...prev.map(p =>
                        p.id === lastVisiblePopup.id
                            ? { ...p, hidden: true }
                            : p
                    ),
                    newPopup
                ];
            }

            return [...prev, newPopup];
        });

        // Se newPopup não foi atribuído por algum erro interno, retorne null
        if (!newPopup) return null;

        // Execute onOpen callback
        if (settings.onOpen) {
            try {
                settings.onOpen(newPopup);
            } catch (error) {
                console.error(`Error in onOpen callback for popup ${popupId}:`, error);
            }
        }

        // Setup timeout
        if (settings.timeout && settings.timeout > 0) {
            const timeoutId = setTimeout(() => {
                closePopup(popupId, false); // HasAction false for timeout close
            }, settings.timeout);
            timeoutsRef.current.set(popupId, timeoutId);
        }

        // RETORNA O OBJETO COMPLETO
        return newPopup;
    };

    // ========== OPEN POPUP FUNCTION (Public API) - MODIFICADA ==========
    /**
     * @param {import("../utils/types").NtPopupType} popupType - The type of popup to open.
     * @param {PopupSettings} [settings={}] - Optional settings for the popup.
     * @returns {PopupData | null | Promise<PopupData | null>} - Returns a Promise resolving to the popup object (or null) if queued, or the popup object (or null) if opened immediately.
     */
    const openPopup = useCallback((popupType, settings = {}) => {
        if (isProcessingRef.current) {
            return new Promise((resolve) => {
                operationQueueRef.current.push(() => {
                    // Agora, openPopupImmediate retorna o objeto (ou null)
                    const popupObject = openPopupImmediate(popupType, settings);
                    resolve(popupObject); // Resolve a Promise com o objeto
                });
            });
        }
        // Retorna o objeto (ou null) diretamente
        return openPopupImmediate(popupType, settings);
    }, []);

    // ========== CLOSE ALL POPUPS FUNCTION (Atualizada) ==========
    const closeAllPopups = useCallback(() => {
        // Usamos uma abordagem assíncrona para que a animação seja executada
        // em todos os pop-ups visíveis antes de limpar o estado.
        const popupsToClose = currentPopupsRef.current.filter(p => !p.hidden && !p.isClosing);

        if (popupsToClose.length === 0) return;

        // 1. Marcar todos como isClosing
        setPopups(prev => prev.map(p => ({ ...p, isClosing: p.hidden ? p.isClosing : true })));

        // 2. Agendar remoção do estado e callbacks/cleanup (após a animação)
        setTimeout(() => {
            // @ts-ignore
            setPopups(prev => {
                // Executa callbacks e limpa para todos os popups que foram fechados
                popupsToClose.forEach(popup => {
                    const callbacks = callbacksRef.current.get(popup.id);
                    if (callbacks?.onClose) {
                        try {
                            callbacks.onClose(false, popup.id);
                        } catch (error) {
                            console.error(`Error in onClose callback for popup ${popup.id}:`, error);
                        }
                    }
                    callbacksRef.current.delete(popup.id);

                    const timeoutId = timeoutsRef.current.get(popup.id);
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutsRef.current.delete(popup.id);
                    }
                });

                // Restaura o overflow
                // document.querySelector("body").style.overflow = "";
                // document.querySelector("html").style.overflow = "";

                // Retorna um array vazio, limpando tudo
                return [];
            });
        }, CLOSE_ANIMATION_DURATION);

    }, []);

    // ========== UTILITY FUNCTIONS ==========
    const isPopupOpen = useCallback((popupId) => {
        return currentPopupsRef.current.some(p => p.id === popupId && !p.hidden && !p.isClosing);
    }, []);

    const getPopup = useCallback((popupId) => {
        const popup = currentPopupsRef.current.find(p => p.id === popupId);
        return popup && !popup.hidden && !popup.isClosing ? popup : null;
    }, []);

    // ========== EFFECT: OVERFLOW & EVENT LISTENERS ==========
    useEffect(() => {
        const visiblePopups = popups.filter(p => !p.hidden && !p.isClosing);
        const notClosedPopups = popups.filter(p => !p.isClosing);

        // Restore overflow
        if (notClosedPopups.length === 0) {
            document.querySelector("html").style.overflow = "";
            document.querySelector("body").style.overflow = "";
            document.querySelector("body").style.paddingRight = "";
            return;
        }

        // document.querySelector("html").style.overflow = "hidden";
        // document.querySelector("body").style.overflow = "hidden";

        const topPopup = visiblePopups[visiblePopups.length - 1];

        // KeyDown Handler (ESC)
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && topPopup.settings.closeOnEscape) {
                e.preventDefault();
                closePopup(topPopup.id, false);
            }
        };

        // Click Outside Handler
        const handleClickOutside = (event) => {
            if (!topPopup.settings.closeOnClickOutside) return;
            if (topPopup.settings.interactiveBackdrop) return;

            const popupElement = document.querySelector(`[data-popup-id="${topPopup.id}"]`);

            // Verifica se o clique foi fora do elemento e se o pop-up não está em processo de fechamento
            if (popupElement && !popupElement.contains(event.target) && !topPopup.isClosing) {
                closePopup(topPopup.id, false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
            // NOTA: A restauração final do overflow é feita pelo EFFECT: FINAL CLEANUP ou dentro do closePopup/closeAllPopups.
        };
    }, [popups, closePopup]);

    // ========== EFFECT: FINAL CLEANUP ==========
    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
            timeoutsRef.current.clear();
            callbacksRef.current.clear();

            document.querySelector("html").style.overflow = "";
            document.querySelector("body").style.overflow = "";
        };
    }, []);

    // ========== PROVIDER RENDERING ==========
    return (
        <PopupContext.Provider value={{
            popups: popups.filter(p => !p.hidden && !p.isClosing), // Filtra pop-ups fechando para API pública
            openPopup,
            closePopup,
            closeAllPopups,
            isPopupOpen,
            getPopup,
            updatePopup,
            language: activeLanguage,
            translate,
        }}>
            <DisplayPopup
                theme={theme}
                popups={popups.filter(p => !p.hidden)} // Passa pop-ups ocultos, mas não removidos, para DisplayPopup
                closePopup={closePopup}
                popupComponents={allPopupTypes}
                translate={translate}
            />
            {children}
        </PopupContext.Provider>
    );
}

// ==================== CUSTOM HOOK ====================
/**
 * Hook to easily access the NtPopup context for opening and closing popups, 
* and accessing language/translation features.
 * @returns {PopupContextValue}
 */
export const useNtPopups = () => {
    const context = useContext(PopupContext);

    if (!context) {
        throw new Error("useNtPopups must be used within an NtPopupProvider");
    }

    return context;
};