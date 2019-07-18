<template>
  <div class="subColumn">
    <div class="subColumn_head columnTitle">
      <h2>{{project.displayName}}</h2>
      <a class="subColumn_head_menu" href="#">
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path clip-rule="evenodd"
                d="m6.61537 12.3077c0 1.2745-1.03318 2.3077-2.30768 2.3077s-2.30769-1.0332-2.30769-2.3077 1.03319-2.3077 2.30769-2.3077 2.30768 1.0332 2.30768 2.3077zm7.69243 0c0 1.2745-1.0332 2.3077-2.3077 2.3077s-2.30768-1.0332-2.30768-2.3077 1.03318-2.3077 2.30768-2.3077 2.3077 1.0332 2.3077 2.3077zm5.3846 2.3077c1.2745 0 2.3077-1.0332 2.3077-2.3077s-1.0332-2.3077-2.3077-2.3077-2.3077 1.0332-2.3077 2.3077 1.0332 2.3077 2.3077 2.3077z"
                fill-rule="evenodd" />
        </svg>
      </a>
    </div>
    <ul class="subColumn_tab">
      <li v-for="(t, i) in tabs" :key="i">
        <router-link
          :class="{[`open_tab_${t.name}`]: true, active: activeTab === t.name}"
          :to="{name: t.toName, params: tabToParams }">{{t.text}}</router-link>
      </li>
    </ul>
    <div class="subColumn_body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

enum SubColumnTabNames {
  task = 'task',
  file = 'file',
  note = 'note',
  chart = 'chart',
}

@Component
export default class SubColumnLayout extends Vue {
  @Prop({ type: String, default: null })
  activeTab!: SubColumnTabNames | null;

  tabs = [
    { name: SubColumnTabNames.task, text: 'タスク', toName: 'tasks' },
    { name: SubColumnTabNames.file, text: 'ファイル', toName: 'files' },
    { name: SubColumnTabNames.note, text: 'ノート', toName: 'notes' },
    { name: SubColumnTabNames.chart, text: 'ガントチャート', toName: 'charts' },
  ];

  get tabToParams() {
    return {
      userId: this.$route.params.userId,
      projectId: this.$route.params.projectId,
    };
  }

  get project() {
    return this.$store.getters.activeUser.activeProject;
  }
}
</script>
