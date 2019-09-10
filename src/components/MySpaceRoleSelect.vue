<template>
  <select
    :value="value"
    :disabled="disabled || !managable"
    @input="$emit('input', parseInt($event.target.value))"
  >
    <option v-for="r in selectableRoles" :key="r.id" :value="r.id">{{$t(`common.spaceRole.${r.key}`)}}</option>
  </select>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SpaceRoles, SpaceRole, Perm } from '@/lib/permissions';

@Component
export default class MySpaceRoleSelect extends Vue {
  @Prop({ required: true })
  myRole!: SpaceRole;

  @Prop({ default: null })
  currentRole!: SpaceRole | null;

  @Prop({ default: null })
  value!: number | null;

  @Prop({ default: false })
  disabled!: boolean;

  get managable() {
    if (!this.myRole.perms.includes(Perm.UPDATE_SPACE_USER)) {
      return false;
    }
    if (this.currentRole && !this.myRole.checkManageable(this.currentRole)) {
      return false;
    }
    return true;
  }

  get selectableRoles() {
    if (!this.managable) {
      return [...SpaceRoles.all()];
    }
    return [...SpaceRoles.getSelectables(this.myRole)];
  }
}
</script>
