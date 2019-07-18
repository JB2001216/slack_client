<template>
  <sub-column-layout active-tab="file">
    <div class="tab_file">
      <table class="file_table">
        <tr>
          <td class="file_table_title">ファイル名</td>
          <td class="file_table_day">最終更新日</td>
          <td class="file_table_user">更新者</td>
        </tr>
        <tr>
          <td class="file_table_title pdf">学習データのとり方.pdf</td>
          <td class="file_table_day">2時間前</td>
          <td class="file_table_user">Takeo Shibata</td>
        </tr>
        <tr>
          <td class="file_table_title excel">学習データのとり方.elsx</td>
          <td class="file_table_day">2時間前</td>
          <td class="file_table_user">Takeo Shibata</td>
        </tr>
        <tr>
          <td class="file_table_title word">学習データのとり方.docx</td>
          <td class="file_table_day">2時間前</td>
          <td class="file_table_user">Takeo Shibata</td>
        </tr>
      </table>
    </div>
  </sub-column-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SubColumnLayout from './SubColumnLayout.vue';

@Component({
  components: {
    SubColumnLayout,
  },
})
export default class FileColumn extends Vue {
}
</script>
