<template>
  <flash-message class="my-flash-message"/>
</template>

<style lang="stylus">
@import '../../node_modules/vue-flash-message/dist/vue-flash-message.min.css'
.my-flash-message
    position: fixed
    bottom: 20px;
    right: 20px;
    max-height: 400px
    z-index: 10000
    .flash__message
        min-width: 300px
        max-width: 500px
        padding: 25px 60px 25px 25px
        border: none
        border-radius: 8px
        font-size: 16px
        font-weight: bold
        line-height: 1.5
        transition: opacity .4s, transform .4s
        display: flex
        &.success
          color: #2f80ed
          background-color: #ebf0f5
    .flash__close-button
      font-size: 38px
      font-weight: 300
      right: 15px
      top: calc(50% - 15px)
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
