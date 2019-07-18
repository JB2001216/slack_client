<template>
  <sub-column-layout active-tab="task">
    <div class="tab_task">
      <div class="task_menu">
        <div class="task_menu_left">
          <a class="task_menu_favorite" href="#">
            <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m12 1.5 2.3574 7.25532h7.6287l-6.1718 4.48408 2.3574 7.2553-6.1717-4.4841-6.17175 4.4841 2.3574-7.2553-6.17174-4.48408h7.62869z" />
            </svg>
          </a>
        </div>
        <div class="task_menu_right">
          <a class="task_menu_search" href="#">
            <span class="t-caption">絞り込み</span>
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m2.8442 3.00008c-.1103-.00153-.2198.0185-.32215.05893-.10236.04043-.19551.10045-.27406.17658-.07855.07612-.14092.16684-.18349.26686-.04258.10003-.0645.20738-.0645.31581s.02192.21578.0645.31581c.04257.10002.10494.19074.18349.26686.07855.07613.1717.13615.27406.17658.10235.04043.21185.06046.32215.05893h.66653l5.99223 7.36356h4.99404l5.9923-7.36356h.6665c.1103.00153.2198-.0185.3222-.05893.1023-.04043.1955-.10045.274-.17658.0786-.07612.1409-.16684.1835-.26686.0426-.10003.0645-.20738.0645-.31581s-.0219-.21578-.0645-.31581c-.0426-.10002-.1049-.19074-.1835-.26686-.0785-.07613-.1717-.13615-.274-.17658-.1024-.04043-.2119-.06046-.3222-.05893zm6.65876 10.63632v7.3636l4.99404-1.6364v-5.7272z" />
            </svg>
          </a>
          <a class="task_menu_sort" href="#">
            <span class="t-caption">優先度順</span>
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m12 20-8.66025-13.5h17.32055z" />
            </svg>
          </a>
        </div>
      </div>
      <div class="task_list">
        <a class="task_add" href="#">
          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m22 13h-19.99999v-2h19.99999z" />
            <path d="m11 22v-20.00003h2v20.00003z" />
          </svg>
          新規タスク
        </a>
        <ul>
          <li class="task_item">
            <div class="task_item_bar"/>
            <div class="task_item_image">
              <img src="@/assets/images/user/user_1.png" alt="">
            </div>
            <div class="task_item_name">ダッシュボード</div>
            <a class="task_item_add" href="#"/>
            <div class="task_item_date">2/28</div>
            <div class="task_item_status status status_1">未着手</div>
          </li>
          <li class="task_item">
            <div class="task_item_bar"/>
            <div class="task_item_image">
              <img src="@/assets/images/user/user_1.png" alt="">
            </div>
            <div class="task_item_name">ダッシュボードの名前が長いバージョン</div>
            <a class="task_item_add" href="#"/>
            <div class="task_item_date">2/28</div>
            <div class="task_item_status status status_1">未着手</div>
          </li>
          <li class="task_item">
            <div class="task_item_bar"/>
            <div class="task_item_image">
              <img src="@/assets/images/user/user_1.png" alt="">
            </div>
            <div class="task_item_name">ダッシュボード</div>
            <a class="task_item_add" href="#"/>
            <div class="task_item_date">2/28</div>
            <div class="task_item_status status status_1">未着手</div>
          </li>
          <li class="task_item">
            <div class="task_item_bar"/>
            <div class="task_item_image">
              <img src="@/assets/images/user/user_1.png" alt="">
            </div>
            <div class="task_item_name">ダッシュボード</div>
            <a class="task_item_add" href="#"/>
            <div class="task_item_date">2/28</div>
            <div class="task_item_status status status_1">未着手</div>
          </li>
          <li class="task_item">
            <div class="task_item_bar"/>
            <div class="task_item_image">
              <img src="@/assets/images/user/user_1.png" alt="">
            </div>
            <div class="task_item_name">ダッシュボード</div>
            <a class="task_item_add" href="#"/>
            <div class="task_item_date">2/28</div>
            <div class="task_item_status status status_1">未着手</div>
          </li>
          <li class="task_item">
            <div class="task_item_bar"/>
            <div class="task_item_image">
              <img src="@/assets/images/user/user_1.png" alt="">
            </div>
            <div class="task_item_name">ダッシュボード</div>
            <a class="task_item_add" href="#"/>
            <div class="task_item_date">2/28</div>
            <div class="task_item_status status status_1">未着手</div>
          </li>
          <li class="task_item">
            <div class="task_item_bar"/>
            <div class="task_item_image">
              <img src="@/assets/images/user/user_1.png" alt="">
            </div>
            <div class="task_item_name">ダッシュボード</div>
            <a class="task_item_add" href="#"/>
            <div class="task_item_date">2/28</div>
            <div class="task_item_status status status_1">未着手</div>
          </li>
          <li class="task_item">
            <div class="task_item_bar"/>
            <div class="task_item_image">
              <img src="@/assets/images/user/user_1.png" alt="">
            </div>
            <div class="task_item_name">ダッシュボード</div>
            <a class="task_item_add" href="#"/>
            <div class="task_item_date">2/28</div>
            <div class="task_item_status status status_1">未着手</div>
          </li>
          <li class="task_item">
            <div class="task_item_bar"/>
            <div class="task_item_image">
              <img src="@/assets/images/user/user_1.png" alt="">
            </div>
            <div class="task_item_name">ダッシュボード</div>
            <a class="task_item_add" href="#"/>
            <div class="task_item_date">2/28</div>
            <div class="task_item_status status status_1">未着手</div>
          </li>
        </ul>
      </div>
    </div>
  </sub-column-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SubColumnLayout from './SubColumnLayout.vue';

@Component({
  components: {
    SubColumnLayout,
  },
})
export default class TasksColumn extends Vue {
}
</script>
