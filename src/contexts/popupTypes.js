import Confirm from "../components/popups/Confirm.jsx";
import Generic from "../components/popups/Generic.jsx";
import CropImage from "../components/popups/CropImage.jsx";
import Form from "../components/popups/Form.jsx";
import HtmlPopup from "../components/popups/Html.jsx";

/**
 * Internal map of default popups provided by the library.
 * @type {Object.<string, import("react").ComponentType<any>>}
 */
export const internalPopupTypes = {
    "confirm": Confirm,
    "generic": Generic,
    "crop_image": CropImage,
    "form": Form,
    "html": HtmlPopup
};