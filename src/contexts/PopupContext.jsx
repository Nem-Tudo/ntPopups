"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import DisplayPopup from "../components/DisplayPopup.jsx";
import { internalPopupTypes } from "./popupTypes";
import { getTranslation, defaultLanguage } from "../i18n/index";

/**
 * @typedef {import("../utils/types").PopupContextValue} PopupContextValue
 * @typedef {import("../utils/types").NtPopupConfig} NtPopupConfig
 * @typedef {import("../utils/types").PopupData} PopupData
 * @typedef {import("../utils/types").PopupSettings} PopupSettings
 */

// ==================== CONSTANTS ====================
const CLOSE_ANIMATION_DURATION = 100;
const BASE_Z_INDEX = 1000;

// ==================== VALIDATION ====================
if (typeof createContext !== "function") {
    throw new Error(
        `ntPopups Error: NtPopupProvider and useNtPopups cannot be called on the server.\n` +
        `If you're in the App Router, ensure the component calling this function has "use client" at the top.`
    );
}

// ==================== CONTEXT CREATION ====================
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

// ==================== UTILITY FUNCTIONS ====================

/**
 * Gera um ID único para o popup
 * @returns {string}
 */
const generatePopupId = () => {
    return `ntpopup_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Encontra o último elemento que satisfaz a condição (polyfill para findLast)
 * @template T
 * @param {T[]} array
 * @param {(item: T) => boolean} predicate
 * @returns {T | undefined}
 */
const findLast = (array, predicate) => {
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i])) {
            return array[i];
        }
    }
    return undefined;
};
const getScrollbarWidth = () => {
    if(!window || !document) return 0;

    const windowWidth = window.innerWidth;

    const contentWidth = document.documentElement.clientWidth;

    return windowWidth - contentWidth;
};

/**
 * Desabilita o scroll da página e previne o "jump" visual
 * @param {boolean} allowScroll
 */
const togglePageScroll = (allowScroll) => {
    const body = document.querySelector("body");
    const html = document.querySelector("html");

    if (!body || !html) return;

    if (allowScroll) {
        html.style.overflow = "";
        body.style.overflow = "";
        body.style.paddingRight = "";
    } else {
        const hasVerticalScrollbar = document.documentElement.scrollHeight > window.innerHeight;

        if (hasVerticalScrollbar) {
            body.style.paddingRight = `${getScrollbarWidth()}px`;
        }

        body.style.overflow = "hidden";
        html.style.overflow = "hidden";
    }
};

/**
 * Mescla configurações de popup seguindo a hierarquia de prioridade
 * @param {object} globalDefaults
 * @param {object} typeDefaults
 * @param {object} userSettings
 * @param {string} popupId
 * @returns {PopupData["settings"]}
 */
const mergePopupSettings = (globalDefaults, typeDefaults, userSettings, popupId) => {
    return {
        // Library defaults (lowest priority)
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
        disableAnimation: false,
        // Global defaults from config
        ...globalDefaults,
        // Type-specific defaults
        ...typeDefaults,
        // User settings (highest priority)
        ...userSettings,
        // ID is immutable
        id: popupId,
    };
};

// ==================== PROVIDER COMPONENT ====================

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {NtPopupConfig} [props.config={}]
 * @param {Object.<string, React.ComponentType>} [props.customPopups={}]
 * @param {'en'|'ptbr'} [props.language="en"]
 * @param {'white'|'dark'} [props.theme="white"]
 */
export function NtPopupProvider({
    children,
    config = {},
    customPopups = {},
    language: propLanguage = defaultLanguage,
    theme = "white"
}) {
    // ========== STATE ==========
    const [popups, setPopups] = useState([]);

    // ========== REFS ==========
    const callbacksRef = useRef(new Map());
    const timeoutsRef = useRef(new Map());
    const currentPopupsRef = useRef([]);
    const closePopupRef = useRef(null);
    const operationQueueRef = useRef([]);
    const isProcessingRef = useRef(false);

    // ========== DERIVED VALUES ==========
    const activeLanguage = propLanguage || defaultLanguage;
    const allPopupTypes = { ...internalPopupTypes, ...customPopups };
    const { defaultSettings = {} } = config;
    const globalDefaults = defaultSettings.all || {};

    // ========== TRANSLATION ==========
    const translate = useCallback(
        (key) => getTranslation(key, activeLanguage),
        [activeLanguage]
    );

    // ========== INITIALIZATION ==========
    useEffect(() => {
        console.log(`Loaded ntPopups https://www.npmjs.com/package/ntpopups`);
    }, []);

    // ========== STATE SYNCHRONIZATION ==========
    useEffect(() => {
        currentPopupsRef.current = popups;
        processQueue();
    }, [popups]);

    // ========== QUEUE PROCESSING ==========
    const processQueue = () => {
        if (isProcessingRef.current || operationQueueRef.current.length === 0) {
            return;
        }

        isProcessingRef.current = true;

        requestAnimationFrame(() => {
            const operation = operationQueueRef.current.shift();
            if (operation) operation();

            isProcessingRef.current = false;

            if (operationQueueRef.current.length > 0) {
                processQueue();
            }
        });
    };

    // ========== CLEANUP HELPERS ==========
    const clearPopupCallbacks = useCallback((popupId) => {
        const callbacks = callbacksRef.current.get(popupId);
        callbacksRef.current.delete(popupId);
        return callbacks;
    }, []);

    const clearPopupTimeout = useCallback((popupId) => {
        const timeoutId = timeoutsRef.current.get(popupId);
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutsRef.current.delete(popupId);
        }
    }, []);

    const executeCallback = useCallback((callback, ...args) => {
        if (!callback) return;

        try {
            callback(...args);
        } catch (error) {
            console.error(`Error in popup callback:`, error);
        }
    }, []);

    // ========== REMOVE POPUP ==========
    const removePopupFromState = useCallback((popupId, hasAction) => {
        setPopups((prev) => {
            const closingPopup = prev.find((p) => p.id === popupId);
            if (!closingPopup) return prev;

            // Execute onClose callback
            const callbacks = clearPopupCallbacks(popupId);
            executeCallback(callbacks?.onClose, hasAction, popupId);

            // Clear timeout
            clearPopupTimeout(popupId);

            // Filter out the closing popup
            const filtered = prev.filter((p) => p.id !== popupId);

            // Restore replaced popup if exists
            if (closingPopup.replacedPopupId) {
                const replacedPopup = prev.find(
                    (p) => p.id === closingPopup.replacedPopupId && p.hidden
                );

                if (replacedPopup) {
                    return filtered.map((p) =>
                        p.id === replacedPopup.id
                            ? { ...p, hidden: false, zIndex: BASE_Z_INDEX + filtered.length }
                            : p
                    );
                }
            }

            return filtered;
        });
    }, [clearPopupCallbacks, clearPopupTimeout, executeCallback]);

    // ========== CLOSE POPUP ==========
    const closePopup = useCallback((popupIdOrHasAction, hasActionParam) => {
        setPopups((prev) => {
            let popupId;
            let hasAction;

            // Parameter flexibility
            if (typeof popupIdOrHasAction === "boolean") {
                const lastVisible = findLast(prev, (p) => !p.hidden);
                popupId = lastVisible?.id;
                hasAction = popupIdOrHasAction;
            } else if (typeof popupIdOrHasAction === "string" && typeof hasActionParam === "boolean") {
                popupId = popupIdOrHasAction;
                hasAction = hasActionParam;
            } else if (typeof popupIdOrHasAction === "string") {
                popupId = popupIdOrHasAction;
                hasAction = false;
            } else {
                const lastVisible = findLast(prev, (p) => !p.hidden);
                popupId = lastVisible?.id;
                hasAction = false;
            }

            if (!popupId) return prev;

            const closingPopup = prev.find((p) => p.id === popupId && !p.isClosing);
            if (!closingPopup) return prev;

            // Prevent closing if requireAction is true and no action was taken
            if (closingPopup.settings.requireAction && !hasAction) return prev;

            // Mark as closing
            const newState = prev.map((p) =>
                p.id === popupId ? { ...p, isClosing: true } : p
            );

            // Schedule removal after animation
            setTimeout(() => {
                removePopupFromState(popupId, hasAction);
            }, CLOSE_ANIMATION_DURATION);

            // Clear timeout since manual action is closing the popup
            clearPopupTimeout(popupId);

            return newState;
        });
    }, [removePopupFromState, clearPopupTimeout]);

    // Update closePopup ref
    useEffect(() => {
        closePopupRef.current = closePopup;
    }, [closePopup]);

    // ========== UPDATE POPUP ==========
    const updatePopup = useCallback((popupId, newSettings) => {
        let updatedPopup = null;

        setPopups((prev) => {
            const popupIndex = prev.findIndex((p) => p.id === popupId);

            if (popupIndex === -1 || prev[popupIndex].isClosing) {
                console.warn(`ntPopups Warning: Could not find open popup with id ${popupId} to update.`);
                return prev;
            }

            const currentPopup = prev[popupIndex];

            updatedPopup = {
                ...currentPopup,
                settings: {
                    ...currentPopup.settings,
                    ...newSettings,
                    id: popupId, // ID is immutable
                },
            };

            // Handle timeout changes
            if (newSettings.timeout !== undefined) {
                clearPopupTimeout(popupId);

                if (newSettings.timeout > 0) {
                    const timeoutId = setTimeout(() => {
                        closePopupRef.current?.(popupId, false);
                    }, newSettings.timeout);
                    timeoutsRef.current.set(popupId, timeoutId);
                }
            }

            const newState = [...prev];
            newState[popupIndex] = updatedPopup;
            return newState;
        });

        return updatedPopup;
    }, [clearPopupTimeout]);

    // ========== OPEN POPUP (IMMEDIATE) ==========
    const openPopupImmediate = useCallback((popupType, settings = {}) => {
        const popupId = settings.id || generatePopupId();

        // Check for duplicate ID
        if (currentPopupsRef.current.some((p) => p.id === popupId)) {
            console.error(`ntPopups Error: Popup with id ${popupId} already exists`);
            return null;
        }

        // Store callbacks
        callbacksRef.current.set(popupId, {
            onClose: settings.onClose,
            onOpen: settings.onOpen,
        });

        const typeDefaults = defaultSettings[popupType] || {};
        const visiblePopups = currentPopupsRef.current.filter((p) => !p.hidden && !p.isClosing);

        /** @type {PopupData} */
        const popupData = {
            id: popupId,
            popupType,
            isClosing: false,
            settings: mergePopupSettings(globalDefaults, typeDefaults, settings, popupId),
            zIndex: BASE_Z_INDEX + visiblePopups.length,
            replacedPopupId: null,
            hidden: false,
        };

        // Toggle page scroll
        try {
            if (!settings.allowPageBodyScroll) {
                togglePageScroll(false);
            }
        } catch (error) {
            console.warn("ntPopups Warning: Failed to disable page scroll.", error);
        }

        // Update state
        setPopups((prev) => {
            const keepLast = settings.keepLast !== undefined ? settings.keepLast : false;

            // Replace last visible popup if keepLast is false
            if (!keepLast && visiblePopups.length > 0) {
                const lastVisiblePopup = visiblePopups[visiblePopups.length - 1];
                popupData.replacedPopupId = lastVisiblePopup.id;

                return [
                    ...prev.map((p) =>
                        p.id === lastVisiblePopup.id ? { ...p, hidden: true } : p
                    ),
                    popupData,
                ];
            }

            return [...prev, popupData];
        });

        // Execute onOpen callback
        executeCallback(settings.onOpen, popupData);

        // Setup timeout
        if (popupData.settings.timeout > 0) {
            const timeoutId = setTimeout(() => {
                closePopupRef.current?.(popupId, false);
            }, popupData.settings.timeout);
            timeoutsRef.current.set(popupId, timeoutId);
        }

        return popupData;
    }, [defaultSettings, globalDefaults, executeCallback]);

    // ========== OPEN POPUP (PUBLIC API) ==========
    const openPopup = useCallback((popupType, settings = {}) => {
        if (isProcessingRef.current) {
            return new Promise((resolve) => {
                operationQueueRef.current.push(() => {
                    const popupObject = openPopupImmediate(popupType, settings);
                    resolve(popupObject);
                });
            });
        }

        return openPopupImmediate(popupType, settings);
    }, [openPopupImmediate]);

    // ========== CLOSE ALL POPUPS ==========
    const closeAllPopups = useCallback(() => {
        const popupsToClose = currentPopupsRef.current.filter((p) => !p.hidden && !p.isClosing);

        if (popupsToClose.length === 0) return;

        // Mark all as closing
        setPopups((prev) => prev.map((p) => ({ ...p, isClosing: p.hidden ? p.isClosing : true })));

        // Schedule removal
        setTimeout(() => {
            setPopups(() => {
                // Execute callbacks and cleanup
                popupsToClose.forEach((popup) => {
                    const callbacks = clearPopupCallbacks(popup.id);
                    executeCallback(callbacks?.onClose, false, popup.id);
                    clearPopupTimeout(popup.id);
                });

                return [];
            });
        }, CLOSE_ANIMATION_DURATION);
    }, [clearPopupCallbacks, clearPopupTimeout, executeCallback]);

    // ========== UTILITY FUNCTIONS ==========
    const isPopupOpen = useCallback((popupId) => {
        return currentPopupsRef.current.some((p) => p.id === popupId && !p.hidden && !p.isClosing);
    }, []);

    const getPopup = useCallback((popupId) => {
        const popup = currentPopupsRef.current.find((p) => p.id === popupId);
        return popup && !popup.hidden && !popup.isClosing ? popup : null;
    }, []);

    // ========== EVENT LISTENERS ==========
    useEffect(() => {
        const visiblePopups = popups.filter((p) => !p.hidden && !p.isClosing);
        const notClosedPopups = popups.filter((p) => !p.isClosing);

        // Restore scroll if no popups
        if (notClosedPopups.length === 0) {
            togglePageScroll(true);
            return;
        }

        const topPopup = visiblePopups[visiblePopups.length - 1];
        if (!topPopup) return;

        // ESC key handler
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && topPopup.settings.closeOnEscape) {
                e.preventDefault();
                closePopup(topPopup.id, false);
            }
        };

        // Click outside handler
        const handleClickOutside = (event) => {
            if (!topPopup.settings.closeOnClickOutside) return;
            if (topPopup.settings.interactiveBackdrop) return;

            const popupElement = document.querySelector(`[data-popup-id="${topPopup.id}"]`);

            if (popupElement && !popupElement.contains(event.target) && !topPopup.isClosing) {
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

    // ========== FINAL CLEANUP ==========
    useEffect(() => {
        return () => {
            timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
            timeoutsRef.current.clear();
            callbacksRef.current.clear();
            togglePageScroll(true);
        };
    }, []);

    // ========== RENDER ==========
    return (
        <PopupContext.Provider
            value={{
                popups: popups.filter((p) => !p.hidden && !p.isClosing),
                openPopup,
                closePopup,
                closeAllPopups,
                isPopupOpen,
                getPopup,
                updatePopup,
                language: activeLanguage,
                translate,
            }}
        >
            <DisplayPopup
                theme={theme}
                popups={popups.filter((p) => !p.hidden)}
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
 * @returns {PopupContextValue}
 */
export const useNtPopups = () => {
    const context = useContext(PopupContext);

    if (!context) {
        throw new Error("useNtPopups must be used within an NtPopupProvider");
    }

    return context;
};