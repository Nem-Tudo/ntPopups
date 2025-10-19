/**
 * Provides the popup state and control functions to the application.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {NtPopupConfig} [props.config={}] - Global configuration for the popups.
 * @param {Object.<string, React.ComponentType>} [props.customPopups={}] - Map of user-defined React components { type: Component }.
 * @param {'en'|'ptbr'|string} [props.language="en"] - The current language for internal popups (e.g., "en", "pt").
 * @param {'white'|'dark'} [props.theme="white"] - The current language for internal popups (e.g., "en", "pt").
 */
export function NtPopupProvider({ children, config, customPopups, language: propLanguage, theme }: {
    children: React.ReactNode;
    config?: NtPopupConfig;
    customPopups?: {
        [x: string]: React.ComponentType;
    };
    language?: "en" | "ptbr" | string;
    theme?: "white" | "dark";
}): React.JSX.Element;
export function useNtPopups(): ExtendedPopupContextValue;
export type PopupContextValue = import("../utils/types").PopupContextValue;
/**
 * // <-- NOVO: Usa o tipo completo e estendido
 */
export type ExtendedPopupContextValue = import("../utils/types").ExtendedPopupContextValue;
export type NtPopupConfig = import("../utils/types").NtPopupConfig;
import React from "react";
