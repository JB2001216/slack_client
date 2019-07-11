<template>
  <div class="columnWrap">
    <div class="columnWrap_left signup">
      <h2>Ernie</h2>
    </div>
    <div class="columnWrap_right">
      <h3>Welcome to <strong>Ernie.</strong></h3>
      <p class="columnWrap_right_description">アーニーによる完璧なプロジェクト管理を手に入れましょう。<br>登録は無料です。</p>
      <p class="columnWrap_right_learn"><a href="" target="_blank">Learn more</a></p>
      <form @submit.prevent="send()">
        <div class="columnWrap_right_inputText">
          <my-text-input
            v-model="email"
            type="email"
            required
            :message="emailMessage"
            placeholder="メールアドレスを入力"
            @input="emailMessage = null"
          />
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
import { SpacesApi, ApiErrors } from '@/lib/api';

@Component
export default class SpaceAdd1 extends Vue {
  // data
  email = '';
  emailMessage: MyTextInputMessage = null;

  // methods
  async send() {
    const spacesApi = await this.$store.actions.api.loadApi(SpacesApi);

    try {
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
      let text: string | null = null;
      if (err instanceof AjaxError) {
        if (err.response && err.response.error === ApiErrors.ValidationError) {
          text = err.response.detail[Object.keys(err.response.detail)[0]][0];
        }
      }
      if (!text) {
        text = 'メール送信に失敗しました。';
      }
      this.emailMessage = {
        type: 'error',
        text,
      };
    }
  }
}
</script>
