import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { createContext, useState, useCallback, useRef, useEffect, useContext } from 'react';

var styles = {"popups":"DisplayPopup-module_popups__I0GYe","nt-popups-dark-theme":"DisplayPopup-module_nt-popups-dark-theme__66X2I","popup":"DisplayPopup-module_popup__CPKwW","openPopup":"DisplayPopup-module_openPopup__D6bL1","title":"DisplayPopup-module_title__QZoYi","scrollable":"DisplayPopup-module_scrollable__vSKNW","footer":"DisplayPopup-module_footer__-jSvA","baseButton":"DisplayPopup-module_baseButton__VwdjL","closeButton":"DisplayPopup-module_closeButton__katlY","cancelButton":"DisplayPopup-module_cancelButton__AqkPf"};

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
 * @param {(key: string) => string} properties.translate - Function to translate strings (passada do Provider). <-- NOVA PROP
 * @param {String} properties.theme - Theme
 */
function DisplayPopup(_ref) {
  var popups = _ref.popups,
    _closePopup = _ref.closePopup,
    popupComponents = _ref.popupComponents,
    translate = _ref.translate,
    theme = _ref.theme;
  // <-- RECEBE NOVA PROP

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
      }, /*#__PURE__*/React.createElement("h3", null, translate('internalError.title')), /*#__PURE__*/React.createElement("p", null, translate('internalError.message'), " ", popupType), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          return _closePopup(id, false);
        }
      }, translate('util.closeLabel')));
    }

    // Prepare base props
    var componentProps = _objectSpread$1(_objectSpread$1({
      closePopup: function closePopup() {
        var hasAction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        return _closePopup(id, hasAction);
      }
    }, settings), {}, {
      translate: translate // <-- INJETA A FUNÇÃO DE TRADUÇÃO NO COMPONENTE
    });

    // Inject the main styles for common elements (title, scrollable, footer)
    componentProps.popupstyles = _objectSpread$1(_objectSpread$1({}, styles), defaultCssModules[popupType] || {});

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
        className: "".concat(styles.popups).concat(theme != "white" ? " ".concat(styles["nt-popups-".concat(theme, "-theme")], " ") : " ", "ntpopups-overlay"),
        style: {
          zIndex: popup.zIndex
        }
      }, /*#__PURE__*/React.createElement("div", {
        "data-popup-id": popup.id
        // Apply default CSS class or custom fallback class
        ,
        className: "".concat(styles.popup, " ntpopups-container")
      }, getPopupComponent(popup)))
    );
  }));
}

// /src/components/popups/Confirm.jsx


/**
 * Default Confirmation Popup Component.
 * @param {Object} properties
 * @param {(hasAction: boolean) => void} properties.closePopup
 * @param {(key: string) => string} properties.translate
 * @param {Object} [properties.data]
 * @param {string} [properties.data.message] // Remove default string here
 * @param {string} [properties.data.title] // Remove default string here
 * @param {string} [properties.data.cancelLabel] // Remove default string here
 * @param {string} [properties.data.confirmLabel] // Remove default string here
 * @param {string|React.ReactElement} [properties.data.icon="ⓘ"]
 * @param {(choice: boolean) => void} [properties.data.onChoose=() => {}]
 * @param {Object} [properties.popupstyles]
 */
