<template>
  <div class="columnWrap">
    <div class="columnWrap_right">
      <h3><strong>{{ $t('views.projectAddColumn.addANewProject') }}</strong></h3>
      <form @submit.prevent="save()">
        <div class="columnWrap_right_inputText">
          <my-single-form-text-input
            v-model="displayName"
            :message="displayNameMessage"
            type="text"
            :placeholder="$t('views.projectAddColumn.projectName')"
          />
        </div>
        <button v-show="false" type="submit" />
      </form>
    </div>

    <my-confirm-change-discard-dialog
      :changes="changes"
      :next="!!nextForConfirmChangeDiscard"
      @answer="onAnswerForConfirmChangeDiscardDialog"
    />
  </div>
</template>

<style lang="stylus" scoped>
.columnWrap
  width: 100%
  .columnWrap_right
    width: 100%
    padding: 0
</style>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { MySingleFormTextInputMessage } from '@/components/MySingleFormTextInput';
import { apiRegistry, ProjectsApi, ApiErrors, getJsonFromResponse } from '@/lib/api';
import ConfirmChangeDiscardMixin from '@/mixins/ConfirmChangeDiscardMixin';


@Component
export default class ProjectAddColumn extends Mixins(ConfirmChangeDiscardMixin) {
  displayName = '';
  displayNameMessage: MySingleFormTextInputMessage = null;
  saving = false;

  get changes() {
    return this.displayName.trim() !== '';
  }

  async save() {
    if (this.saving) return;

    const loginUser = this.$store.state.activeUser.myUser!;
    const projectsApi = apiRegistry.load(ProjectsApi, loginUser.token);

    try {
      this.saving = true;

      const project = await projectsApi.projectsPost({
        spaceId: loginUser.space.id,
        projectsPostRequestBody: {
          displayName: this.displayName,
        },
      });
      this.$store.mutations.activeUser.addProject(project);
      this.displayName = '';
      this.$router.push({
        name: 'project',
        params: {
          userId: loginUser.id.toString(),
          projectId: project.id.toString(),
        },
      });

    } catch (err) {
      if (err instanceof Response) {
        const json = await getJsonFromResponse(err);
        if (json && json.error === ApiErrors.ValidationError) {
          this.displayNameMessage = {
            type: 'error',
            text: json.data[Object.keys(json.data)[0]],
          };
        }
      }

      this.$appEmit('error', { err });
      this.saving = false;
    }
  }
}
</script>
