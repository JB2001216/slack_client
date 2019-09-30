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

  get user(): SpaceUser | null {
    if (!this.userId) return null;
    return this.$store.state.activeUser.spaceUsers.find((su) => su.id === this.userId) || null;
  }

  async fetchUser() {
    if (!this.userId) return;
    await this.$store.actions.activeUser.getSpaceUser(this.userId);
  }

  @Watch('userId')
  async onUserIdChange(newVal: this['userId'], oldVal: this['userId']) {
    if (newVal && newVal === oldVal) {
      const user = this.user;
      if (user && user.id === newVal) {
        return;
      }
    }
    await this.fetchUser();
  }

  async beforeMount() {
    await this.fetchUser();
  }
}
</script>
