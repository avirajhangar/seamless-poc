import { AEMComponentPrefill, initializeComponentRegistry } from '@owc/component-registry-connection';
export interface DialogParameters {
  title: string;
  description: string;
  bannerimage: any;
  pluginPath: string;
}

/**
 * Read AEM dialogs
 * @param componentId e.g. dh-io-fcis, fcis-owdc
 */
export async function getAemComponentData(componentId: string): Promise<AEMComponentPrefill> {
  return new Promise((resolve) => {
    const store = initializeComponentRegistry();

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const listener = (state: Record<string, unknown>) => {
      resolve(state as AEMComponentPrefill);
    };

    store.subscribe(componentId, listener);
  });
}
