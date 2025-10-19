export type PopupData = {
    /**
     * - Unique identifier for the popup.
     */
    id: string;
    /**
     * - The type string used to map to a component.
     */
    popupType: string;
    /**
     * - All configuration passed to openPopup.
     */
    settings: any;
    /**
     * - CSS Z-index for layering.
     */
    zIndex: number;
    /**
     * - True if the popup is temporarily hidden (replaced).
     */
    hidden: boolean;
    /**
     * - ID of the popup that was replaced.
     */
    replacedPopupId: string | null;
};
export type PopupContextValue = {
    /**
     * - Array of currently active (visible) popups.
     */
    popups: PopupData[];
    /**
     * - Function to open a new popup. Returns the popup ID.
     */
    openPopup: (popupType: string, settings?: any) => Promise<string | null> | string | null;
    /**
     * - Function to close a specific or the topmost popup.
     */
    closePopup: (popupIdOrStatus?: string | boolean, statusParam?: boolean) => void;
    /**
     * - Function to close all popups.
     */
    closeAllPopups: () => void;
    /**
     * - Checks if a specific popup is open and visible.
     */
    isPopupOpen: (popupId: string) => boolean;
    /**
     * - Retrieves data for an active popup.
     */
    getPopup: (popupId: string) => PopupData | null;
};
export type NtPopupConfig = {
    /**
     * - Whether to use the library's default CSS.
     */
    useDefaultCss?: boolean;
    /**
     * - Global and type-specific default settings.
     */
    defaultSettings?: {
        all?: any;
    };
};
