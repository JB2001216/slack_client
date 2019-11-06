<template>
  <my-modal
    :value="showed"
    class="myConfirmChangeDiscardDialog modalDialog"
    content-class="modalDialog_content"
    @input="onInput($event)"
  >
    <div class="modalDialog_content_title">
      {{ title || $t('components.myConfirmChangeDiscardDialog.title') }}
    </div>
    <div class="modalDialog_content_description">
      {{ description || $t('components.myConfirmChangeDiscardDialog.description') }}
    </div>
    <div class="modalDialog_content_footerButtons">
      <button class="modalDialog_content_footerButtons_button basicButtonDanger" @click="onAnswer('yes')">
        {{ $t('common.yes') }}
      </button>
      <button class="modalDialog_content_footerButtons_button basicButtonNormal" @click="onAnswer('no')">
        {{ $t('common.no') }}
      </button>
    </div>
  </my-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { TranslateResult } from 'vue-i18n';

@Component
export default class MyConfirmChangeDiscardDialog extends Vue {

  @Prop({ default: null })
  title!: TranslateResult | null;

  @Prop({ default: null })
  description!: TranslateResult | null;

  @Prop({ type: Boolean, required: true })
  changes!: boolean;

  @Prop({ type: Boolean, default: false })
  next!: boolean;

  get showed() {
    return this.changes && !!this.next;
  }

  onInput(value: boolean) {
    if (!value) {
      this.onAnswer('no');
    }
  }

  onAnswer(answer: 'yes' | 'no') {
    this.$emit('answer', answer);
  }
}
</script>
