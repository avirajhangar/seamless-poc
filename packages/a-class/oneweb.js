/* eslint-disable @typescript-eslint/no-var-requires */
const packageMeta = require('./package.json');
const seamlessRc = require('./../../.seamlessrc.json');

const NAME = 'a-class';
const TENANT = seamlessRc.tenantId;
const pluginPath = `/${TENANT}-${NAME}/${TENANT}-${NAME}-${packageMeta.version}`;


module.exports = {
  manifestVersion: '2.0',
  name: `${TENANT}-${NAME}`,
  version: packageMeta.version,
  config: {
    files: {
      scripts: [
        {
          url: `${pluginPath}/index.wc.js`,
          attrs: {
            type: 'module', // component
          },
        },
      ],
      styles: [{
          url: `${pluginPath}/style.css`,
        },],
    },
    dependencies: {
      oneweb: '2.0',
    },
    isUserSessionRequired: false,
    integrationType: 'webcomponent',
    marketAvailability: [
      {
        language: 'de',
        country: 'DE',
      },
      {
        language: 'pt',
        country: 'PT',
      },
      {
        language: 'en',
        country: 'IN',
      },
    ],
  },
  aemComponentConfig: {
    title: 'ukscc a-class Web Component',
    description: packageMeta.description,
    componentGroup: 'Generic NG - Content',
    productPrefix: seamlessRc.tenantId,
    tagNameWithoutPrefix: 'a-class',
    dialog: [
      {
        widgetType: 'text',
        defaultValue: 'fallback_configuration',
        label: 'Sample Text',
        param: 'sampletext',
      },
      {
        widgetType: 'dropdown',
        param: 'colorSelect',
        label: 'Select a color dropdown',
        hint: 'Select a Color',
        options: [
          {
            label: 'Blue',
            value: 'blue',
            selected: true,
          },
          {
            label: 'Green',
            value: 'green',
          },
        ],
      },
    ],
  },
};
