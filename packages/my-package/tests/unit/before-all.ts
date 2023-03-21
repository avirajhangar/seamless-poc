import Vue from 'vue';
import { VueClass, shallowMount, ThisTypedShallowMountOptions, Wrapper } from '@vue/test-utils';

/**
 * Loading workbench2
 */
export const specHelpers = (): void => {
  Vue.config.productionTip = false;
  // Router Custom Elements
  Vue.config.ignoredElements.push(/router-w*/);
  Vue.config.ignoredElements.push(/wb-w*/);
};

/**
 * helper function that mounts and returns the rendered component
 * [Writing testable Components](https://vuejs.org/v2/guide/unit-testing.html#Writing-Testable-Components)
 * @param Component
 * @param propsData
 */
 export const getMountedComponent = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: VueClass<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propsData: ThisTypedShallowMountOptions<any>,
): Wrapper<any> => {
  return shallowMount(Component, {
    propsData,
  });
};
