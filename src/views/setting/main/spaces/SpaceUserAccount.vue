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

      <div class="option_spaceProfileAccount_inputRow option_spaceProfileAccount_inputRowEmail">
        <input
          v-model="newEmailInput"
          type="email"
          placeholder="sample@gmail.com"
          class="basicInput"
          @keyup="validateNewEmail"
        >
        <button
          class="basicButtonPrimary option_spaceProfileAccount_inputRow_btn"
          :disabled="!isNewEmailValid || savingEmail"
          @click="submitNewEmail"
        >
          {{ $t('views.setting.main.userAccount.sendEmailBtn') }}
        </button>
      </div>

      <h3 class="option_mainColumn_title">
        SMS ({{ $t('views.setting.main.userAccount.phoneNumber') }})
      </h3>

      <div class="option_spaceProfileAccount_inputRow option_spaceProfileAccount_inputRowTel">
        <input
          v-model="phoneNumber"
          type="tel"
          placeholder="+819011112222"
          minlength="3"
          class="basicInput"
          @keyup="validatePhoneNumber"
        >
        <button
          class="basicButtonPrimary option_spaceProfileAccount_inputRow_btn"
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
    </div>

    <my-confirm-change-discard-dialog
      :changes="changes"
      :next="!!nextForConfirmChangeDiscard"
      @answer="onAnswerForConfirmChangeDiscardDialog"
    />
  </div>
</template>


<style lang="stylus">
.option_spaceProfileAccount
  &_inputRow
    input
      width: 100%
      padding: 7px 15px
      margin-top: 15px
      margin-right: 15px
    &Email
      input
        max-width: 305px
    &Tel
      input
        max-width: 200px
    &_btn
      margin-top: 15px
      vertical-align: top
</style>


<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { apiRegistry, UsersApi, UsersMeEmailConfirmPostRequestBody, UsersMeSmsConfirmPostRequestBody, UsersMeSmsPutRequestBody } from '@/lib/api';
import ConfirmChangeDiscardForSettingMixin from '@/mixins/ConfirmChangeDiscardForSettingMixin';

@Component
export default class SpaceUserAccount extends Mixins(ConfirmChangeDiscardForSettingMixin) {

  newEmailInput: string = '';
  savedNewEmail: string | null = null;
  isNewEmailValid: boolean = false;

  phoneNumber: string = '';
  savedPhoneNumber: string | null = null;
  isPhoneNumberValid: boolean = false;

  showPinHiddenInput: boolean = false;

  pin: string = '';

  smsToken: string = '';

  savingEmail: boolean = false;
  savingConfirmSMS: boolean = false;
  savingSMS: boolean = false;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get changes() {
    if (this.newEmailInput !== '' && this.newEmailInput !== this.myUser.email && (!this.savedNewEmail || this.newEmailInput !== this.savedNewEmail)) {
      return true;
    }
    if (
      (this.phoneNumber !== '' && (!this.savedPhoneNumber || this.phoneNumber !== this.savedPhoneNumber)) ||
      this.showPinHiddenInput
    ) {
      return true;
    }
    return false;
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
      this.$flash(this.$t('views.setting.main.userAccount.confirmEmailHasBeenSent').toString(), 'success');
      this.isNewEmailValid = false;
      this.savedNewEmail = this.newEmailInput;
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
      this.$flash(this.$t('views.setting.main.userAccount.smsWithPincodeHasBeenSent').toString(), 'success');
      this.showPinHiddenInput = true;
      this.isPhoneNumberValid = false;
      this.savedPhoneNumber = this.phoneNumber;
    } catch (err) {
      this.$appEmit('error', { err, options: { firstMessageOnValidationError: true } });
    } finally {
      this.savingConfirmSMS = false;
    }
  }

  async submitSmsChange() {
    if (!this.api) return;
    try {
      this.savingSMS = true;
      const res = await this.api.updateSMS({ token: this.smsToken, pin: this.pin });
      // this.$flash(this.$t('views.setting.main.statusFlow.updatedMessage').toString(), 'success'); (!!! moved to events-subscription.ts)
      this.showPinHiddenInput = false;

    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.savingSMS = false;
    }
  }

}
</script>
