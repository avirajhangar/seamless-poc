/* eslint-disable @typescript-eslint/no-var-requires */
const packageMeta = require('./package.json');
const seamlessRc = require('./../../.seamlessrc.json');

const NAME = 'banner-poc';
const TENANT = seamlessRc.tenantId;
const pluginPath = `/${TENANT}-${NAME}/${TENANT}-${NAME}-${packageMeta.version}`;

module.exports = {
  manifestVersion: '2.0',
  name: `${TENANT}-${NAME}`,
  version: packageMeta.version,
  config: {
    hasCss: true,
    files: {
      scripts: [
        {
          url: `${pluginPath}/index.js`,
          attrs: {
            type: 'module', // component
          },
        },
      ],
      styles: [
        {
          url: `${pluginPath}/style.css`,
        },
      ],
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
      {
        language: 'en',
        country: 'GB',
      },
    ],
  },
  aemComponentConfig: {
    title: 'ukscc banner-poc Web Component',
    description: packageMeta.description,
    componentGroup: 'Generic NG - Content',
    productPrefix: seamlessRc.tenantId,
    tagNameWithoutPrefix: 'banner-poc',
    dialog: [
      {
        widgetType: 'text',
        defaultValue: pluginPath,
        label: `Plugin Path: (${pluginPath})`,
        param: 'pluginPath',
        hint: 'Copy and paste the plugin path provided in brackets!',
        required: true,
      },
      {
        widgetType: 'text',
        defaultValue: 'Banner Title Default',
        label: 'Banner Title',
        param: 'title',
      },
      {
        widgetType: 'textarea',
        defaultValue:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consequat elit ut mauris fringilla, nec ultrices neque lacinia.',
        label: 'Banner Description',
        param: 'description',
      },
      {
        widgetType: 'asset',
        param: 'bannerimage',
        defaultValue:
          'https://media.autoexpress.co.uk/image/private/s--oSPpA6bs--/f_auto,t_content-image-full-desktop@1/v1639398403/autoexpress/2021/12/Merc%20A-class%20front%20static.jpg',
        label: 'Banner image',
        hint: 'Image of the banner',
        mimeTypes: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
        allowedWidth: '2730',
        allowedHeight: '1536',
      },
    ],
  },
};
