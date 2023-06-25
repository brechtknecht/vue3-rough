import * as components from './components';

export function install(app) {
    Object.keys(components).forEach((name) => {
        app.component(name, components[name]);
    });
}

export * from './components';

export default install;
