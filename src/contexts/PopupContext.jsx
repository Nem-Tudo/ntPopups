// /src/contexts/PopupContext.jsx

"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import DisplayPopup from "../components/DisplayPopup.jsx";
import { internalPopupTypes } from "./popupTypes";

// IMPORTANTE: Certifique-se de que este caminho está correto.
// O arquivo '../utils/types' deve conter o typedef PopupContextValue.
/**
 * @typedef {import("../utils/types").PopupContextValue} PopupContextValue // <-- NOVO: Usa o tipo completo e estendido
 * @typedef {import("../utils/types").NtPopupConfig} NtPopupConfig
 */

import { getTranslation, defaultLanguage } from "../i18n/index";

// ==================== CONTEXT CREATION ====================

// O JSDoc AGORA USA O TIPO EXTENDIDO CORRETO
/** @type {React.Context<PopupContextValue>} */
const PopupContext = createContext({
    // Definir todos os valores padrão, incluindo os novos (language e translate)
    popups: [],
    openPopup: () => null,
    closePopup: () => { },
    closeAllPopups: () => { },
    isPopupOpen: () => false,
    getPopup: () => null,
    language: defaultLanguage,
    translate: (key) => `[${key}]`,
});

PopupContext.displayName = "NtPopupContext";

// ==================== PROVIDER COMPONENT ====================

/**
 * Provides the popup state and control functions to the application.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {NtPopupConfig} [props.config={}] - Global configuration for the popups.
 * @param {Object.<string, React.ComponentType>} [props.customPopups={}] - Map of user-defined React components { type: Component }.
 * @param {'en'|'ptbr'|string} [props.language="en"] - The current language for internal popups (e.g., "en", "pt").
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
    const originalOverflowRef = useRef(null);
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

    // ========== CLOSE POPUP FUNCTION ==========
    const closePopup = useCallback((popupIdOrHasAction, hasActionParam) => {
        setPopups(prev => {
            let popupId;
            let hasAction;

            // Parameter flexibility logic
            if (typeof popupIdOrHasAction === 'boolean') {
                popupId = prev[prev.length - 1]?.id;
                hasAction = popupIdOrHasAction;
            } else if (typeof popupIdOrHasAction === 'string' && typeof hasActionParam === 'boolean') {
                popupId = popupIdOrHasAction;
                hasAction = hasActionParam;
            } else if (typeof popupIdOrHasAction === 'string') {
                popupId = popupIdOrHasAction;
                hasAction = false;
            } else {
                popupId = prev[prev.length - 1]?.id;
                hasAction = false;
            }

            if (!popupId) return prev;

            const closingPopup = prev.find(p => p.id === popupId);
            if (!closingPopup) return prev;

            if (closingPopup.settings.requireAction && !hasAction) return prev;

            // Clear timeout
            const timeoutId = timeoutsRef.current.get(popupId);
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutsRef.current.delete(popupId);
            }

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

    // ========== OPEN POPUP FUNCTION (Public API) ==========
    const openPopup = useCallback((popupType, settings = {}) => {
        if (isProcessingRef.current) {
            return new Promise((resolve) => {
                operationQueueRef.current.push(() => {
                    const id = openPopupImmediate(popupType, settings);
                    resolve(id);
                });
            });
        }
        return openPopupImmediate(popupType, settings);
    }, []);

    // ========== OPEN POPUP FUNCTION (Immediate Logic) ==========
    const openPopupImmediate = (popupType, settings = {}) => {
        const popupId = settings.id || generatePopupId();
        const keepLast = settings.keepLast !== undefined ? settings.keepLast : false;

        if (currentPopupsRef.current.some(p => p.id === popupId)) {
            console.error(`ntPopups Error: Popup with id ${popupId} already exists`);
            return null;
        }

        // if (!allPopupTypes[popupType]) {
        //     console.error(`ntPopups Error: Unknown popup type "${popupType}"`);
        //     return null;
        // }

        callbacksRef.current.set(popupId, {
            onClose: settings.onClose,
            onOpen: settings.onOpen
        });

        const typeDefaults = defaultSettings[popupType] || {};

        setPopups(prev => {
            const visiblePopups = prev.filter(p => !p.hidden);

            const newPopup = {
                id: popupId,
                popupType,
                settings: {
                    // Default library settings (lowest priority)
                    closeOnEscape: true,
                    closeOnClickOutside: true,
                    keepLast: false,
                    requireAction: false,
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

        // Execute onOpen callback
        if (settings.onOpen) {
            try {
                settings.onOpen(popupId);
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

        return popupId;
    };

    // ========== CLOSE ALL POPUPS FUNCTION ==========
    const closeAllPopups = useCallback(() => {
        // ... (Close All Popups logic remains the same)
        setPopups(prev => {
            prev.filter(p => !p.hidden).forEach(popup => {
                // Execute onClose callback
                const callbacks = callbacksRef.current.get(popup.id);
                if (callbacks?.onClose) {
                    try {
                        callbacks.onClose(false, popup.id);
                    } catch (error) {
                        console.error(`Error in onClose callback for popup ${popup.id}:`, error);
                    }
                }
                callbacksRef.current.delete(popup.id);

                // Clear timeout
                const timeoutId = timeoutsRef.current.get(popup.id);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutsRef.current.delete(popup.id);
                }
            });

            return [];
        });
    }, []);

    // ========== UTILITY FUNCTIONS ==========
    const isPopupOpen = useCallback((popupId) => {
        return currentPopupsRef.current.some(p => p.id === popupId && !p.hidden);
    }, []);

    const getPopup = useCallback((popupId) => {
        const popup = currentPopupsRef.current.find(p => p.id === popupId);
        return popup && !popup.hidden ? popup : null;
    }, []);

    // ========== EFFECT: OVERFLOW & EVENT LISTENERS ==========
    useEffect(() => {
        const visiblePopups = popups.filter(p => !p.hidden);

        // Restore overflow
        if (visiblePopups.length === 0) {
            if (originalOverflowRef.current !== null) {
                document.body.style.overflow = originalOverflowRef.current;
                originalOverflowRef.current = null;
            }
            return;
        }

        // Lock scroll
        if (originalOverflowRef.current === null) {
            originalOverflowRef.current = document.body.style.overflow || 'unset';
        }
        document.body.style.overflow = 'hidden';

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

            const popupElement = document.querySelector(`[data-popup-id="${topPopup.id}"]`);

            if (popupElement && !popupElement.contains(event.target)) {
                closePopup(topPopup.id, false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popups, closePopup]);

    // ========== EFFECT: FINAL CLEANUP ==========
    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
            timeoutsRef.current.clear();
            callbacksRef.current.clear();
            if (originalOverflowRef.current !== null) {
                document.body.style.overflow = originalOverflowRef.current;
            }
        };
    }, []);

    // ========== PROVIDER RENDERING ==========
    return (
        <PopupContext.Provider value={{
            popups: popups.filter(p => !p.hidden), // <-- ESTA LINHA AGORA DEVE ESTAR CORRETA DEVIDO AO TYPEDEF
            openPopup,
            closePopup,
            closeAllPopups,
            isPopupOpen,
            getPopup,
            language: activeLanguage,
            translate,
        }}>
            <DisplayPopup
                theme={theme}
                popups={popups.filter(p => !p.hidden)}
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