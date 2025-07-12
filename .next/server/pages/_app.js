/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/lib/analytics.ts":
/*!******************************!*\
  !*** ./src/lib/analytics.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initGA: () => (/* binding */ initGA),\n/* harmony export */   logCalculatorUsage: () => (/* binding */ logCalculatorUsage),\n/* harmony export */   logEmailInteraction: () => (/* binding */ logEmailInteraction),\n/* harmony export */   logEvent: () => (/* binding */ logEvent),\n/* harmony export */   logFormSubmission: () => (/* binding */ logFormSubmission),\n/* harmony export */   logPageView: () => (/* binding */ logPageView),\n/* harmony export */   setUserProperties: () => (/* binding */ setUserProperties)\n/* harmony export */ });\n/* harmony import */ var react_ga4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-ga4 */ \"react-ga4\");\n/* harmony import */ var react_ga4__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_ga4__WEBPACK_IMPORTED_MODULE_0__);\n\nconst GA_MEASUREMENT_ID = \"G-69KPYPT8CC\";\nconst initGA = ()=>{\n    if (GA_MEASUREMENT_ID && \"undefined\" !== \"undefined\") {}\n};\nconst logPageView = (path)=>{\n    if (GA_MEASUREMENT_ID && \"undefined\" !== \"undefined\") {}\n};\nconst logEvent = (category, action, label, value)=>{\n    if (GA_MEASUREMENT_ID && \"undefined\" !== \"undefined\") {}\n};\nconst logFormSubmission = (formName, formData)=>{\n    logEvent(\"Form\", \"Submit\", formName);\n    // Log additional form-specific events\n    if (formName === \"waitlist\") {\n        logEvent(\"Conversion\", \"Waitlist Signup\");\n    } else if (formName === \"calculator\") {\n        logEvent(\"Engagement\", \"Calculator Used\", formData?.shipmentType);\n    }\n};\nconst logCalculatorUsage = (data)=>{\n    logEvent(\"Calculator\", \"Calculate\", data.shipmentType, Math.round(data.weight));\n    if (data.estimatedCost) {\n        logEvent(\"Calculator\", \"Cost Estimated\", data.shipmentType, Math.round(data.estimatedCost));\n    }\n};\nconst logEmailInteraction = (action)=>{\n    logEvent(\"Email\", action);\n};\nconst setUserProperties = (properties)=>{\n    if (GA_MEASUREMENT_ID && \"undefined\" !== \"undefined\") {}\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL2FuYWx5dGljcy50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBK0I7QUFFL0IsTUFBTUMsb0JBQW9CQyxjQUF5QztBQUU1RCxNQUFNRyxTQUFTO0lBQ3BCLElBQUlKLHFCQUFxQixnQkFBa0IsYUFBYSxFQUV2RDtBQUNILEVBQUM7QUFFTSxNQUFNTSxjQUFjLENBQUNDO0lBQzFCLElBQUlQLHFCQUFxQixnQkFBa0IsYUFBYSxFQUV2RDtBQUNILEVBQUM7QUFFTSxNQUFNVyxXQUFXLENBQUNDLFVBQWtCQyxRQUFnQkMsT0FBZ0JDO0lBQ3pFLElBQUlmLHFCQUFxQixnQkFBa0IsYUFBYSxFQU92RDtBQUNILEVBQUM7QUFFTSxNQUFNaUIsb0JBQW9CLENBQUNDLFVBQWtCQztJQUNsRFIsU0FBUyxRQUFRLFVBQVVPO0lBRTNCLHNDQUFzQztJQUN0QyxJQUFJQSxhQUFhLFlBQVk7UUFDM0JQLFNBQVMsY0FBYztJQUN6QixPQUFPLElBQUlPLGFBQWEsY0FBYztRQUNwQ1AsU0FBUyxjQUFjLG1CQUFtQlEsVUFBVUM7SUFDdEQ7QUFDRixFQUFDO0FBRU0sTUFBTUMscUJBQXFCLENBQUNDO0lBS2pDWCxTQUFTLGNBQWMsYUFBYVcsS0FBS0YsWUFBWSxFQUFFRyxLQUFLQyxLQUFLLENBQUNGLEtBQUtHLE1BQU07SUFFN0UsSUFBSUgsS0FBS0ksYUFBYSxFQUFFO1FBQ3RCZixTQUFTLGNBQWMsa0JBQWtCVyxLQUFLRixZQUFZLEVBQUVHLEtBQUtDLEtBQUssQ0FBQ0YsS0FBS0ksYUFBYTtJQUMzRjtBQUNGLEVBQUM7QUFFTSxNQUFNQyxzQkFBc0IsQ0FBQ2Q7SUFDbENGLFNBQVMsU0FBU0U7QUFDcEIsRUFBQztBQUVNLE1BQU1lLG9CQUFvQixDQUFDQztJQUNoQyxJQUFJN0IscUJBQXFCLGdCQUFrQixhQUFhLEVBRXZEO0FBQ0gsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NoaXBub2RlLy4vc3JjL2xpYi9hbmFseXRpY3MudHM/OGFiOCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3RHQSBmcm9tICdyZWFjdC1nYTQnXG5cbmNvbnN0IEdBX01FQVNVUkVNRU5UX0lEID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfR0FfTUVBU1VSRU1FTlRfSURcblxuZXhwb3J0IGNvbnN0IGluaXRHQSA9ICgpID0+IHtcbiAgaWYgKEdBX01FQVNVUkVNRU5UX0lEICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgUmVhY3RHQS5pbml0aWFsaXplKEdBX01FQVNVUkVNRU5UX0lEKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBsb2dQYWdlVmlldyA9IChwYXRoOiBzdHJpbmcpID0+IHtcbiAgaWYgKEdBX01FQVNVUkVNRU5UX0lEICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgUmVhY3RHQS5zZW5kKHsgaGl0VHlwZTogJ3BhZ2V2aWV3JywgcGFnZTogcGF0aCB9KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBsb2dFdmVudCA9IChjYXRlZ29yeTogc3RyaW5nLCBhY3Rpb246IHN0cmluZywgbGFiZWw/OiBzdHJpbmcsIHZhbHVlPzogbnVtYmVyKSA9PiB7XG4gIGlmIChHQV9NRUFTVVJFTUVOVF9JRCAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIFJlYWN0R0EuZXZlbnQoe1xuICAgICAgY2F0ZWdvcnksXG4gICAgICBhY3Rpb24sXG4gICAgICBsYWJlbCxcbiAgICAgIHZhbHVlXG4gICAgfSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgbG9nRm9ybVN1Ym1pc3Npb24gPSAoZm9ybU5hbWU6IHN0cmluZywgZm9ybURhdGE/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gIGxvZ0V2ZW50KCdGb3JtJywgJ1N1Ym1pdCcsIGZvcm1OYW1lKVxuICBcbiAgLy8gTG9nIGFkZGl0aW9uYWwgZm9ybS1zcGVjaWZpYyBldmVudHNcbiAgaWYgKGZvcm1OYW1lID09PSAnd2FpdGxpc3QnKSB7XG4gICAgbG9nRXZlbnQoJ0NvbnZlcnNpb24nLCAnV2FpdGxpc3QgU2lnbnVwJylcbiAgfSBlbHNlIGlmIChmb3JtTmFtZSA9PT0gJ2NhbGN1bGF0b3InKSB7XG4gICAgbG9nRXZlbnQoJ0VuZ2FnZW1lbnQnLCAnQ2FsY3VsYXRvciBVc2VkJywgZm9ybURhdGE/LnNoaXBtZW50VHlwZSlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgbG9nQ2FsY3VsYXRvclVzYWdlID0gKGRhdGE6IHtcbiAgc2hpcG1lbnRUeXBlOiBzdHJpbmdcbiAgd2VpZ2h0OiBudW1iZXJcbiAgZXN0aW1hdGVkQ29zdD86IG51bWJlclxufSkgPT4ge1xuICBsb2dFdmVudCgnQ2FsY3VsYXRvcicsICdDYWxjdWxhdGUnLCBkYXRhLnNoaXBtZW50VHlwZSwgTWF0aC5yb3VuZChkYXRhLndlaWdodCkpXG4gIFxuICBpZiAoZGF0YS5lc3RpbWF0ZWRDb3N0KSB7XG4gICAgbG9nRXZlbnQoJ0NhbGN1bGF0b3InLCAnQ29zdCBFc3RpbWF0ZWQnLCBkYXRhLnNoaXBtZW50VHlwZSwgTWF0aC5yb3VuZChkYXRhLmVzdGltYXRlZENvc3QpKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBsb2dFbWFpbEludGVyYWN0aW9uID0gKGFjdGlvbjogJ3NpZ251cCcgfCAndW5zdWJzY3JpYmUnIHwgJ2NsaWNrJykgPT4ge1xuICBsb2dFdmVudCgnRW1haWwnLCBhY3Rpb24pXG59XG5cbmV4cG9ydCBjb25zdCBzZXRVc2VyUHJvcGVydGllcyA9IChwcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gIGlmIChHQV9NRUFTVVJFTUVOVF9JRCAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIFJlYWN0R0EuZ3RhZygnc2V0JywgJ3VzZXJfcHJvcGVydGllcycsIHByb3BlcnRpZXMpXG4gIH1cbn0iXSwibmFtZXMiOlsiUmVhY3RHQSIsIkdBX01FQVNVUkVNRU5UX0lEIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX0dBX01FQVNVUkVNRU5UX0lEIiwiaW5pdEdBIiwiaW5pdGlhbGl6ZSIsImxvZ1BhZ2VWaWV3IiwicGF0aCIsInNlbmQiLCJoaXRUeXBlIiwicGFnZSIsImxvZ0V2ZW50IiwiY2F0ZWdvcnkiLCJhY3Rpb24iLCJsYWJlbCIsInZhbHVlIiwiZXZlbnQiLCJsb2dGb3JtU3VibWlzc2lvbiIsImZvcm1OYW1lIiwiZm9ybURhdGEiLCJzaGlwbWVudFR5cGUiLCJsb2dDYWxjdWxhdG9yVXNhZ2UiLCJkYXRhIiwiTWF0aCIsInJvdW5kIiwid2VpZ2h0IiwiZXN0aW1hdGVkQ29zdCIsImxvZ0VtYWlsSW50ZXJhY3Rpb24iLCJzZXRVc2VyUHJvcGVydGllcyIsInByb3BlcnRpZXMiLCJndGFnIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/lib/analytics.ts\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _lib_analytics__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/analytics */ \"./src/lib/analytics.ts\");\n\n\n\n\n\nfunction App({ Component, pageProps }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Initialize Google Analytics\n        (0,_lib_analytics__WEBPACK_IMPORTED_MODULE_4__.initGA)();\n        // Log initial page view\n        (0,_lib_analytics__WEBPACK_IMPORTED_MODULE_4__.logPageView)(router.pathname);\n        // Log page views on route change\n        const handleRouteChange = (url)=>{\n            (0,_lib_analytics__WEBPACK_IMPORTED_MODULE_4__.logPageView)(url);\n        };\n        router.events.on(\"routeChangeComplete\", handleRouteChange);\n        return ()=>{\n            router.events.off(\"routeChangeComplete\", handleRouteChange);\n        };\n    }, [\n        router\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n        ...pageProps\n    }, void 0, false, {\n        fileName: \"/home/kwaldman/codebp/shippingaggregator/src/pages/_app.tsx\",\n        lineNumber: 29,\n        columnNumber: 10\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDaUM7QUFDTTtBQUNWO0FBQ3dCO0FBRXRDLFNBQVNJLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDNUQsTUFBTUMsU0FBU04sc0RBQVNBO0lBRXhCRCxnREFBU0EsQ0FBQztRQUNSLDhCQUE4QjtRQUM5QkUsc0RBQU1BO1FBRU4sd0JBQXdCO1FBQ3hCQywyREFBV0EsQ0FBQ0ksT0FBT0MsUUFBUTtRQUUzQixpQ0FBaUM7UUFDakMsTUFBTUMsb0JBQW9CLENBQUNDO1lBQ3pCUCwyREFBV0EsQ0FBQ087UUFDZDtRQUVBSCxPQUFPSSxNQUFNLENBQUNDLEVBQUUsQ0FBQyx1QkFBdUJIO1FBRXhDLE9BQU87WUFDTEYsT0FBT0ksTUFBTSxDQUFDRSxHQUFHLENBQUMsdUJBQXVCSjtRQUMzQztJQUNGLEdBQUc7UUFBQ0Y7S0FBTztJQUVYLHFCQUFPLDhEQUFDRjtRQUFXLEdBQUdDLFNBQVM7Ozs7OztBQUNqQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NoaXBub2RlLy4vc3JjL3BhZ2VzL19hcHAudHN4P2Y5ZDYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJ1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcidcbmltcG9ydCAnQC9zdHlsZXMvZ2xvYmFscy5jc3MnXG5pbXBvcnQgeyBpbml0R0EsIGxvZ1BhZ2VWaWV3IH0gZnJvbSAnQC9saWIvYW5hbHl0aWNzJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gSW5pdGlhbGl6ZSBHb29nbGUgQW5hbHl0aWNzXG4gICAgaW5pdEdBKClcbiAgICBcbiAgICAvLyBMb2cgaW5pdGlhbCBwYWdlIHZpZXdcbiAgICBsb2dQYWdlVmlldyhyb3V0ZXIucGF0aG5hbWUpXG5cbiAgICAvLyBMb2cgcGFnZSB2aWV3cyBvbiByb3V0ZSBjaGFuZ2VcbiAgICBjb25zdCBoYW5kbGVSb3V0ZUNoYW5nZSA9ICh1cmw6IHN0cmluZykgPT4ge1xuICAgICAgbG9nUGFnZVZpZXcodXJsKVxuICAgIH1cblxuICAgIHJvdXRlci5ldmVudHMub24oJ3JvdXRlQ2hhbmdlQ29tcGxldGUnLCBoYW5kbGVSb3V0ZUNoYW5nZSlcbiAgICBcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgcm91dGVyLmV2ZW50cy5vZmYoJ3JvdXRlQ2hhbmdlQ29tcGxldGUnLCBoYW5kbGVSb3V0ZUNoYW5nZSlcbiAgICB9XG4gIH0sIFtyb3V0ZXJdKVxuXG4gIHJldHVybiA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG59Il0sIm5hbWVzIjpbInVzZUVmZmVjdCIsInVzZVJvdXRlciIsImluaXRHQSIsImxvZ1BhZ2VWaWV3IiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwicm91dGVyIiwicGF0aG5hbWUiLCJoYW5kbGVSb3V0ZUNoYW5nZSIsInVybCIsImV2ZW50cyIsIm9uIiwib2ZmIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react-ga4":
/*!****************************!*\
  !*** external "react-ga4" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-ga4");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./src/pages/_app.tsx")));
module.exports = __webpack_exports__;

})();