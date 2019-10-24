<template>
  <div class="teamColumn">
    <ul class="teamColumn_nav">
      <li v-for="u in loggedInUsers" :key="u.id">
        <a
          class="teamColumn_nav_item"
          :class="{active: activeUserId === u.id}"
          @click.prevent="$router.push(getUserLastLocation(u.id))"
        >
          <img v-if="u.space.avatarSmallUrl" :src="u.space.avatarSmallUrl">
          <span v-else>{{ (u.space.displayName || u.space.account).slice(0,1) }}</span>
        </a>
      </li>
      <li>
        <router-link class="teamColumn_add" :to="{name: 'space-add1'}">
          <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m22 13h-19.99999v-2h19.99999z" />
            <path d="m11 22v-20.00003h2v20.00003z" />
          </svg>
        </router-link>
      </li>
    </ul>
  </div>
</template>


<style lang="stylus">
.teamColumn
  &_nav
    &_item
      overflow: hidden
      text-decoration: none
      text-align: center
      img
        width: 100%
        transition: opacity 0.5s
      span
        font-size: 20px
        color: #666
        font-weight: bold
        line-height: 36px
      .active
        img
          opacity: 1
      &:not(.active)
        img
          opacity: 0.75
      &:not(.active):not(:hover)
        img
          opacity: 0.5
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getUserLastLocation } from '@/router';

@Component
export default class UserColumn extends Vue {
  get loggedInUsers() {
    return this.$store.state.loggedInUsers;
  }

  get activeUserId() {
    const userId = this.$route.params.userId;
    return userId ? parseInt(userId) : null;
  }

  getUserLastLocation(userId: number) {
    return getUserLastLocation(userId);
  }

  toUserLastLocation(userId: number) {
    this.$router.push(getUserLastLocation(userId));
  }
}
</script>
