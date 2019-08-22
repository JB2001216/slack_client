<template>
  <div class="columnWrap">
    <div class="columnWrap_left login">
      <h2>Ernie</h2>
    </div>
    <div class="columnWrap_right">
      <h3><strong>{{$t('views.login.smsLogin')}}</strong></h3>
      <p class="columnWrap_right_description">{{$t('views.login.welcomeHomeLetsWorkSmoothlyToday')}}</p>
      <p class="columnWrap_right_learn"><a href="" target="_blank" @click.prevent>Learn more</a></p>
      <div class="columnWrap_right_inputText">
        <form @submit.prevent="send()">
          <my-text-input v-model="sms" :placeholder="$t('views.login.enterThePhoneNumber')" :message="smsMessage" />
        </form>
        <form v-if="token" @submit.prevent="auth()">
          <my-text-input v-model="pin" :placeholder="$t('views.login.enterPin')" :message="pinMessage" />
        </form>
      </div>
      <div class="columnWrap_right_login">
        <router-link :to="{name: 'login'}">{{$t('views.login.loginUsingEmail')}}</router-link>
      </div>
      <div class="columnWrap_right_back">
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
import { apiRegistry, UsersApi, ApiErrors, getJsonFromResponse } from '@/lib/api';

@Component
export default class LoginSms extends Vue {
  sms = ''
  pin = ''
  smsMessage: MyTextInputMessage = null;
  pinMessage: MyTextInputMessage = null;
  token: string | null = null;

  async send() {
    const usersApi = apiRegistry.load(UsersApi);
    try {
      const res = await usersApi.usersSmsLoginConfirmPost({
        usersSmsLoginConfirmPostRequestBody: {
          sms: this.sms,
          idNotIn: this.$store.state.loggedInUsers.map((u) => u.id),
        },
      });
      this.token = res.token;
      this.smsMessage = { type: 'success', text: this.$t('views.login.yourPinHasBeenSent').toString() };

    } catch (err) {
      if (err instanceof Response) {
        const json = await getJsonFromResponse(err);
        if (json && json.error === ApiErrors.ValidationError) {
          this.smsMessage = {
            type: 'error',
            text: json.data[Object.keys(json.data)[0]],
          };
        }
      }
      this.$showAppError(this, err);
    }
  }

  auth() {
    this.$router.push(
      {
        name: 'login-space-select',
        query: {
          type: 'sms',
          token: this.token!,
          pin: this.pin,
        },
      },
      undefined,
      (err) => {
        this.$showAppError(this, err);
      }
    );
  }

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
}
</script>
