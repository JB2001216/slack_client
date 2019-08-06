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
        </div>
        <button type="submit" v-show="false" />
      </form>
      <div class="columnWrap_right_back" v-if="backTo">
        <router-link :to="backTo">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.66675 13.5997L7.60956 12.6569L1.00989 6.0572L0.0670837 7.00001L6.66675 13.5997Z" fill="#333333"/>
            <path d="M7.60962 1.34314L6.66681 0.40033L0.0670837 7.00001L1.00995 7.9428L7.60962 1.34314Z" fill="#333333"/>
          </svg>
          <span>Back</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MyTextInputMessage } from '@/components/MyTextInput';
import { apiRegistry, SpacesApi, SpacesPostRequestBody, ApiErrors, FetchError } from '@/lib/api';

@Component
export default class SpaceAdd2 extends Vue {
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

  get backTo() {
    let userId: number | null = null;
    if (this.$store.state.activeUser.loggedInUser) {
      userId = this.$store.state.activeUser.loggedInUser.id;
    } else if (this.$store.state.loggedInUsers.length) {
      userId = this.$store.state.loggedInUsers[0].id;
    }

    if (userId) {
      return {
        path: 'user',
        params: { userId: userId.toString() },
      };
    } else {
      return { path: 'space-add1' };
    }
  }

  async save() {
    if (this.saving) {
      return;
    }

    const spacesApi = apiRegistry.load(SpacesApi);

    try {
      this.saving = true;
      const res = await spacesApi.spacesPost({
        spacesPostRequestBody: this.data,
      });

      const user = await this.$store.actions.addLoggedInUsers(res.token);
      this.$router.push({
        name: 'user',
        params: {
          userId: user.id.toString(),
        },
      });

    } catch (err) {
      if (err instanceof FetchError) {
        const res = await err.data!.json();
        if (res.error) {
          if (ApiErrors.ValidationError === res.error) {
            const messages: {[field: string]: MyTextInputMessage} = {};
            const ownerMessages: {[field: string]: MyTextInputMessage} = {};
            Object.keys(res.data).forEach((k) => {
              if (k === 'owner') {
                Object.keys(res.data.owner).forEach((k) => {
                  ownerMessages[k] = {
                    type: 'error',
                    text: res.data.owner[k],
                  };
                });
              } else {
                messages[k] = {
                  type: 'error',
                  text: res.data[k],
                };
              }
            });
            this.messages = messages;
            this.ownerMessages = ownerMessages;

          } else if (ApiErrors.ExpiredTokenError === res.error) {
            this.$flash(res.data.detail, 'error');
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
