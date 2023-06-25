<template>
    <!-- component template here -->
  </template>
  
  <script>
  import { inject, onMounted, watchEffect } from 'vue';
  import useElement from '../mixins/element';
  
  export default {
      name: 'RoughEllipse',
      props: {
          x: Number,
          y: Number,
          width: Number,
          height: Number,
          // ...other props
      },
      setup(props) {
          const rerender = inject('clearCanvas');
          const { createElement } = useElement(props);
  
          const handler = (forceRender = false) => {
              createElement('ellipse', [props.x, props.y, props.width, props.height], forceRender);
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
  