function Confirm(_ref) {
  var closePopup = _ref.closePopup,
    _ref$popupstyles = _ref.popupstyles,
    popupstyles = _ref$popupstyles === void 0 ? {} : _ref$popupstyles,
    translate = _ref.translate,
    _ref$data = _ref.data,
    _ref$data2 = _ref$data === void 0 ? {} : _ref$data,
    message = _ref$data2.message,
    title = _ref$data2.title,
    cancelLabel = _ref$data2.cancelLabel,
    confirmLabel = _ref$data2.confirmLabel,
    _ref$data2$icon = _ref$data2.icon,
    icon = _ref$data2$icon === void 0 ? "ⓘ" : _ref$data2$icon,
    _ref$data2$onChoose = _ref$data2.onChoose,
    onChoose = _ref$data2$onChoose === void 0 ? function () {} : _ref$data2$onChoose;
  var finalTitle = title !== null && title !== void 0 ? title : translate('confirm.title');
  var finalMessage = message !== null && message !== void 0 ? message : translate('confirm.message');
  var finalCancelLabel = cancelLabel !== null && cancelLabel !== void 0 ? cancelLabel : translate('util.cancelLabel');
  var finalConfirmLabel = confirmLabel !== null && confirmLabel !== void 0 ? confirmLabel : translate('util.confirmLabel');

  // Use generic or injected classes
  var classes = {
    // ... (classes permanecem as mesmas)
    title: "".concat(popupstyles.title, " ntpopups-title"),
    icon: "".concat(popupstyles.icon, " ntpopups-icon"),
    scrollable: "".concat(popupstyles.scrollable, " ntpopups-scrollable"),
    footer: "".concat(popupstyles.footer, " ntpopups-footer"),
    cancelButton: "".concat(popupstyles.baseButton, " ").concat(popupstyles.cancelButton, " ntpopups-basebutton ntpopups-cancel-button"),
    confirmButton: "".concat(popupstyles.baseButton, " ").concat(popupstyles.confirmButton, " ntpopups-basebutton ntpopups-confirm-button")
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classes.title
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.icon
  }, icon), finalTitle, " "), /*#__PURE__*/React.createElement("div", {
    className: classes.scrollable
  }, /*#__PURE__*/React.createElement("p", null, finalMessage), " "), /*#__PURE__*/React.createElement("div", {
    className: classes.footer
  }, /*#__PURE__*/React.createElement("button", {
    className: classes.cancelButton,
    onClick: function onClick() {
      closePopup(true); // Intentional close
      onChoose(false); // User chose Cancel
    }
  }, finalCancelLabel, " "), /*#__PURE__*/React.createElement("button", {
    className: classes.confirmButton,
    onClick: function onClick() {
      closePopup(true); // Intentional close
      onChoose(true); // User chose Confirm
    }
  }, finalConfirmLabel, " ")));
}

/**
 * Default Generic Message Popup Component.
 * @param {Object} properties
 * @param {(hasAction: boolean) => void} properties.closePopup
 * @param {Object} [properties.popupstyles]
 * @param {(key: string) => string} properties.translate
 * @param {Object} [properties.data]
 * @param {string} [properties.data.message="Message"]
 * @param {string} [properties.data.title="Title"]
 * @param {string} [properties.data.closeLabel="Close"]
 * @param {string|React.ReactElement} [properties.data.icon="ⓘ"]
 */
function Generic(_ref) {
  var closePopup = _ref.closePopup,
    _ref$popupstyles = _ref.popupstyles,
    popupstyles = _ref$popupstyles === void 0 ? {} : _ref$popupstyles,
    translate = _ref.translate,
    _ref$data = _ref.data,
    _ref$data2 = _ref$data === void 0 ? {} : _ref$data,
    message = _ref$data2.message,
    title = _ref$data2.title,
    closeLabel = _ref$data2.closeLabel,
    _ref$data2$icon = _ref$data2.icon,
    icon = _ref$data2$icon === void 0 ? "ⓘ" : _ref$data2$icon;
  var finalTitle = title !== null && title !== void 0 ? title : translate('generic.title');
  var finalMessage = message !== null && message !== void 0 ? message : translate('generic.message');
  var finalCloseLabel = closeLabel !== null && closeLabel !== void 0 ? closeLabel : translate('util.ok');
  var classes = {
    title: "".concat(popupstyles.title, " ntpopups-title"),
    icon: "".concat(popupstyles.icon, " ntpopups-icon"),
    scrollable: "".concat(popupstyles.scrollable, " ntpopups-scrollable"),
    footer: "".concat(popupstyles.footer, " ntpopups-footer"),
    closeButton: "".concat(popupstyles.baseButton, " ntpopups-basebutton")
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: classes.title
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.icon
  }, icon), finalTitle), /*#__PURE__*/React.createElement("div", {
    className: classes.scrollable
  }, /*#__PURE__*/React.createElement("p", null, finalMessage)), /*#__PURE__*/React.createElement("div", {
    className: classes.footer
  }, /*#__PURE__*/React.createElement("button", {
    className: classes.closeButton,
    onClick: function onClick() {
      return closePopup(true);
    }
  }, finalCloseLabel)));
}

