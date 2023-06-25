import { watch, ref, onUnmounted, inject } from 'vue';

export default function useElement(props) {
    const element = ref(null);
    const rough = inject('rough');

    const createElement = (func, ops, forceRender = false) => {
        const propsFiltered = Object.assign(
            {},
            ...Object.entries(props).map(([key, value]) => (
                value !== undefined && { [key]: value }
            ))
        );

        if (forceRender) {
            rough[func](...ops, propsFiltered);
            return;
        }

        if (rough.svg) {
            if (element.value) rough.remove(element.value);
            element.value = rough[func](...ops, propsFiltered);
        }
    }

    watch(() => props, () => { createElement() }, { deep: true });
    createElement();

    onUnmounted(() => {
        if (rough.svg) {
            if (element.value) rough.remove(element.value);
        }
    });

    return {
        element,
        createElement
    }
}
