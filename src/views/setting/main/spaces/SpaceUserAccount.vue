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
        <input type="email" placeholder="sample@gmail.com">
        <button class="option_spaceProfileAccount_button">
          {{$t('views.setting.main.userAccount.sendEmailBtn')}}
        </button>
      </div>

      <h3 class="option_mainColumn_title">
        SMS ({{$t('views.setting.main.userAccount.phoneNumber')}})
      </h3>

      <div class="option_spaceProfileAccount_tel">
        <input type="text" placeholder="09011112222">
        <button class="option_spaceProfileAccount_button">
          {{$t('views.setting.main.userAccount.sendPassBtn')}}
        </button>
      </div>

      <div class="option_spaceProfileAccount_password">
        <input type="text" :placeholder="$t('views.setting.main.userAccount.temporaryPassPlaceholder')">
      </div>

      <div class="option_spaceProfileAccount_text">
        <p>{{$t('views.setting.main.userAccount.text')}}</p>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SpaceUserAccount extends Vue {

  get myUser() {
    return this.$store.state.activeUser.myUser;
  }

}
</script>
