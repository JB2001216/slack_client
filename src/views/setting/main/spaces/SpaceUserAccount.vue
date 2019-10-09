<template>
  <div class="option_mainColumn">
    <h3 class="option_mainColumn_title">
      {{ $t('views.setting.main.userAccount.title') }}
    </h3>
    <div class="option_commonColumn option_spaceProfileAccount">
      <p class="option_spaceProfileAccount_description">
        {{ $t('views.setting.main.userAccount.emailDescription') }}
        <strong>{{ myUser.email }}</strong>
      </p>

      <h4 class="option_spaceProfileAccount_subTitle">
        {{ $t('views.setting.main.userAccount.subTitle') }}
      </h4>

      <div class="option_spaceProfileAccount_email">
        <input
          v-model="newEmailInput"
          type="email"
          placeholder="sample@gmail.com"
          @keyup="validateNewEmail"
        >
        <button
          class="option_spaceProfileAccount_button"
          :disabled="!isNewEmailValid || savingEmail"
          @click="submitNewEmail"
        >
          {{ $t('views.setting.main.userAccount.sendEmailBtn') }}
        </button>
      </div>

      <h3 class="option_mainColumn_title">
        SMS ({{ $t('views.setting.main.userAccount.phoneNumber') }})
      </h3>

      <div class="option_spaceProfileAccount_tel">
        <input
          v-model="phoneNumber"
          type="tel"
          placeholder="+819011112222"
          minlength="3"
          @keyup="validatePhoneNumber"
        >
        <button
          class="option_spaceProfileAccount_button"
          :disabled="!isPhoneNumberValid || savingConfirmSMS"
          @click="submitForPincode"
        >
          {{ $t('views.setting.main.userAccount.sendPassBtn') }}
        </button>
      </div>

      <div v-if="showPinHiddenInput" class="option_spaceProfileAccount_password">
        <input
          v-model="pin"
          type="text"
          :placeholder="$t('views.setting.main.userAccount.temporaryPassPlaceholder')"
          @keyup.enter="!savingSMS ? submitSmsChange() : ''"
        >
      </div>

      <div class="option_spaceProfileAccount_text">
        <p>{{ $t('views.setting.main.userAccount.text') }}</p>
      </div>

      <div
        v-if="showNotifForEmail"
        class="option_spaceProfileAccount_sent"
        :style="{ bottom: showNotifForSMS ? '125px' : '30px' }"
        @click="showNotifForEmail = false"
      >
        <p>Confirmation email has been sent.</p>
      </div>

      <div
        v-if="showNotifForSMS"
        class="option_spaceProfileAccount_sent"
        @click="showNotifForSMS = false"
      >
        <p>SMS with pincode has been sent.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { apiRegistry, UsersApi, UsersMeEmailConfirmPostRequestBody, UsersMeSmsConfirmPostRequestBody, UsersMeSmsPutRequestBody } from '@/lib/api';

@Component
export default class SpaceUserAccount extends Vue {

  newEmailInput: string = '';
  isNewEmailValid: boolean = false;

  phoneNumber: string = '';
  isPhoneNumberValid: boolean = false;

  showNotifForEmail: boolean = false;

  showPinHiddenInput: boolean = false;
  showNotifForSMS: boolean = false;

  pin: string = '';

  smsToken: string = '';

  savingEmail: boolean = false;
  savingConfirmSMS: boolean = false;
  savingSMS: boolean = false;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get api() {
    const usersApi = apiRegistry.load(UsersApi, this.myUser.token);

    return {
      updateEmail: async(req: UsersMeEmailConfirmPostRequestBody) => {
        await usersApi.usersMeEmailConfirmPost({
          usersMeEmailConfirmPostRequestBody: req,
        });
      },

      confirmSMS: async(req: UsersMeSmsConfirmPostRequestBody) => {
        const res = await usersApi.usersMeSmsConfirmPost({
          usersMeSmsConfirmPostRequestBody: req,
        });
        return res;
      },

      updateSMS: async(req: UsersMeSmsPutRequestBody) => {
        const res = await usersApi.usersMeSmsPut({
          usersMeSmsPutRequestBody: req,
        });
        return res;
      },
    };
  }

  validateNewEmail(event: any) {
    const target = event.target;

    if (this.newEmailInput.trim() === '' || !target.validity.valid || this.newEmailInput === this.myUser.email) { this.isNewEmailValid = false; } else { this.isNewEmailValid = true; }
  }

  validatePhoneNumber(event: any) {
    const target = event.target;

    if (this.phoneNumber.trim() === '' || !target.validity.valid) { this.isPhoneNumberValid = false; } else { this.isPhoneNumberValid = true; }
  }

  async submitNewEmail() {
    if (!this.api) return;

    try {
      this.savingEmail = true;
      await this.api.updateEmail({ email: this.newEmailInput });
      this.showNotifForEmail = true;
      this.isNewEmailValid = false;
    } catch (err) {
      this.$appEmit('error', { err, options: { firstMessageOnValidationError: true } });
    } finally {
      this.savingEmail = false;
    }
  }

  async submitForPincode() {
    if (!this.api) return;
    try {
      this.savingConfirmSMS = true;
      const smsRes = await this.api.confirmSMS({ sms: this.phoneNumber });
      this.smsToken = smsRes.token;
      this.showNotifForSMS = true;
      this.showPinHiddenInput = true;
      this.isPhoneNumberValid = false;
    } catch (err) {
      this.$appEmit('error', { err, options: { firstMessageOnValidationError: true } });
    } finally {
      this.savingConfirmSMS = false;
    }
  }

  async submitSmsChange() {
    if (!this.api) return;
    try {
      this.showNotifForSMS = false;
      this.savingSMS = true;
      const res = await this.api.updateSMS({ token: this.smsToken, pin: this.pin });
      this.$flash(this.$t('views.setting.main.statusFlow.updatedMessage').toString(), 'success');
    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.savingSMS = false;
    }
  }

}
</script>
