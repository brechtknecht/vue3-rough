<template>
    <canvas ref="canvasRef" :width="width" :height="height">
        <slot v-if="rough" />
    </canvas>
</template>

<script>
import { ref, onMounted, provide, watch } from 'vue';
import rough from 'roughjs/bundled/rough.esm.js';

export default {
    name: 'RoughCanvas',
    props: {
        width: String,
        height: String,
        config: Object
    },
    setup(props) {
        const canvasRef = ref(null);
        const roughInstance = ref(null);

        const clearCanvas = () => {
            const ctx = canvasRef.value.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
        };

        onMounted(() => {
            roughInstance.value = rough.canvas(canvasRef.value, props.config);
            provide('rough', roughInstance.value);
            provide('clearCanvas', clearCanvas);
        });

        watch(() => props.config, () => {
            roughInstance.value = rough.canvas(canvasRef.value, props.config);
        }, { deep: true });

        return {
            rough: roughInstance,
            canvasRef,
            clearCanvas
        };
    }
};
</script>
