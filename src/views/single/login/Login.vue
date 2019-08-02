<template>
  <div class="columnWrap">
    <div class="columnWrap_left login">
      <h2>Ernie</h2>
    </div>
    <div class="columnWrap_right">
      <h3><strong>ログイン</strong></h3>
      <p class="columnWrap_right_description">お帰りなさい！今日もスムーズに仕事を進めましょう。</p>
      <p class="columnWrap_right_learn"><a href="" target="_blank" @click.prevent>Learn more</a></p>
      <form @submit.prevent="login()">
        <div class="columnWrap_right_inputText">
          <my-text-input v-model="email" :message="emailMessage" type="email" placeholder="メールアドレス" />
        </div>
        <button type="submit" v-show="false" />
      </form>
      <div class="columnWrap_right_login">
        <router-link :to="{name: 'login-sms'}">SMSでログインする</router-link>
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
import { first } from 'rxjs/operators';
import { AjaxError } from 'rxjs/ajax';
import { apiRegistry, UsersApi, ApiErrors } from '@/lib/api';

@Component
export default class Login extends Vue {
  loginning = false;
  email = '';
  emailMessage: MyTextInputMessage = null;

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

  async login() {
    if (this.loginning) {
      return;
    }

    const usersApi = apiRegistry.load(UsersApi);

    try {
      this.loginning = true;

      await usersApi.usersEmailLoginConfirmPost({
        usersEmailLoginConfirmPostRequestBody: {
          email: this.email,
          idNotIn: this.$store.state.loggedInUsers.map((u) => u.id),
        },
      }).pipe(first()).toPromise();

      this.emailMessage = {
        type: 'success',
        text: 'ログイン用URLを送信しました。',
      };

    } catch (err) {
      if (err instanceof AjaxError) {
        if (err.response) {
          if (err.response.error === ApiErrors.ValidationError) {
            this.emailMessage = {
              type: 'error',
              text: err.response.data[Object.keys(err.response.data)[0]],
            };
          }
          if (err.response.error === ApiErrors.LoginUserNotFound) {
            this.$flash('ログイン可能なユーザーが見つかりませんでした', 'error');
            return;
          }
        }
      }

      this.$showApiError(this, err);

    } finally {
      this.loginning = false;
    }
  }
}
</script>
