<template>
  <div class="projectColumn">
    <div class="projectColumn_head">
      <h1 class="t-sub">{{loggedInUser.space.displayName || loggedInUser.space.account}}</h1>
    </div>
    <div class="projectColumn_body">
      <ul>
        <li><a class="projectColumn_add" href="#">プロジェクト
          <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m22 13h-19.99999v-2h19.99999z" />
            <path d="m11 22v-20.00003h2v20.00003z" />
          </svg>
        </a></li>
        <li v-for="(p, i) in projects" :key="i">
          <router-link
            :class="{active: p.id === activeProjectId}"
            :to="{
              name: 'project',
              params: {
                userId: loggedInUser.id.toString(),
                projectId: p.id.toString(),
              },
            }"
          >{{p.displayName}}</router-link>
        </li>
      </ul>
    </div>
    <div class="projectColumn_foot">
      <a href="#">
        <svg fill="none" width="16" height="18" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
          <path d="m9.9375 1.5-1.03125 1.05h-5.15625v2.1h16.5v-2.1h-5.1562l-1.0313-1.05zm-5.15625 5.25v13.65c0 1.155.92813 2.1 2.0625 2.1h10.31245c1.1344 0 2.0626-.945 2.0626-2.1v-13.65zm3.09375 2.1h2.0625v11.55h-2.0625zm6.1875 0h2.0625v11.55h-2.0625z" />
        </svg>
        アーカイブ
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ProjectColumn extends Vue {
  get loggedInUser() {
    return this.$store.state.activeUser.loggedInUser;
  }
  get projects() {
    return this.$store.state.activeUser.projects;
  }
  get activeProjectId() {
    return this.$store.state.activeUser.activeProjectId;
  }
}
</script>
