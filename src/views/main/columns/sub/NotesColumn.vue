<template>
  <sub-column-layout active-tab="note">
    <div class="tab_note">
      <div class="note_menu">
        <div class="note_menu_left">
          <a class="note_menu_favorite" href="#" :class="{active: isFavorite}" @click.prevent="favorite(!isFavorite)">
            <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m12 1.5 2.3574 7.25532h7.6287l-6.1718 4.48408 2.3574 7.2553-6.1717-4.4841-6.17175 4.4841 2.3574-7.2553-6.17174-4.48408h7.62869z" />
            </svg>
          </a>
        </div>
        <div class="note_menu_right">
          <a class="note_menu_search" href="#">
            <span class="t-caption">{{$t('views.notesColumn.filter')}}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m2.8442 3.00008c-.1103-.00153-.2198.0185-.32215.05893-.10236.04043-.19551.10045-.27406.17658-.07855.07612-.14092.16684-.18349.26686-.04258.10003-.0645.20738-.0645.31581s.02192.21578.0645.31581c.04257.10002.10494.19074.18349.26686.07855.07613.1717.13615.27406.17658.10235.04043.21185.06046.32215.05893h.66653l5.99223 7.36356h4.99404l5.9923-7.36356h.6665c.1103.00153.2198-.0185.3222-.05893.1023-.04043.1955-.10045.274-.17658.0786-.07612.1409-.16684.1835-.26686.0426-.10003.0645-.20738.0645-.31581s-.0219-.21578-.0645-.31581c-.0426-.10002-.1049-.19074-.1835-.26686-.0785-.07613-.1717-.13615-.274-.17658-.1024-.04043-.2119-.06046-.3222-.05893zm6.65876 10.63632v7.3636l4.99404-1.6364v-5.7272z" />
            </svg>
          </a>
          <a class="note_menu_sort" href="#">
            <span class="t-caption">{{$t('views.notesColumn.ordering.priorityOrder')}}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m12 20-8.66025-13.5h17.32055z" />
            </svg>
          </a>
        </div>
      </div>
      <div class="note_list">
        <router-link class="note_add" :to="getNoteAddTo()">
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m22 13h-19.99999v-2h19.99999z" />
            <path d="m11 22v-20.00003h2v20.00003z" />
          </svg>
          {{$t('views.notesColumn.addANewNote')}}
        </router-link>
        <ul>
          <li class="note_item" v-for="n in notes" :key="n.id" @click="$router.push(getNoteTo(n.id))">
            <div class="note_item_bar"/>
            <div class="note_item_image">
              <img src="@/assets/images/subColumn/note_user.svg" alt="">
            </div>
            <div class="note_item_name">{{n.subject}}</div>
            <!-- a class="note_item_add" href="#" /-->
            <my-project-status class="note_item_status" :option="getStatusOption(n.status)" />
          </li>
        </ul>
      </div>
    </div>
  </sub-column-layout>
</template>

<style lang="stylus" scoped>
.note_item
  cursor: pointer
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Location, Route, NavigationGuard } from 'vue-router';
import SubColumnLayout from './SubColumnLayout.vue';
import store from '@/store';

async function fetchNotes(query: Route['query']) {
  await Promise.all([
    store.actions.activeUser.fetchNotes({
      filter: {
        favorite: query['favorite'] === 'true',
      },
    }),
    store.actions.activeUser.fetchNoteStatusOptions(),
  ]);
}

Component.registerHooks([
  'beforeRouteEnter',
]);
@Component({
  components: {
    SubColumnLayout,
  },
})
export default class NotesColumn extends Vue {
  get notes() {
    return this.$store.state.activeUser.notes;
  }

  get statusOptions() {
    return store.state.activeUser.noteStatusOptions;
  }

  get isFavorite() {
    return this.$store.state.activeUser.notesGetConditions &&
      this.$store.state.activeUser.notesGetConditions.filter &&
      this.$store.state.activeUser.notesGetConditions.filter.favorite;
  }

  getStatusOption(optionId: number | null) {
    if (!optionId || !this.statusOptions) {
      return null;
    }
    return this.statusOptions.find((o) => o.id === optionId) || null;
  }

  getNoteAddTo(): Location {
    return {
      name: 'note-add',
      params: {
        userId: this.$route.params.userId,
        projectId: this.$route.params.projectId,
      },
    };
  }

  getNoteTo(noteId: number): Location {
    return {
      name: 'note',
      params: {
        userId: this.$route.params.userId,
        projectId: this.$route.params.projectId,
        noteId: noteId.toString(),
      },
    };
  }

  async favorite(value: boolean) {
    const query: Route['query'] = {};
    if (value) {
      Object.assign(query, { favorite: value.toString() });
    }
    this.$router.push({
      name: 'notes',
      query,
      params: {
        userId: this.$route.params.userId,
        projectId: this.$route.params.projectId,
      },
    }, () => {
      fetchNotes(query);
    });
  }

  async beforeRouteEnter(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    if (to.name === 'notes' || !store.state.activeUser.notes) {
      await fetchNotes(to.name === 'notes' ? to.query : {});
    }
    next();
  }

  async beforeRouteUpdate(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    if (to.name === 'notes' || !store.state.activeUser.notes) {
      await fetchNotes(to.name === 'notes' ? to.query : {});
    }
    next();
  }
}
</script>