// This component would contain image cropping logic and UI

/**
 * Placeholder for Crop Image Popup Component.
 * @param {Object} properties
 * @param {(hasAction: boolean) => void} properties.closePopup
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
    title: popupstyles.title || "ntpopups-title",
    scrollable: popupstyles.scrollable || "ntpopups-scrollable"
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

// /src/i18n/en.js

/**
 * Strings de tradução para Inglês (en).
 */
var en = {
  util: {
    cancelLabel: "Cancel",
    confirmLabel: "Confirm",
    closeLabel: "Close",
    ok: "Ok"
  },
  confirm: {
    title: "Confirmation",
    message: "Are you sure you want to proceed?"
  },
  internalError: {
    title: "Error: Invalid Popup Type",
    message: "Type not recognized:"
  }
};

// /src/i18n/pt.js

/**
 * Strings de tradução para Português (pt).
 */
var ptbr = {
  util: {
    cancelLabel: "Cancelar",
    confirmLabel: "Confirmar",
    closeLabel: "Fechar",
    ok: "Ok"
  },
  confirm: {
    title: "Confirmação",
    message: "Tem certeza que deseja prosseguir?"
  },
  internalError: {
    title: "Erro: Tipo de Popup Inválido",
    message: "Tipo não reconhecido:"
  }
};

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: true } : { done: false, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = true, u = false; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = true, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// Importe novos idiomas aqui:
// import es from './es'; 

// Mapeamento de todos os idiomas disponíveis
var languageMap = {
  en: en,
  ptbr: ptbr
  // es,
};
var defaultLanguage = 'en';

/**
 * Função utilitária para obter a tradução para uma chave e idioma.
 * Suporta chaves aninhadas usando notação de ponto (ex: 'confirm.title').
 * * @param {string} key - A chave da string (ex: 'confirm.title').
 * @param {string} lang - O idioma desejado (ex: 'pt').
 * @returns {string} A string traduzida ou uma mensagem de erro.
 */
function getTranslation(key) {
  var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultLanguage;
  var language = languageMap[lang] || languageMap[defaultLanguage];
  var keys = key.split('.');
  var result = language;
  var _iterator = _createForOfIteratorHelper(keys),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var k = _step.value;
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        // Fallback: Retorna a chave se a tradução não for encontrada
        return "[Missing translation for ".concat(key, " in ").concat(lang, "]");
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return result;
}

// /src/contexts/PopupContext.jsx

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }

// ==================== CONTEXT CREATION ====================

