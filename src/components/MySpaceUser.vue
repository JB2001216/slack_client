<template>
  <div :is="tag">
    <slot :user="user" />
  </div>
</template>

<style lang="stylus" scoped>
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { SpaceUser } from '@/lib/api';

@Component
export default class MySpaceUser extends Vue {
  @Prop({ type: String, default: null })
  tag!: string | null;

  @Prop({ type: Number, default: null })
  userId!: number | null;

  user: SpaceUser | null = null;

  async fetchUser() {
    if (this.userId && this.user && this.user.id === this.userId) {
      return;
    }
    this.user = null;
    if (this.userId) {
      try {
        this.user = await this.$store.actions.activeUser.getSpaceUser(this.userId!);
      } catch {}
    }
  }

  @Watch('userId')
  async onUserIdChange(newVal: this['userId'], oldVal: this['userId']) {
    if (newVal && newVal === oldVal && this.user && this.user.id === newVal) {
      return;
    }
    await this.fetchUser();
  }

  async beforeMount() {
    await this.fetchUser();
  }
}
</script>
