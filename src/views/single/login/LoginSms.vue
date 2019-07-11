<template>
  <div class="columnWrap">
    <div class="columnWrap_left login">
      <h2>Ernie</h2>
    </div>
    <div class="columnWrap_right">
      <h3><strong>SMSログイン</strong></h3>
      <p class="columnWrap_right_description">お帰りなさい！今日もスムーズに仕事を進めましょう。</p>
      <p class="columnWrap_right_learn"><a href="" target="_blank" @click.prevent>Learn more</a></p>
      <div class="columnWrap_right_inputText">
        <my-text-input placeholder="電話番号を入力" :message="{ type: 'success', text: 'ワンタイムパスワードを送信しました' }" />
        <my-text-input placeholder="ワンタイムパスワード" :message="{ type: 'error', text: 'パスワードが違います' }" />
      </div>
      <div class="columnWrap_right_login">
        <router-link :to="{name: 'login'}">メールアドレスでログインする</router-link>
      </div>
      <div class="columnWrap_right_back">
        <a href="">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.66675 13.5997L7.60956 12.6569L1.00989 6.0572L0.0670837 7.00001L6.66675 13.5997Z" fill="#333333"/>
            <path d="M7.60962 1.34314L6.66681 0.40033L0.0670837 7.00001L1.00995 7.9428L7.60962 1.34314Z" fill="#333333"/>
          </svg>
          <span>Back</span>
        </a>
      </div>
    </div>
  </div>
</template>
