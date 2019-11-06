<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" v-on="$listeners">
    <g fill="none" fill-rule="evenodd">
      <path d="M-1-1h18v18H-1z" />
      <path class="mySvgIcon_fill" fill-rule="nonzero" d="M5.6 0A5.612 5.612 0 000 5.6c0 3.083 2.517 5.6 5.6 5.6a5.567 5.567 0 003.66-1.375l.34.34V11.2l4.469 4.469a1.132 1.132 0 001.6-1.6L11.2 9.6h-1.034l-.341-.34A5.567 5.567 0 0011.2 5.6C11.2 2.517 8.683 0 5.6 0zm0 1.6c2.219 0 4 1.781 4 4 0 2.219-1.781 4-4 4-2.219 0-4-1.781-4-4 0-2.219 1.781-4 4-4z" />
    </g>
  </svg>
</template>

<style lang="stylus" scoped>
svg
  padding: calc(var(--mySvgIconSize, 18px) * 0.06) 0
</style>
