"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ui = exports.schema = void 0;
const schema = {
  title: 'Template settings',
  type: 'object',
  required: [],
  properties: {
    name: {
      title: 'Summary Table Name',
      type: 'string',
      default: undefined
    },
    loadFromFunction: {
      title: 'Load structure from an inline string function',
      type: 'string',
      default: undefined
    },
    structure: {
      type: 'object',
      $ref: '#/definitions/structure'
    }
  },
  definitions: {
    styles: {
      type: 'object',
      title: 'CSS Properties for styling a specific element',
      default: undefined
    },
    dataType: {
      fn: {
        type: 'string',
        title: 'Set value from function execution',
        default: ''
      },
      html: {
        type: 'string',
        title: 'Insert value as HTML',
        default: ''
      },
      child: {
        type: 'object',
        title: 'Inject a component',
        default: ''
      },
      text: {
        type: 'string',
        title: 'Set value as plain text',
        default: ''
      },
      styles: {
        $ref: '#/definitions/styles'
      }
    },
    payloadDataItem: {
      type: ['string', '#/defintions/dataType'],
      example: ['text', {
        html: '<h1>text</h1>',
        styles: {
          color: 'red'
        }
      }]
    },
    payloadItem: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            $ref: '#/defintions/payloadDataItem'
          }
        }
      }
    },
    tableItem: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          title: 'Key id for item'
        },
        sectionTitle: {
          type: 'object',
          items: {
            $ref: '#/defintions/dataType'
          }
        },
        payload: {
          type: ['array', 'object'],
          title: 'Data to apply to table',
          properties: {
            use: {
              type: 'string',
              title: 'When used with the data processor, use this to set payload data from somewhere in data processor',
              example: 'dataProcessorObject.propertyToUseForPayload'
            }
          },
          items: {
            $ref: '#/defintions/payloadItem'
          }
        }
      }
    },
    structure: {
      type: 'object',
      properties: {
        tableStyles: {
          type: 'object',
          title: 'Styles for table',
          default: undefined
        },
        summaryTitle: {
          type: 'object',
          title: 'Title for the Summary Table',
          properties: {
            type: 'object',
            items: {
              $ref: '#/definitions/dataType'
            }
          }
        }
      },
      sections: {
        type: 'object',
        title: 'Sections for the table containing data',
        properties: {
          transformations: {
            type: 'array',
            title: 'A list of inline function transformations to apply to data',
            default: []
          },
          items: {
            type: 'array',
            title: 'An array of the objects to place in table',
            items: {
              $ref: '#/defintions/tableItem'
            }
          }
        }
      }
    }
  }
};
exports.schema = schema;
const ui = {
  globalHeader: {
    'ui:widget': 'textarea'
  },
  template: {
    'ui:widget': 'textarea'
  },
  styles: {
    'ui:widget': 'textarea'
  }
};
exports.ui = ui;