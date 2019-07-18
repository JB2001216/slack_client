<template>
  <flash-message class="my-flash-message"/>
</template>

<style lang="stylus">
.my-flash-message
    position: fixed
    bottom: 20px;
    right: 20px;
    max-height: 400px
    z-index: 10000
    .flash__message
        min-width: 260px
        max-width: 400px
        font-size: 13px
        transition: opacity .4s, transform .4s
        display: flex
    .flash-transition-enter,
    .flash-transition-leave-to
        opacity: 0
        transform: rotateX(-30deg) scale(.88) translateY(-30px)
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MyFlashMessage extends Vue {
}
</script>
