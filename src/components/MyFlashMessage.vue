<template>
  <flash-message class="my-flash-message" />
</template>

<style lang="stylus">
@import '../../node_modules/vue-flash-message/dist/vue-flash-message.min.css'
@import '../stylus/_settings'

.my-flash-message
  position: fixed
  bottom: 20px;
  right: 20px;
  max-height: 400px
  z-index: 100000
  .flash__message
    min-width: 300px
    max-width: 500px
    padding: 20px 60px 20px 20px
    border: none
    border-radius: 8px
    font-size: 14px
    font-weight: bold
    line-height: 1.5
    transition: opacity .4s, transform .4s
    display: flex
    &.success
      color: $themeColors.active
      background-color: #ebf0f5
  .flash__close-button
    font-size: 38px
    font-weight: 200
    right: 15px
    top: calc(50% - 15px)
    &:hover
      font-weight: 400
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