// O JSDoc AGORA USA O TIPO EXTENDIDO CORRETO
/** @type {React.Context<ExtendedPopupContextValue>} */
var PopupContext = /*#__PURE__*/createContext({
  // Definir todos os valores padrão, incluindo os novos (language e translate)
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
  },
  language: defaultLanguage,
  translate: function translate(key) {
    return "[Missing translation for ".concat(key, "]");
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
 * @param {'en'|'ptbr'|string} [props.language="en"] - The current language for internal popups (e.g., "en", "pt").
 * @param {'white'|'dark'} [props.theme="white"] - The current language for internal popups (e.g., "en", "pt").
 */
function NtPopupProvider(_ref) {
  var children = _ref.children,
    _ref$config = _ref.config,
    config = _ref$config === void 0 ? {} : _ref$config,
    _ref$customPopups = _ref.customPopups,
    customPopups = _ref$customPopups === void 0 ? {} : _ref$customPopups,
    _ref$language = _ref.language,
    propLanguage = _ref$language === void 0 ? defaultLanguage : _ref$language,
    _ref$theme = _ref.theme,
    theme = _ref$theme === void 0 ? "white" : _ref$theme;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    popups = _useState2[0],
    setPopups = _useState2[1];

  // Idioma Ativo (Garante fallback para o defaultLanguage)
  var activeLanguage = propLanguage || defaultLanguage;

  // Função de tradução (Memoizada)
  var translate = useCallback(function (key) {
    return getTranslation(key, activeLanguage);
  }, [activeLanguage]);

  // Refs for persistence
  var callbacksRef = useRef(new Map()); // popupId -> { onClose, onOpen }
  var timeoutsRef = useRef(new Map()); // popupId -> timeoutId
  var originalOverflowRef = useRef(null);
  var currentPopupsRef = useRef([]);

  // Queue system for race condition prevention
  var operationQueueRef = useRef([]);
  var isProcessingRef = useRef(false);

  // Merge internal popups with user-defined custom popups
  var allPopupTypes = _objectSpread(_objectSpread({}, internalPopupTypes), customPopups);

  // Configuration parsing
  var _config$defaultSettin = config.defaultSettings,
    defaultSettings = _config$defaultSettin === void 0 ? {} : _config$defaultSettin;
  var globalDefaults = defaultSettings.all || {};

  // ========== STATE SYNCHRONIZATION AND QUEUE PROCESSING ==========
  useEffect(function () {
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
  var closePopup = useCallback(function (popupIdOrHasAction, hasActionParam) {
    setPopups(function (prev) {
      var popupId;
      var hasAction;

      // Parameter flexibility logic
      if (typeof popupIdOrHasAction === 'boolean') {
        var _prev;
        popupId = (_prev = prev[prev.length - 1]) === null || _prev === void 0 ? void 0 : _prev.id;
        hasAction = popupIdOrHasAction;
      } else if (typeof popupIdOrHasAction === 'string' && typeof hasActionParam === 'boolean') {
        popupId = popupIdOrHasAction;
        hasAction = hasActionParam;
      } else if (typeof popupIdOrHasAction === 'string') {
        popupId = popupIdOrHasAction;
        hasAction = false;
      } else {
        var _prev2;
        popupId = (_prev2 = prev[prev.length - 1]) === null || _prev2 === void 0 ? void 0 : _prev2.id;
        hasAction = false;
      }
      if (!popupId) return prev;
      var closingPopup = prev.find(function (p) {
        return p.id === popupId;
      });
      if (!closingPopup) return prev;
      if (closingPopup.settings.requireAction && !hasAction) return prev;

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
          callbacks.onClose(hasAction, popupId);
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
  var openPopup = useCallback(function (popupType) {
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
      onClose: settings.onClose,
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
          keepLast: false,
          requireAction: false
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
        closePopup(popupId, false); // HasAction false for timeout close
      }, settings.timeout);
      timeoutsRef.current.set(popupId, timeoutId);
    }
    return popupId;
  };

  // ========== CLOSE ALL POPUPS FUNCTION ==========
  var closeAllPopups = useCallback(function () {
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
  var isPopupOpen = useCallback(function (popupId) {
    return currentPopupsRef.current.some(function (p) {
      return p.id === popupId && !p.hidden;
    });
  }, []);
  var getPopup = useCallback(function (popupId) {
    var popup = currentPopupsRef.current.find(function (p) {
      return p.id === popupId;
    });
    return popup && !popup.hidden ? popup : null;
  }, []);

  // ========== EFFECT: OVERFLOW & EVENT LISTENERS ==========
  useEffect(function () {
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
  useEffect(function () {
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
      // <-- ESTA LINHA AGORA DEVE ESTAR CORRETA DEVIDO AO TYPEDEF
      openPopup: openPopup,
      closePopup: closePopup,
      closeAllPopups: closeAllPopups,
      isPopupOpen: isPopupOpen,
      getPopup: getPopup,
      language: activeLanguage,
      translate: translate
    }
  }, /*#__PURE__*/React.createElement(DisplayPopup, {
    theme: theme,
    popups: popups.filter(function (p) {
      return !p.hidden;
    }),
    closePopup: closePopup,
    popupComponents: allPopupTypes,
    translate: translate
  }), children);
}

// ==================== CUSTOM HOOK ====================
/**
 * Hook to easily access the NtPopup context for opening and closing popups, 
* and accessing language/translation features.
 * @returns {ExtendedPopupContextValue}
 */
var useNtPopups = function useNtPopups() {
  var context = useContext(PopupContext);
  if (!context) {
    throw new Error("useNtPopups must be used within an NtPopupProvider");
  }
  return context;
};

export { NtPopupProvider, useNtPopups as default };
