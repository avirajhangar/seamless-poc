import { initializeStore } from '@seamless/store';
import {
  addConnectionAemEnvironmentConnection,
  connectionName,
  ConnectionAemEnvironmentState,
} from '@owc/connection-aem-environment';

export interface AemEnvironmentVariables extends ConnectionAemEnvironmentState {
  vehicleData: {
    modelSeries: string;
    subBrand: string;
  };
}

/**
 * Read AEM environment
 */
export async function getAemEnvironmentData(): Promise<AemEnvironmentVariables> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    await addConnectionAemEnvironmentConnection();

    const store = initializeStore();
    const listener = (state: AemEnvironmentVariables): void => {
      resolve(state);
      store.unsubscribe(connectionName, listener);
    };

    await store.subscribe(connectionName, listener);
  });
}
