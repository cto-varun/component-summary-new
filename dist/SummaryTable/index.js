"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _withData = _interopRequireDefault(require("../../../../../src/utils/withData"));
require("./styles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const setAppropriateContent = (obj, data, props) => {
  if (!obj) {
    return '';
  }
  const {
    html = '',
    text = '',
    fn = '',
    child = '',
    styles = {}
  } = obj;
  if (html) {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: styles,
      dangerouslySetInnerHTML: {
        __html: html
      }
    });
  }
  if (text) {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: styles
    }, text);
  }
  if (fn) {
    const result = new Function(`return ${fn}`)()(data || {});
    return /*#__PURE__*/_react.default.createElement("div", {
      style: styles,
      dangerouslySetInnerHTML: {
        __html: result
      }
    });
  }
  if (child) {
    return props.children && child in props.children ? /*#__PURE__*/_react.default.cloneElement(props.children[child], {
      parentProps: props
    }) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
};
const mapData = (datum, data, props) => {
  return datum.map((item, index) => {
    if (typeof item === 'string') {
      return /*#__PURE__*/_react.default.createElement("div", {
        key: index
      }, item);
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      key: index
    }, setAppropriateContent(item, data, props));
  });
};
const mapPayload = (payload, data, props) => {
  return payload.map((packet, index) => {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "payload-flex-row",
      style: packet.styles || {},
      key: packet.id || index
    }, mapData(packet.data || [], data, props));
  });
};
const processItems = (items, data) => {
  return items.map(item => {
    if (item.payload.use && data) {
      try {
        const payload = new Function(`return function(d) { return d.${item.payload.use}; };`)()(data);
        return {
          ...item,
          payload
        };
      } catch (e) {
        return [];
      }
    }
    return item;
  });
};
const mapSections = (sections, data, props) => {
  const items = processItems(sections.items || [], data);
  return (sections.transformations || []).reduce((acc, trans) => {
    try {
      const func = new Function(`return ${trans}`)();
      return func(acc);
    } catch (e) {
      return acc;
    }
  }, items).map(section => {
    return /*#__PURE__*/_react.default.createElement("div", {
      key: section.id
    }, setAppropriateContent(section.sectionTitle, data, props), /*#__PURE__*/_react.default.createElement("div", {
      className: "payload-flex-wrapper"
    }, mapPayload(section.payload || [], data, props)));
  });
};
const loadFrom = fn => {
  try {
    return new Function(`return ${fn}`)()();
  } catch (e) {
    return undefined;
  }
};
const SummaryTable = props => {
  const {
    dataProcessor = {},
    params = {}
  } = props.component;
  const structure = loadFrom(params.loadFromFunction) || params.structure || {};
  const accessor = dataProcessor.accessName;
  const data = {
    [accessor]: props[accessor]
  };
  if (structure === 'null') return null;
  if (params.static) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "summary-table",
      style: structure.tableStyles
    }, setAppropriateContent(structure.summaryTitle || {}, null, props), mapSections(structure.sections || {}, null, props));
  }
  return data[accessor] ? /*#__PURE__*/_react.default.createElement("div", {
    className: "summary-table",
    style: structure.tableStyles
  }, setAppropriateContent(structure.summaryTitle, data, props), mapSections(structure.sections, data, props)) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
};
var _default = (0, _withData.default)(SummaryTable);
exports.default = _default;
module.exports = exports.default;