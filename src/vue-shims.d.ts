declare module '*.vue' {
    // import { DefineComponent } from 'vue';
    // const component: DefineComponent<{}, {}, any>;
    // export default component;

    import { ComponentOptions } from 'vue';
    const Component: ComponentOptions;
    export default Component;
}
