'use strict';

var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var React = require('react');

var styles = {"popups":"DisplayPopup-module_popups__I0GYe","popup":"DisplayPopup-module_popup__CPKwW","openPopup":"DisplayPopup-module_openPopup__D6bL1","title":"DisplayPopup-module_title__QZoYi","scrollable":"DisplayPopup-module_scrollable__vSKNW","footer":"DisplayPopup-module_footer__-jSvA","baseButton":"DisplayPopup-module_baseButton__VwdjL","closeButton":"DisplayPopup-module_closeButton__katlY"};

var cropImageStyles = {};

function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
// ... other specific styles (e.g., genericStyles, cropImageStyles)

// Internal map to link popup types to their specific CSS modules
var defaultCssModules = {
  "crop_image": cropImageStyles
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
function DisplayPopup(_ref) {
  var popups = _ref.popups,
    _closePopup = _ref.closePopup,
    popupComponents = _ref.popupComponents,
    useDefaultCss = _ref.useDefaultCss;
  /**
   * Maps the popup type string to its corresponding React component.
   * @param {import('../utils/types').PopupData} popup - Popup object from context state.
   * @returns {React.ReactElement | null}
   */
  var getPopupComponent = function getPopupComponent(popup) {
    var popupType = popup.popupType,
      settings = popup.settings,
      id = popup.id;

    // Retrieve the component from the merged map
    var Component = popupComponents[popupType];
    if (!Component) {
      console.error("ntPopups Error: Unknown popup type: ".concat(popupType));
      return /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '20px',
          color: 'red'
        }
      }, /*#__PURE__*/React.createElement("h3", null, "Error: Invalid popup type"), /*#__PURE__*/React.createElement("p", null, "Type: ", popupType), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          return _closePopup(id, false);
        }
      }, "Close"));
    }

    // Prepare base props
    var componentProps = _objectSpread$1({
      closePopup: function closePopup() {
        var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        return _closePopup(id, status);
      }
    }, settings);

    // Conditional CSS injection
    if (useDefaultCss) {
      // Inject the main styles for common elements (title, scrollable, footer)
      componentProps.popupstyles = _objectSpread$1(_objectSpread$1({}, styles), defaultCssModules[popupType] || {});
    }

    // Return the component with prepared props
    return /*#__PURE__*/React.createElement(Component, componentProps);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, popups.map(function (popup) {
    return (
      /*#__PURE__*/
      // OVERLAY/BACKDROP LAYER
      React.createElement("section", {
        key: popup.id
        // Apply default CSS class or custom fallback class
        ,
        className: useDefaultCss ? styles.popups : "nt-popups-overlay",
        style: {
          zIndex: popup.zIndex
        }
      }, /*#__PURE__*/React.createElement("div", {
        "data-popup-id": popup.id
        // Apply default CSS class or custom fallback class
        ,
        className: useDefaultCss ? styles.popup : "nt-popup-container"
      }, getPopupComponent(popup)))
    );
  }));
}

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = React.createContext && React.createContext(DefaultContext);

