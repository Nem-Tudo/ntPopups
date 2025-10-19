import React from "react";

// Import all default CSS modules internally
import styles from "../styles/DisplayPopup.module.css";
import cropImageStyles from "../styles/CropImage.module.css";
// ... other specific styles (e.g., genericStyles, cropImageStyles)

// Internal map to link popup types to their specific CSS modules
const defaultCssModules = {
    "crop_image": cropImageStyles,
    // Add other specific popups here
};

/**
 * Component responsible for rendering all active popups.
 * @param {Object} properties
 * @param {import('../utils/types').PopupData[]} properties.popups - Array of active (visible) popups.
 * @param {Function} properties.closePopup - Function to close a specific popup.
 * @param {Object.<string, import("react").ComponentType<any>>} properties.popupComponents - Map of all registered components.
 * @param {boolean} properties.useDefaultCss - Flag to use default CSS.
 */
export default function DisplayPopup({ popups, closePopup, popupComponents, useDefaultCss }) {

    /**
     * Maps the popup type string to its corresponding React component.
     * @param {import('../utils/types').PopupData} popup - Popup object from context state.
     * @returns {React.ReactElement | null}
     */
    const getPopupComponent = (popup) => {
        const { popupType, settings, id } = popup;

        // Retrieve the component from the merged map
        const Component = popupComponents[popupType];

        if (!Component) {
            console.error(`ntPopups Error: Unknown popup type: ${popupType}`);
            return (
                <div style={{ padding: '20px', color: 'red' }}>
                    <h3>Error: Invalid popup type</h3>
                    <p>Type: {popupType}</p>
                    <button onClick={() => closePopup(id, false)}>Close</button>
                </div>
            );
        }

        // Prepare base props
        const componentProps = {
            closePopup: (status = false) => closePopup(id, status),
            ...settings,
        };

        // Conditional CSS injection
        if (useDefaultCss) {
            // Inject the main styles for common elements (title, scrollable, footer)
            componentProps.popupstyles = {
                ...styles, // Global styles for title/scrollable
                ...(defaultCssModules[popupType] || {}), // Specific styles (e.g., confirm buttons)
            };
        }

        // Return the component with prepared props
        return <Component {...componentProps} />;
    };

    return (
        <>
            {popups.map((popup) => (
                // OVERLAY/BACKDROP LAYER
                <section
                    key={popup.id}
                    // Apply default CSS class or custom fallback class
                    className={useDefaultCss ? styles.popups : "nt-popups-overlay"}
                    style={{ zIndex: popup.zIndex }}
                >
                    {/* POPUP CONTAINER */}
                    <div
                        data-popup-id={popup.id}
                        // Apply default CSS class or custom fallback class
                        className={useDefaultCss ? styles.popup : "nt-popup-container"}
                    >
                        {/* SPECIFIC POPUP CONTENT */}
                        {getPopupComponent(popup)}
                    </div>
                </section>
            ))}
        </>
    );
}