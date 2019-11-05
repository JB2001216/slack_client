<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 18" v-on="$listeners">
    <g fill="none" fill-rule="evenodd">
      <path d="M-4 0h18v18H-4z" />
      <path class="mySvgIcon_fill" fill-rule="nonzero" d="M3.77 0C1.972 0 0 1.475 0 3.273V13.5C0 15.975 3.025 18 5.5 18s5-2.025 5-4.5V4.09H8.86v9.41c0 1.59-1.77 2.864-3.36 2.864-1.59 0-3.864-1.273-3.864-2.864V3.273c0-.914 1.22-1.637 2.134-1.637.914 0 2.14.723 2.14 1.637v8.59c0 .235-.425.41-.66.41-.235 0-.66-.175-.66-.41V4.092H2.95v7.773c0 1.12 1.43 2.045 2.55 2.045 1.12 0 2.045-.925 2.045-2.045V3.273C7.545 1.475 5.568 0 3.77 0z" />
    </g>
  </svg>
</template>

<style lang="stylus" scoped>
svg
  padding: calc(var(--mySvgIconSize, 18px) * 0.02) 0
</style>
