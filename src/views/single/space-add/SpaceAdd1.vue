<template>
  <div class="columnWrap">
    <div class="columnWrap_left signup">
      <h2>Ernie</h2>
    </div>
    <div class="columnWrap_right">
      <h3>Welcome to <strong>Ernie.</strong></h3>
      <p class="columnWrap_right_description">{{$t('views.spaceAdd.topMessage')}}</p>
      <p class="columnWrap_right_learn"><a href="" target="_blank">Learn more</a></p>
      <form @submit.prevent="save()">
        <div class="columnWrap_right_inputText">
          <my-text-input
            v-model="email"
            type="email"
            required
            :message="emailMessage"
            :placeholder="$t('views.spaceAdd.enterTheEmail')"
            @input="emailMessage = null"
          />
        </div>
        <button type="submit" v-show="false" />
      </form>
      <div class="columnWrap_right_login">
        <p>{{$t('views.spaceAdd.doYouAlreadyHaveAnAccount')}}</p>
        <router-link :to="{name: 'login'}">{{$t('views.spaceAdd.login')}}</router-link>
      </div>
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
import { apiRegistry, SpacesApi, ApiErrors, getJsonFromResponse } from '@/lib/api';

@Component
export default class SpaceAdd1 extends Vue {
  email = '';
  emailMessage: MyTextInputMessage = null;
  saving = false;

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
    }
    return null;
  }

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
      });

      this.emailMessage = {
        type: 'success',
        text: this.$t('views.spaceAdd.theRegistrationURLHasBeenSent').toString(),
      };

    } catch (err) {
      if (err instanceof Response) {
        const json = await getJsonFromResponse(err);
        if (json && json.error === ApiErrors.ValidationError) {
          this.emailMessage = {
            type: 'error',
            text: json.data[Object.keys(json.data)[0]],
          };
        }
      }

      this.$showAppError(this, err);
    }

    this.saving = false;
  }
}
</script>
