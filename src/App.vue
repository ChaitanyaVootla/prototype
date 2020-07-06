<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
  export default {
      created() {
          this.$store.dispatch('initFirebase');
      }
  }
</script>
<style lang="less">
  @import './Assets/Styles/main.less';
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: #111;
    color: @text-color;
    padding: 0;
    margin: 0;
  }
  /* width */
  ::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #0000008f;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #222;
    box-shadow: inset 0 0 5px rgb(54, 54, 54);
    border-radius: 2px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(61, 61, 61);
    cursor: pointer;
  }
  .custom-control-input ~ .custom-control-label::before {
    color: #fff;
    border-color: #804545;
    background-color: #a08c8c;
    border-radius: 2px;
  }
  .custom-control-input:checked ~ .custom-control-label::before {
    color: #fff;
    border-color: #850909;
    background-color: #850909;
  }
</style>
