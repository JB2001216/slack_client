<template>
  <div class="columnWrap">
    <div class="columnWrap_left signup">
      <h2>Ernie</h2>
    </div>
    <div class="columnWrap_right">
      <h3>Welcome to <strong>Ernie.</strong></h3>
      <p class="columnWrap_right_description">アーニーによる完璧なプロジェクト管理を手に入れましょう。<br>登録は無料です。</p>
      <p class="columnWrap_right_learn"><a href="" target="_blank">Learn more</a></p>
      <form @submit.prevent="save()">
        <div class="columnWrap_right_inputText">
          <my-text-input
            v-model="email"
            type="email"
            required
            :message="emailMessage"
            placeholder="メールアドレスを入力"
            @input="emailMessage = null"
          />
          <button type="submit" style="display: none;"/>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MyTextInputMessage } from '@/components/MyTextInput';
import { first } from 'rxjs/operators';
import { AjaxError } from 'rxjs/ajax';
import { apiRegistry, SpacesApi, ApiErrors } from '@/lib/api';

@Component
export default class SpaceAdd1 extends Vue {
  // data
  email = '';
  emailMessage: MyTextInputMessage = null;
  saving = false;

  // methods
  async save() {
    if (this.saving) {
      return;
    }

    const spacesApi = apiRegistry.load(SpacesApi);

    try {
      this.saving = true;

      await spacesApi.spacesConfirmPost({
        spacesConfirmPostRequestBody: {
          email: this.email,
        },
      }).pipe(first()).toPromise();

      this.emailMessage = {
        type: 'success',
        text: '登録用URLを送信しました。',
      };

    } catch (err) {
      if (err instanceof AjaxError) {
        if (err.response && err.response.error === ApiErrors.ValidationError) {
          this.emailMessage = {
            type: 'error',
            text: err.response.fields[Object.keys(err.response.fields)[0]],
          };
        }
      }

      this.$showApiError(this, err);
      this.saving = false;
    }
  }
}
</script>
