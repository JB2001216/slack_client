<template>
  <div class="option_mainColumn">
    <h3 class="option_mainColumn_title">{{$t('views.setting.main.userAccount.title')}}</h3>
    <div class="option_commonColumn option_spaceProfileAccount">

      <p class="option_spaceProfileAccount_description">
        {{$t('views.setting.main.userAccount.emailDescription')}}
        <strong>{{myUser.email}}</strong>
      </p>

      <h4 class="option_spaceProfileAccount_subTitle">
        {{$t('views.setting.main.userAccount.subTitle')}}
      </h4>

      <div class="option_spaceProfileAccount_email">
        <input type="email" placeholder="sample@gmail.com"
               v-model="newEmailInput"
               @keyup="validateNewEmail">
        <button class="option_spaceProfileAccount_button"
                :disabled="!isNewEmailValid || savingEmail"
                @click="submitNewEmail">
          {{$t('views.setting.main.userAccount.sendEmailBtn')}}
        </button>
      </div>

      <h3 class="option_mainColumn_title">
        SMS ({{$t('views.setting.main.userAccount.phoneNumber')}})
      </h3>

      <div class="option_spaceProfileAccount_tel">
        <input type="tel" placeholder="09011112222"
               minlength="3"
               v-model="phoneNumber"
               @keyup="validatePhoneNumber">
        <button class="option_spaceProfileAccount_button"
                :disabled="!isPhoneNumberValid"
                @click="submitRequestForTemporaryPass">
          {{$t('views.setting.main.userAccount.sendPassBtn')}}
        </button>
      </div>

      <div v-if="showPinHiddenInput" class="option_spaceProfileAccount_password">
        <input type="text" :placeholder="$t('views.setting.main.userAccount.temporaryPassPlaceholder')">
      </div>

      <div class="option_spaceProfileAccount_text">
        <p>{{$t('views.setting.main.userAccount.text')}}</p>
      </div>

      <div v-if="showNotifForEmail" class="option_spaceProfileAccount_sent"
           :style="{ bottom: showNotifForPass ? '125px' : '30px' }"
           @click="showNotifForEmail = false">
        <p>Confirmation email has been sent.</p>
      </div>

      <div v-if="showNotifForPass" class="option_spaceProfileAccount_sent"
           @click="showNotifForPass = false">
        <p>SMS with pincode has been sent.</p>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { apiRegistry, UsersApi } from '@/lib/api';

interface UsersEmailConfirmPostRequest {
  newEmail: string;
}

interface UsersSmsConfirmPostRequest {
  sms: string;
}

type UsersEmailConfirmPost = (req: UsersEmailConfirmPostRequest) => Promise<any>;
type UsersSmsConfirmPost = (req: UsersSmsConfirmPostRequest) => Promise<any>;

@Component
export default class SpaceUserAccount extends Vue {

  newEmailInput: string = '';
  isNewEmailValid: boolean = false;

  phoneNumber: string = '';
  isPhoneNumberValid: boolean = false;

  showNotifForEmail: boolean = false;

  showPinHiddenInput: boolean = false;
  showNotifForPass: boolean = false;

  savingEmail: boolean = false;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get api(): { updateEmail: UsersEmailConfirmPost; updatePassword: UsersSmsConfirmPost } {

    const usersApi = apiRegistry.load(UsersApi, this.myUser.token);

    return {

      updateEmail: async(req: UsersEmailConfirmPostRequest) => {
        await usersApi.usersMeEmailConfirmPost({
          usersMeEmailConfirmPostRequestBody: { email: req.newEmail },
        });
      },

      updatePassword: async(req: UsersSmsConfirmPostRequest) => {
        await usersApi.usersMeSmsConfirmPost({
          usersMeSmsConfirmPostRequestBody: { sms: req.sms },
        });
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
      await this.api.updateEmail({ newEmail: this.newEmailInput });
      this.showNotifForEmail = true;
      this.isNewEmailValid = false;
    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.savingEmail = false;
    }
  }

  async submitRequestForTemporaryPass() {

    this.showNotifForPass = true;
    this.showPinHiddenInput = true;

    this.isPhoneNumberValid = false;

  }

}
</script>
