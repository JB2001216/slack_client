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
            v-model="data.owner.email"
            type="email"
            required
            readonly
          />
          <my-text-input
            v-model="data.account"
            :message="messages.account || null"
            type="text"
            required
            placeholder="スペース名(英数字のみ)"
          />
          <my-text-input
            v-model="data.owner.account"
            :message="(messages.owner || {}).account || null"
            type="text"
            required
            placeholder="ユーザー名(英数字のみ)"
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
import { SpacesApi, SpacesPostRequestBody, ApiErrors } from '@/lib/api';

@Component
export default class SpaceAdd1 extends Vue {
  // data
  data: SpacesPostRequestBody = {
    token: '',
    account: '',
    owner: {
      email: '',
      account: '',
    },
  };
  messages: {[key: string]: MyTextInputMessage} = {};

  // methods
  async send() {
    const spacesApi = await this.$store.actions.api.loadApi(SpacesApi);

    try {
      await spacesApi.spacesPost({
        spacesPostRequestBody: this.data,
      }).pipe(first()).toPromise();
    } catch (err) {
      let text: string | null = null;
      if (err instanceof AjaxError) {
        if (err.response && err.response.error === ApiErrors.ValidationError) {
          const messages: {[key: string]: MyTextInputMessage} = {};
          Object.keys(err.response.detail).forEach((k) => {
            messages[k] = {
              type: 'error',
              text: err.response.detail[k][0],
            };
          });
          this.messages = messages;
        }
      }
    }
  }

  beforeMount() {
    this.data.token = this.$route.params['token'];
    this.data.owner.email = this.$route.params['email'];
  }
}
</script>