var __assign = undefined && undefined.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __rest = undefined && undefined.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function Tree2Element(tree) {
  return tree && tree.map(function (node, i) {
    return React.createElement(node.tag, __assign({
      key: i
    }, node.attr), Tree2Element(node.child));
  });
}
function GenIcon(data) {
  // eslint-disable-next-line react/display-name
  return function (props) {
    return React.createElement(IconBase, __assign({
      attr: __assign({}, data.attr)
    }, props), Tree2Element(data.child));
  };
}
function IconBase(props) {
  var elem = function (conf) {
    var attr = props.attr,
      size = props.size,
      title = props.title,
      svgProps = __rest(props, ["attr", "size", "title"]);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return React.createElement("svg", __assign({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: __assign(__assign({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && React.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? React.createElement(IconContext.Consumer, null, function (conf) {
    return elem(conf);
  }) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function CiCircleAlert (props) {
  return GenIcon({"attr":{"viewBox":"0 0 24 24"},"child":[{"tag":"g","attr":{"id":"Circle_Alert"},"child":[{"tag":"g","attr":{},"child":[{"tag":"g","attr":{},"child":[{"tag":"path","attr":{"d":"M12.5,9a.5.5,0,0,0-1,0h0V13.02a.5.5,0,0,0,1,0Z"}},{"tag":"circle","attr":{"cx":"12","cy":"15.001","r":"0.5"}}]},{"tag":"path","attr":{"d":"M12,21.935A9.933,9.933,0,1,1,21.934,12,9.945,9.945,0,0,1,12,21.935ZM12,3.069A8.933,8.933,0,1,0,20.934,12,8.944,8.944,0,0,0,12,3.069Z"}}]}]}]})(props);
}

/**
 * Default Confirmation Popup Component.
 * @param {Object} properties
 * @param {(status: boolean) => void} properties.closePopup
 * @param {string} properties.message
 * @param {string} [properties.title="Message"]
 * @param {string} [properties.cancelLabel="Cancel"]
 * @param {string} [properties.confirmLabel="Confirm"]
 * @param {(choice: boolean) => void} [properties.onChoose=() => {}]
 * @param {Object} [properties.popupstyles]
 */
function Confirm(_ref) {
  var closePopup = _ref.closePopup,
    _ref$message = _ref.message,
    message = _ref$message === void 0 ? "Message" : _ref$message,
    _ref$title = _ref.title,
    title = _ref$title === void 0 ? "Title" : _ref$title,
    _ref$cancelLabel = _ref.cancelLabel,
    cancelLabel = _ref$cancelLabel === void 0 ? "Cancel" : _ref$cancelLabel,
    _ref$confirmLabel = _ref.confirmLabel,
    confirmLabel = _ref$confirmLabel === void 0 ? "Confirm" : _ref$confirmLabel,
    _ref$onChoose = _ref.onChoose,
    onChoose = _ref$onChoose === void 0 ? function () {} : _ref$onChoose,
    _ref$popupstyles = _ref.popupstyles,
    popupstyles = _ref$popupstyles === void 0 ? {} : _ref$popupstyles;
  // Use generic or injected classes
  var classes = {
    title: popupstyles.title || "nt-popup-title",
    scrollable: popupstyles.scrollable || "nt-popup-scrollable",
    footer: popupstyles.footer || "nt-popup-footer",
    cancelButton: popupstyles.cancelButton || "nt-cancel-button",
    confirmButton: popupstyles.confirmButton || "nt-confirm-button"
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classes.title
  }, /*#__PURE__*/React.createElement(CiCircleAlert, null), title), /*#__PURE__*/React.createElement("div", {
    className: classes.scrollable
  }, /*#__PURE__*/React.createElement("p", null, message)), /*#__PURE__*/React.createElement("div", {
    className: classes.footer
  }, /*#__PURE__*/React.createElement("button", {
    className: classes.cancelButton,
    onClick: function onClick() {
      closePopup(true); // Intentional close
      onChoose(false); // User chose Cancel
    }
  }, cancelLabel), /*#__PURE__*/React.createElement("button", {
    className: classes.confirmButton,
    onClick: function onClick() {
      closePopup(true); // Intentional close
      onChoose(true); // User chose Confirm
    }
  }, confirmLabel)));
}

/**
 * Default Generic Message Popup Component.
 * @param {Object} properties
 * @param {(status: boolean) => void} properties.closePopup
 * @param {string} properties.message
 * @param {string} [properties.title="Message"]
 * @param {string} [properties.closeLabel="Cancel"]
 * @param {Object} [properties.popupstyles]
 */
function Generic(_ref) {
  var closePopup = _ref.closePopup,
    _ref$message = _ref.message,
    message = _ref$message === void 0 ? "Message" : _ref$message,
    _ref$title = _ref.title,
    title = _ref$title === void 0 ? "Title" : _ref$title,
    _ref$closeLabel = _ref.closeLabel,
    closeLabel = _ref$closeLabel === void 0 ? "Close" : _ref$closeLabel,
    _ref$popupstyles = _ref.popupstyles,
    popupstyles = _ref$popupstyles === void 0 ? {} : _ref$popupstyles;
  var classes = {
    title: popupstyles.title || "nt-popup-title",
    scrollable: popupstyles.scrollable || "nt-popup-scrollable",
    footer: popupstyles.footer || "nt-popup-footer",
    closeButton: popupstyles.closeButton || "nt-close-button"
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classes.title
  }, title), /*#__PURE__*/React.createElement("div", {
    className: classes.scrollable
  }, /*#__PURE__*/React.createElement("p", null, message)), /*#__PURE__*/React.createElement("div", {
    className: classes.footer
  }, /*#__PURE__*/React.createElement("button", {
    className: classes.closeButton,
    onClick: function onClick() {
      return closePopup(true);
    }
  }, closeLabel)));
}

// This component would contain image cropping logic and UI

/**
 * Placeholder for Crop Image Popup Component.
 * @param {Object} properties
 * @param {(status: boolean) => void} properties.closePopup
 * @param {string} properties.title
 * @param {Object} [properties.popupstyles]
 */
function CropImage(_ref) {
  var closePopup = _ref.closePopup,
    _ref$title = _ref.title,
    title = _ref$title === void 0 ? "Crop Image" : _ref$title,
    _ref$popupstyles = _ref.popupstyles,
    popupstyles = _ref$popupstyles === void 0 ? {} : _ref$popupstyles;
  var classes = {
    title: popupstyles.title || "nt-popup-title",
    scrollable: popupstyles.scrollable || "nt-popup-scrollable"
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classes.title
  }, title), /*#__PURE__*/React.createElement("div", {
    className: classes.scrollable,
    style: {
      minHeight: '300px'
    }
  }, /*#__PURE__*/React.createElement("p", null, "Image cropping interface goes here."), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return closePopup(true);
    }
  }, "Done")));
}

