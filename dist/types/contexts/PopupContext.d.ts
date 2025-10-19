/**
 * Provides the popup state and control functions to the application.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {NtPopupConfig} [props.config={}] - Global configuration for the popups.
 * @param {Object.<string, React.ComponentType>} [props.customPopups={}] - Map of user-defined React components { type: Component }.
 */
export function NtPopupProvider({ children, config, customPopups }: {
    children: React.ReactNode;
    config?: NtPopupConfig;
    customPopups?: {
        [x: string]: React.ComponentType;
    };
}): React.JSX.Element;
export function usePopup(): PopupContextValue;
export type PopupContextValue = import("../utils/types").PopupContextValue;
export type NtPopupConfig = import("../utils/types").NtPopupConfig;
import React from "react";
