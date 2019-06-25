<template>
  <div class="home">
    <markdown-editor v-model="markdown" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import MarkdownEditor from '@/components/MarkdownEditor.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
    MarkdownEditor,
  },
})
export default class Home extends Vue {
  markdown = '';
}
</script>