/**
 * Internal map of default popups provided by the library.
 * @type {Object.<string, import("react").ComponentType<any>>}
 */
var internalPopupTypes = {
  "confirm": Confirm,
  "generic": Generic,
  "crop_image": CropImage
};

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }

/**
 * @typedef {import("../utils/types").PopupContextValue} PopupContextValue 
 * @typedef {import("../utils/types").NtPopupConfig} NtPopupConfig
 */

// ==================== CONTEXT CREATION ====================

// O JSDoc usa o typedef acima
/** @type {React.Context<PopupContextValue>} */
var PopupContext = /*#__PURE__*/React.createContext({
  popups: [],
  openPopup: function openPopup() {
    return null;
  },
  closePopup: function closePopup() {},
  closeAllPopups: function closeAllPopups() {},
  isPopupOpen: function isPopupOpen() {
    return false;
  },
  getPopup: function getPopup() {
    return null;
  }
});
PopupContext.displayName = "NtPopupContext";

// ==================== PROVIDER COMPONENT ====================

/**
 * Provides the popup state and control functions to the application.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {NtPopupConfig} [props.config={}] - Global configuration for the popups.
 * @param {Object.<string, React.ComponentType>} [props.customPopups={}] - Map of user-defined React components { type: Component }.
 */
function NtPopupProvider(_ref) {
  var children = _ref.children,
    _ref$config = _ref.config,
    config = _ref$config === void 0 ? {} : _ref$config,
    _ref$customPopups = _ref.customPopups,
    customPopups = _ref$customPopups === void 0 ? {} : _ref$customPopups;
  var _useState = React.useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    popups = _useState2[0],
    setPopups = _useState2[1];

  // Refs for persistence
  var callbacksRef = React.useRef(new Map()); // popupId -> { onClose, onOpen }
  var timeoutsRef = React.useRef(new Map()); // popupId -> timeoutId
  var originalOverflowRef = React.useRef(null);
  var currentPopupsRef = React.useRef([]);

  // Queue system for race condition prevention
  var operationQueueRef = React.useRef([]);
  var isProcessingRef = React.useRef(false);

  // Merge internal popups with user-defined custom popups
  var allPopupTypes = _objectSpread(_objectSpread({}, internalPopupTypes), customPopups);

  // Configuration parsing
  var _config$useDefaultCss = config.useDefaultCss,
    useDefaultCss = _config$useDefaultCss === void 0 ? true : _config$useDefaultCss,
    _config$defaultSettin = config.defaultSettings,
    defaultSettings = _config$defaultSettin === void 0 ? {} : _config$defaultSettin;
  var globalDefaults = defaultSettings.all || {};

  // ========== STATE SYNCHRONIZATION AND QUEUE PROCESSING ==========
  React.useEffect(function () {
    currentPopupsRef.current = popups;
    _processQueue();
  }, [popups]);
  var _processQueue = function processQueue() {
    if (isProcessingRef.current || operationQueueRef.current.length === 0) {
      return;
    }
    isProcessingRef.current = true;
    requestAnimationFrame(function () {
      var operation = operationQueueRef.current.shift();
      if (operation) {
        operation();
      }
      isProcessingRef.current = false;
      if (operationQueueRef.current.length > 0) {
        _processQueue();
      }
    });
  };

  // ========== UNIQUE ID GENERATION ==========
  var generatePopupId = function generatePopupId() {
    return "ntpopup_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 9));
  };

  // ========== CLOSE POPUP FUNCTION ==========
  var closePopup = React.useCallback(function (popupIdOrStatus, statusParam) {
    setPopups(function (prev) {
      var popupId;
      var status;

      // Parameter flexibility logic
      if (typeof popupIdOrStatus === 'boolean') {
        var _prev;
        popupId = (_prev = prev[prev.length - 1]) === null || _prev === void 0 ? void 0 : _prev.id;
        status = popupIdOrStatus;
      } else if (typeof popupIdOrStatus === 'string' && typeof statusParam === 'boolean') {
        popupId = popupIdOrStatus;
        status = statusParam;
      } else if (typeof popupIdOrStatus === 'string') {
        popupId = popupIdOrStatus;
        status = false;
      } else {
        var _prev2;
        popupId = (_prev2 = prev[prev.length - 1]) === null || _prev2 === void 0 ? void 0 : _prev2.id;
        status = false;
      }
      if (!popupId) return prev;
      var closingPopup = prev.find(function (p) {
        return p.id === popupId;
      });
      if (!closingPopup) return prev;

      // Clear timeout
      var timeoutId = timeoutsRef.current.get(popupId);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutsRef.current["delete"](popupId);
      }

      // Execute onClose callback
      var callbacks = callbacksRef.current.get(popupId);
      if (callbacks !== null && callbacks !== void 0 && callbacks.onClose) {
        try {
          // status is passed to the onClose/onChoose handler
          callbacks.onClose(status, popupId);
        } catch (error) {
          console.error("Error in onClose callback for popup ".concat(popupId, ":"), error);
        }
      }
      callbacksRef.current["delete"](popupId);
      var filtered = prev.filter(function (p) {
        return p.id !== popupId;
      });

      // Restore replaced popup logic
      if (closingPopup.replacedPopupId) {
        var replacedPopup = prev.find(function (p) {
          return p.id === closingPopup.replacedPopupId && p.hidden;
        });
        if (replacedPopup) {
          // Make the replaced popup visible again with updated zIndex
          return filtered.map(function (p) {
            return p.id === replacedPopup.id ? _objectSpread(_objectSpread({}, p), {}, {
              hidden: false,
              zIndex: 1000 + filtered.length
            }) : p;
          });
        }
      }
      return filtered;
    });
  }, []);

  // ========== OPEN POPUP FUNCTION (Public API) ==========
  var openPopup = React.useCallback(function (popupType) {
    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (isProcessingRef.current) {
      return new Promise(function (resolve) {
        operationQueueRef.current.push(function () {
          var id = openPopupImmediate(popupType, settings);
          resolve(id);
        });
      });
    }
    return openPopupImmediate(popupType, settings);
  }, []);

  // ========== OPEN POPUP FUNCTION (Immediate Logic) ==========
  var openPopupImmediate = function openPopupImmediate(popupType) {
    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var popupId = settings.id || generatePopupId();
    var keepLast = settings.keepLast !== undefined ? settings.keepLast : false;
    if (currentPopupsRef.current.some(function (p) {
      return p.id === popupId;
    })) {
      console.error("ntPopups Error: Popup with id ".concat(popupId, " already exists"));
      return null;
    }
    if (!allPopupTypes[popupType]) {
      console.error("ntPopups Error: Unknown popup type \"".concat(popupType, "\""));
      return null;
    }
    callbacksRef.current.set(popupId, {
      onClose: settings.onClose || settings.onChoose,
      // onChoose is an alias for onClose for Confirm type
      onOpen: settings.onOpen
    });
    var typeDefaults = defaultSettings[popupType] || {};
    setPopups(function (prev) {
      var visiblePopups = prev.filter(function (p) {
        return !p.hidden;
      });
      var newPopup = {
        id: popupId,
        popupType: popupType,
        settings: _objectSpread(_objectSpread(_objectSpread(_objectSpread({
          // Default library settings (lowest priority)
          closeOnEscape: true,
          closeOnClickOutside: true,
          keepLast: false
        }, globalDefaults), typeDefaults), settings), {}, {
          id: popupId
        }),
        zIndex: 1000 + visiblePopups.length,
        replacedPopupId: null,
        hidden: false
      };

      // Substitution logic
      if (!keepLast && visiblePopups.length > 0) {
        var lastVisiblePopup = visiblePopups[visiblePopups.length - 1];
        newPopup.replacedPopupId = lastVisiblePopup.id;
        return [].concat(_toConsumableArray(prev.map(function (p) {
          return p.id === lastVisiblePopup.id ? _objectSpread(_objectSpread({}, p), {}, {
            hidden: true
          }) : p;
        })), [newPopup]);
      }
      return [].concat(_toConsumableArray(prev), [newPopup]);
    });

    // Execute onOpen callback
    if (settings.onOpen) {
      try {
        settings.onOpen(popupId);
      } catch (error) {
        console.error("Error in onOpen callback for popup ".concat(popupId, ":"), error);
      }
    }

    // Setup timeout
    if (settings.timeout && settings.timeout > 0) {
      var timeoutId = setTimeout(function () {
        closePopup(popupId, false); // Status false for timeout close
      }, settings.timeout);
      timeoutsRef.current.set(popupId, timeoutId);
    }
    return popupId;
  };

  // ========== CLOSE ALL POPUPS FUNCTION ==========
  var closeAllPopups = React.useCallback(function () {
    // ... (Close All Popups logic remains the same)
    setPopups(function (prev) {
      prev.filter(function (p) {
        return !p.hidden;
      }).forEach(function (popup) {
        // Execute onClose callback
        var callbacks = callbacksRef.current.get(popup.id);
        if (callbacks !== null && callbacks !== void 0 && callbacks.onClose) {
          try {
            callbacks.onClose(false, popup.id);
          } catch (error) {
            console.error("Error in onClose callback for popup ".concat(popup.id, ":"), error);
          }
        }
        callbacksRef.current["delete"](popup.id);

        // Clear timeout
        var timeoutId = timeoutsRef.current.get(popup.id);
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutsRef.current["delete"](popup.id);
        }
      });
      return [];
    });
  }, []);

  // ========== UTILITY FUNCTIONS ==========
  var isPopupOpen = React.useCallback(function (popupId) {
    return currentPopupsRef.current.some(function (p) {
      return p.id === popupId && !p.hidden;
    });
  }, []);
  var getPopup = React.useCallback(function (popupId) {
    var popup = currentPopupsRef.current.find(function (p) {
      return p.id === popupId;
    });
    return popup && !popup.hidden ? popup : null;
  }, []);

  // ========== EFFECT: OVERFLOW & EVENT LISTENERS ==========
  React.useEffect(function () {
    var visiblePopups = popups.filter(function (p) {
      return !p.hidden;
    });

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
    var topPopup = visiblePopups[visiblePopups.length - 1];

    // KeyDown Handler (ESC)
    var handleKeyDown = function handleKeyDown(e) {
      if (e.key === "Escape" && topPopup.settings.closeOnEscape) {
        e.preventDefault();
        closePopup(topPopup.id, false);
      }
    };

    // Click Outside Handler
    var handleClickOutside = function handleClickOutside(event) {
      if (!topPopup.settings.closeOnClickOutside) return;
      var popupElement = document.querySelector("[data-popup-id=\"".concat(topPopup.id, "\"]"));
      if (popupElement && !popupElement.contains(event.target)) {
        closePopup(topPopup.id, false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return function () {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popups, closePopup]);

  // ========== EFFECT: FINAL CLEANUP ==========
  React.useEffect(function () {
    return function () {
      timeoutsRef.current.forEach(function (timeoutId) {
        return clearTimeout(timeoutId);
      });
      timeoutsRef.current.clear();
      callbacksRef.current.clear();
      if (originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current;
      }
    };
  }, []);

  // ========== PROVIDER RENDERING ==========
  return /*#__PURE__*/React.createElement(PopupContext.Provider, {
    value: {
      popups: popups.filter(function (p) {
        return !p.hidden;
      }),
      openPopup: openPopup,
      closePopup: closePopup,
      closeAllPopups: closeAllPopups,
      isPopupOpen: isPopupOpen,
      getPopup: getPopup
    }
  }, /*#__PURE__*/React.createElement(DisplayPopup, {
    popups: popups.filter(function (p) {
      return !p.hidden;
    }),
    closePopup: closePopup,
    popupComponents: allPopupTypes // Pass all registered components
    ,
    useDefaultCss: useDefaultCss // Pass CSS configuration
  }), children);
}

// ==================== CUSTOM HOOK ====================
/**
 * Hook to easily access the NtPopup context for opening and closing popups.
 * @returns {PopupContextValue}
 */
var usePopup = function usePopup() {
  var context = React.useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within an NtPopupProvider");
  }
  return context;
};

exports.NtPopupProvider = NtPopupProvider;
exports.usePopup = usePopup;
