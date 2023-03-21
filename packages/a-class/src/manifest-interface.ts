export interface Attrs {
  type: string;
  nomodule: string;
}

export interface Script {
  url: string;
  attrs: Attrs;
}

export interface Files {
  scripts: Script[];
}

export interface Dependencies {
  oneweb: string;
}

export interface MarketAvailability {
  language: string;
  country: string;
}

export interface Config {
  hasCss: boolean;
  files: Files;
  dependencies: Dependencies;
  isUserSessionRequired: boolean;
  integrationType: string;
  marketAvailability: MarketAvailability[];
}

export interface Option {
  label: string;
  value: string;
  selected: boolean;
}

export interface Dialog {
  widgetType: string;
  defaultValue: string;
  label: string;
  param: string;
  hint: string;
  options: Option[];
}

export interface AemComponentConfig {
  title: string;
  componentGroup: string;
  productPrefix: string;
  tagNameWithoutPrefix: string;
  dialog: Dialog[];
}

export interface AEMManifest {
  manifestVersion: string;
  name: string;
  version: string;
  config: Config;
  aemComponentConfig: AemComponentConfig;
}
