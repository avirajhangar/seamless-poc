import { Wrapper } from '@vue/test-utils';
import SeamlessRouterExamlpleComponent from '@/components/seamless-router/seamless-router-example.vue';
import { specHelpers, getMountedComponent } from './../../../tests/unit/before-all';

describe('SeamlessRouterExampleComponent.vue', () => {

  beforeAll(() => {
    specHelpers();
  });

  test('SeamlessRouterExampleComponent is loaded', () => {
    const wrapper: Wrapper<any> = getMountedComponent(SeamlessRouterExamlpleComponent, {});
    expect(wrapper.isVueInstance).toBeTruthy();
  });
});

