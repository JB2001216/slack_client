<template>
  <datepicker
    :value="valueText"
    :min="min"
    :max="max"
    :day-str="weekdaysShort"
    :canEdit="!disabled"
    @input="onInput($event)"
  />
</template>

<style lang="stylus">
@import '../../node_modules/@livelybone/vue-datepicker/lib/css/index.css'
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Datepicker } from '@livelybone/vue-datepicker';
import moment from 'moment';

@Component({
  components: {
    Datepicker,
  },
})
export default class MyDatepicker extends Vue {
  @Prop({ default: null })
  value!: Date | null;
  @Prop({ type: String, default: '1900-01-01' })
  min!: string;
  @Prop({ type: String, default: '2100-12-31' })
  max!: string;
  @Prop({ type: Boolean, default: false })
  disabled!: boolean;

  weekdaysShort = moment.weekdaysShort();

  get valueText() {
    return this.dateToString(this.value);
  }

  dateToString(date: Date | null) {
    return this.value ? moment(this.value).format('YYYY-MM-DD') : '';
  }

  onInput(value: string) {
    this.$emit('input', value === '' ? null : new Date(value));
  }
}
</script>
