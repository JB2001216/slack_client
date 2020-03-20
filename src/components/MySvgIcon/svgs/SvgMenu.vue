<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 5" v-on="$listeners">
    <g fill="none" fill-rule="evenodd">
      <path d="M0-7h18v18H0z" />
      <path class="mySvgIcon_fill" fill-rule="nonzero" d="M2.925.2a2.025 2.025 0 100 4.05 2.025 2.025 0 000-4.05zM9 .2a2.025 2.025 0 100 4.05A2.025 2.025 0 009 .2zm6.075 0a2.025 2.025 0 100 4.05 2.025 2.025 0 000-4.05z" />
    </g>
  </svg>
</template>

<style lang="stylus" scoped>
svg
  padding: 0 calc(var(--mySvgIconSize, 18px) * 0.06)
</style>
