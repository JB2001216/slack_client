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
            @input="messages.account = null"
          />
          <my-text-input
            v-model="data.owner.account"
            :message="ownerMessages.account || null"
            type="text"
            required
            placeholder="ユーザー名(英数字のみ)"
            @input="ownerMessages.account = null"
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
import { apiRegistry, SpacesApi, SpacesPostRequestBody, ApiErrors } from '@/lib/api';

@Component
export default class SpaceAdd2 extends Vue {
  // data
  saving = false;
  data: SpacesPostRequestBody = {
    token: '',
    account: '',
    owner: {
      email: '',
      account: '',
    },
  };
  messages: {[field: string]: MyTextInputMessage} = {
  };
  ownerMessages: {[field: string]: MyTextInputMessage} = {
  };

  // methods
  async save() {
    if (this.saving) {
      return;
    }

    const spacesApi = apiRegistry.load(SpacesApi);

    try {
      this.saving = true;
      const res = await spacesApi.spacesPost({
        spacesPostRequestBody: this.data,
      }).pipe(first()).toPromise();

      const user = await this.$store.actions.addLoggedInUsers(res.token);
      this.$router.push({
        name: 'user',
        params: {
          userId: user.id.toString(),
        },
      });

    } catch (err) {
      if (err instanceof AjaxError) {
        if (err.response && err.response.error) {
          if (ApiErrors.ValidationError === err.response.error) {
            const messages: {[field: string]: MyTextInputMessage} = {};
            const ownerMessages: {[field: string]: MyTextInputMessage} = {};
            Object.keys(err.response.fields).forEach((k) => {
              if (k === 'owner') {
                Object.keys(err.response.fields.owner).forEach((k) => {
                  ownerMessages[k] = {
                    type: 'error',
                    text: err.response.fields.owner[k],
                  };
                });
              } else {
                messages[k] = {
                  type: 'error',
                  text: err.response.fields[k],
                };
              }
            });
            this.messages = messages;
            this.ownerMessages = ownerMessages;

          } else if (ApiErrors.ExpiredTokenError === err.response.error) {
            this.$flash(err.response.detail, 'error');
            this.$router.replace({ name: 'space-add1' });
            return;
          }
        }
      }

      this.$showApiError(this, err);
      this.saving = false;
    }
  }

  beforeMount() {
    this.data.token = this.$route.params['token'];
    this.data.owner.email = this.$route.params['email'];
  }
}
</script>
