<template>
  <div class="editTagsWrap">
    <div class="tagsList">
      <div class="editTagsWrap_tagLabel">
        <my-svg-icon class="editTagsWrap_tagLabel_icon" name="tag" />
        <span>{{ $t('views.taskColumn.tags.tags') }}</span>
      </div>
      <div class="editTagsWrap_addNewTag">
        <span>{{ '+ ' + $t('views.taskColumn.tags.addNewTag') }}</span>
      </div>
      <ul>
        <li v-for="tag in tags" :key="tag.name" class="tagItem">
          <span>{{ tag.name }}</span>
          <button class="closeButton">
            <span class="closeButton_text">×</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="tagDetails">
      <button @click="onEndEditTags()">
        sdfasdf
      </button>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
@import '../../../../../stylus/_settings'

.editTagsWrap
  display: grid
  grid-template-areas: 'tagsList tagDetails'
  grid-template-columns: 200px calc(100vw - 200px)
  grid-template-rows: 1fr
  grid-gap: 0
  height: 100%
  .tagsList
    grid-area: tagsList
    padding-top: $sizes.windowMarginTop
    background: lightgray
    .tagItem
      padding: 5px 20px
      display: list-item
      &:hover
        background: #a0a0a0
        .closeButton
          display: block
      .active
        background: gray
      .closeButton
        border: 0
        background: none
        display: none
        float: right;
        &_text
          background: gray
          border-radius: 50%
          width: 20px
          height: 20px
          font-size: 15px
          display: block
          text-align: center
          color: lightgray
  .tagDetails
    grid-area: tagDetails
    padding-top: $sizes.windowMarginTop
  &_tagLabel
    margin: 20px
    align-items: center
    display: flex
    &_icon
      --mySvgIconSize: 24px
      --mySvgIconColor: $themeColors.icon
      margin-right: 5px
    &:hover
      --mySvgIconColor: $themeColors.iconDarken1
  &_addNewTag
    margin: 20px
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Location, Route, NavigationGuard } from 'vue-router';
import * as api from '@/lib/api';
import store from '@/store';

@Component
export default class TagColumn extends Vue {

  @Prop({ type: Array, default: [] })
  tags!: api.SpacesSpaceIdProjectsProjectIdTasksTags[];

  onEndEditTags() {
    this.$emit('end-edit-tags');
  }
}
</script>
