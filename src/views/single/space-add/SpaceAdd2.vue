<template>
  <div class="columnWrap">
    <div class="columnWrap_left signup">
      <h2>Ernie</h2>
    </div>
    <div class="columnWrap_right">
      <h3>{{ $t('views.spaceAdd.addANewSpace') }}</h3>
      <form @submit.prevent="save()">
        <div class="columnWrap_right_inputText">
          <my-single-form-text-input
            v-model="data.owner.email"
            type="email"
            required
            readonly
          />
          <my-single-form-text-input
            v-model="data.account"
            :message="messages.account || null"
            type="text"
            required
            :placeholder="$t('views.spaceAdd.spaceName')"
            @input="messages.account = null"
          />
          <my-single-form-text-input
            v-model="data.owner.account"
            :message="ownerMessages.account || null"
            type="text"
            required
            :placeholder="$t('views.spaceAdd.userName')"
            @input="ownerMessages.account = null"
          />
        </div>
        <button v-show="false" type="submit" />
      </form>
      <div v-if="backTo" class="columnWrap_right_back">
        <router-link :to="backTo">
          <svg
            width="8"
            height="14"
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.66675 13.5997L7.60956 12.6569L1.00989 6.0572L0.0670837 7.00001L6.66675 13.5997Z" fill="#333333" />
            <path d="M7.60962 1.34314L6.66681 0.40033L0.0670837 7.00001L1.00995 7.9428L7.60962 1.34314Z" fill="#333333" />
          </svg>
          <span>Back</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MySingleFormTextInputMessage } from '@/components/MySingleFormTextInput';
import { apiRegistry, SpacesApi, SpacesPostRequestBody, ApiErrors, getJsonFromResponse } from '@/lib/api';

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
  messages: {[field: string]: MySingleFormTextInputMessage} = {
  };
  ownerMessages: {[field: string]: MySingleFormTextInputMessage} = {
  };

  get backTo() {
    let userId: number | null = null;
    if (this.$store.state.activeUser.myUser) {
      userId = this.$store.state.activeUser.myUser.id;
    } else if (this.$store.state.loggedInUsers.length) {
      userId = this.$store.state.loggedInUsers[0].id;
    }

    if (userId) {
      return {
        name: 'user',
        params: { userId: userId.toString() },
      };
    } else {
      return { name: 'space-add1' };
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
      if (err instanceof Response) {
        const json = await getJsonFromResponse(err);
        if (json && json.error) {
          if (ApiErrors.ValidationError === json.error) {
            const messages: {[field: string]: MySingleFormTextInputMessage} = {};
            const ownerMessages: {[field: string]: MySingleFormTextInputMessage} = {};
            Object.keys(json.data).forEach((k) => {
              if (k === 'owner') {
                Object.keys(json.data.owner).forEach((k) => {
                  ownerMessages[k] = {
                    type: 'error',
                    text: json.data.owner[k],
                  };
                });
              } else {
                messages[k] = {
                  type: 'error',
                  text: json.data[k],
                };
              }
            });
            this.messages = messages;
            this.ownerMessages = ownerMessages;

          } else if (ApiErrors.ExpiredTokenError === json.error) {
            this.$flash(json.data.detail, 'error');
            this.$router.replace({ name: 'space-add1' });
            return;
          }
        }
      }

      this.$appEmit('error', { err });
      this.saving = false;
    }
  }

  beforeMount() {
    this.data.token = this.$route.params['token'];
    this.data.owner.email = this.$route.params['email'];
  }
}
</script>
