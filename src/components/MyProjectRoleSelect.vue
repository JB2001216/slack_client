<template>
  <select
    v-if="!disabled && managable"
    class="myProjectRoleSelect"
    :value="value"
    @input="$emit('input', parseInt($event.target.value))"
  >
    <option v-for="r in selectableRoles" :key="r.id" :value="r.id">{{$t(`common.projectRole.${r.key}`)}}</option>
  </select>
  <div v-else class="myProjectRoleSelect">{{currentRoleName}}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SpaceRoles, SpaceRole, ProjectRoles, ProjectRole, Perm } from '@/lib/permissions';

@Component
export default class MySpaceRoleSelect extends Vue {
  @Prop({ required: true })
  mySpaceRole!: SpaceRole;

  @Prop({ required: true })
  myProjectRole!: ProjectRole | null;

  @Prop({ required: true })
  currentSpaceRole!: SpaceRole;

  @Prop({ default: null })
  currentProjectRole!: ProjectRole | null;

  @Prop({ default: null })
  value!: number | null;

  @Prop({ default: false })
  disabled!: boolean;

  get managable() {
    if (!this.mySpaceRole.perms.includes(Perm.UPDATE_PROJECT_USER) &&
        !(this.mySpaceRole.settableProjectRole && this.myProjectRole && this.myProjectRole.perms.includes(Perm.UPDATE_PROJECT_USER))
    ) {
      return false;
    }
    if (!this.currentSpaceRole.settableProjectRole) {
      return false;
    }
    if (this.myProjectRole && this.currentProjectRole && !this.myProjectRole.checkManageable(this.currentProjectRole)) {
      return false;
    }
    return true;
  }

  get selectableRoles() {
    if (!this.managable) {
      return [];
    }
    return [...ProjectRoles.getSelectables(this.mySpaceRole, this.myProjectRole)];
  }

  get currentRoleName() {
    if (!this.currentSpaceRole.settableProjectRole) {
      return this.$t(`common.spaceRole.${this.currentSpaceRole.key}`);
    }
    if (this.currentProjectRole) {
      return this.$t(`common.projectRole.${this.currentProjectRole.key}`);
    }
    return '';
  }
}
</script>
