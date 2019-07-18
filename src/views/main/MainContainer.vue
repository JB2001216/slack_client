<template>
  <div class="home">
    <team-column />
    <router-view name="projectColumn" />
    <router-view name="subColumn" />
    <router-view name="mainColumn" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TeamColumn from './columns/team/TeamColumn.vue';

@Component({
  components: {
    TeamColumn,
  },
})
export default class MainContainer extends Vue {
  get loggedInUsers() {
    return this.$store.state.loggedInUsers;
  }
  get activeUserId() {
    const userId = this.$route.params.userId;
    return userId ? parseInt(userId) : null;
  }
}
</script>
