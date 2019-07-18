<template>
  <div class="teamColumn">
    <ul class="teamColumn_nav">
      <li v-for="(u, i) in loggedInUsers" :key="i">
        <router-link
          :class="{active: activeUserId === u.id}"
          :to="{ name: 'user', params: { userId: u.id }}"
        />
      </li>
      <li>
        <router-link class="teamColumn_add" :to="{name: 'space-add1'}">
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m22 13h-19.99999v-2h19.99999z" />
            <path d="m11 22v-20.00003h2v20.00003z" />
          </svg>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class UserColumn extends Vue {
  get loggedInUsers() {
    return this.$store.state.loggedInUsers;
  }
  get activeUserId() {
    const userId = this.$route.params.userId;
    return userId ? parseInt(userId) : null;
  }
}
</script>
