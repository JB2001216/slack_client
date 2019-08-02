<template>
  <div class="spaceWrap">
    <div class="spaceWrap_container">
      <h2>Ernie</h2>
      <div class="spaceWrap_box">
        <h3>スペース選択</h3>
        <dl>
          <dd class="clearfix" v-for="u in users" :key="u.id">
            <input type="checkbox" :id="`user${u.id}`" :value="u.id" v-model="checkedUserIds" v-show="false">
            <label :for="`user${u.id}`">{{u.space.displayName || u.space.account}} ({{u.displayName || u.account}})</label>
          </dd>
        </dl>
        <div class="spaceWrap_box_button">
          <input
            type="submit"
            name="send"
            value="選択したスペースにログイン"
            :class="{active: checkedUserIds.length}"
            :disabled="!checkedUserIds.length"
            @click.prevent="login()">
        </div>
        <div class="spaceWrap_box_back">
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
  </div>
</template>

<style lang="stylus" scoped>
.spaceWrap_box dl dd
  label
    cursor: pointer
  input[type="checkbox"]:checked + label
    background: url('~@/assets/images/parts/space-user.svg') no-repeat center left 20px, #4f9589
    color: #fff
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Route, NavigationGuard } from 'vue-router';
import { MyTextInputMessage } from '@/components/MyTextInput';
import { first } from 'rxjs/operators';
import { apiRegistry, UsersApi, SpacesPostRequestBody, SelectLoginUser, ApiErrors } from '@/lib/api';
import { RouteError } from '@/errors';
import store from '@/store';

Component.registerHooks([
  'beforeRouteEnter',
]);

@Component
export default class LoginSpaceSelect extends Vue {
  users: SelectLoginUser[] = [];
  checkedUserIds: number[] = [];
  loginning = false;

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
      return { path: 'login' };
    }
  }

  async login() {
    if (this.loginning) return;
    try {
      this.loginning = true;
      const usersApi = apiRegistry.load(UsersApi);
      const requests = this.users
        .filter((u) => {
          return this.checkedUserIds.includes(u.id) &&
            !this.$store.state.loggedInUsers.find((lu) => lu.id === u.id);
        })
        .map((u) => usersApi.usersLoginPost({
          usersLoginPostRequestBody: {
            token: u.loginToken,
            spaceId: u.space.id,
            userId: u.id,
          },
        }).pipe(first()).toPromise());

      const responses = await Promise.all(requests);
      for (let res of responses) {
        await this.$store.actions.addLoggedInUsers(res.token, true);
      }
      if (!responses.length) {
        this.$router.push(this.backTo);
      } else {
        this.$router.push({
          name: 'user',
          params: {
            userId: responses[0].user.id.toString(),
          },
        });
      }

    } catch (err) {
      this.$showApiError(this, err);
      this.loginning = false;
    }
  }

  async beforeMount() {
    if (this.$route.query.type === 'email') {
      try {
        const usersApi = apiRegistry.load(UsersApi);
        this.users = await usersApi.usersEmailLoginPost({
          usersEmailLoginPostRequestBody: {
            token: this.$route.query.token as string,
            idNotIn: this.$store.state.loggedInUsers.map((u) => u.id),
          },
        }).pipe(first()).toPromise();
      } catch (err) {
        this.$showApiError(this, err);
        this.$router.replace({ name: 'login' });
      }
    }
  }

  async beforeRouteEnter(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    if (to.query.type === 'sms') {
      try {
        const usersApi = apiRegistry.load(UsersApi);
        const users = await usersApi.usersSmsLoginPost({
          usersSmsLoginPostRequestBody: {
            token: to.query.token as string,
            pin: to.query.pin as string,
            idNotIn: store.state.loggedInUsers.map((u) => u.id),
          },
        }).pipe(first()).toPromise();
        return next((vm) => {
          (vm as this).users = users;
        });
      } catch (err) {
        if (err.response && err.response.error === ApiErrors.ExpiredTokenError) {
          return next({ name: 'login-sms' });
        }
        return next(new RouteError(err));
      }
    }

    next();
  }
}
</script>
