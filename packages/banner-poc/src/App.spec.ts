/* eslint-disable */
import { Wrapper, VueClass } from '@vue/test-utils';
import { specHelpers, getMountedComponent } from './../tests/unit/before-all';
import App from '@/App.vue';

describe('App.vue', () => {
  beforeAll(() => {
    // add workbench2 for example tests/unit/before-all
    specHelpers();
  });

  test('App is loaded', () => {
    const wrapper: Wrapper<any> = getMountedComponent(App as VueClass<any>, { title: "test" } as any);
    expect(wrapper.isVueInstance).toBeTruthy();
  });
});
/* eslint-enable */
