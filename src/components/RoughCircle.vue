<template>
    <!-- component template here -->
  </template>
  
  <script>
  import { inject, onMounted, watchEffect } from 'vue';
  import useElement from '../mixins/element';
  
  export default {
      name: 'RoughCircle',
      props: {
          x: Number,
          y: Number,
          diameter: Number,
          // ...other props
      },
      setup(props) {
          const rerender = inject('clearCanvas');
          const { createElement } = useElement(props);
  
          const handler = (forceRender = false) => {
              createElement('circle', [props.x, props.y, props.diameter], forceRender);
          };
  
          onMounted(() => {
              handler(true);
          });
  
          watchEffect(() => {
              handler(true);
          });
  
          return {
              handler
          };
      }
  };
  </script>
  