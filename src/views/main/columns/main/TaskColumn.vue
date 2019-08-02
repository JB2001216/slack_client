<template>
  <div class="mainColumn" :class="{editMode}" v-if="task">
    <div class="mainColumn_head columnTitle">
      <h2>
        <input v-if="editMode" v-model="task.subject" type="text" style="background:none;">
        <span v-else>{{task.subject}}</span>
        <a v-if="!isAdd && !editMode" href="" class="edit" @click.prevent="editMode = true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1501 0.333313C10.9705 0.333313 10.7908 0.401712 10.6539 0.538905L9.45605 1.73682L12.263 4.54384L13.4609 3.34592C13.7353 3.07154 13.7353 2.62728 13.4609 2.3536L11.6463 0.538905C11.5091 0.401712 11.3297 0.333313 11.1501 0.333313ZM8.40343 2.78945L0.333374 10.8596V13.6666H3.14035L11.2104 5.59647L8.40343 2.78945Z" fill="#333333"/>
          </svg>
        </a>
      </h2>

      <div class="search">
        <input type="search" placeholder="キーワードで絞り込む">
        <button class="search_button">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.607 0.666656C3.78223 0.666656 0.666748 3.78213 0.666748 7.60691C0.666748 11.4317 3.78223 14.5472 7.607 14.5472C9.27024 14.5472 10.7977 13.9565 11.9948 12.9761L16.1386 17.1199C16.2026 17.1865 16.2792 17.2397 16.3639 17.2764C16.4487 17.313 16.5399 17.3323 16.6323 17.3333C16.7246 17.3342 16.8162 17.3167 16.9017 17.2818C16.9872 17.2469 17.0648 17.1953 17.1301 17.13C17.1954 17.0647 17.247 16.9871 17.2819 16.9016C17.3168 16.8161 17.3343 16.7245 17.3334 16.6322C17.3324 16.5398 17.3131 16.4486 17.2765 16.3639C17.2398 16.2791 17.1866 16.2025 17.12 16.1385L12.9762 11.9947C13.9566 10.7976 14.5473 9.27015 14.5473 7.60691C14.5473 3.78213 11.4318 0.666656 7.607 0.666656ZM7.607 2.05471C10.6816 2.05471 13.1592 4.53229 13.1592 7.60691C13.1592 10.6815 10.6816 13.1591 7.607 13.1591C4.53238 13.1591 2.0548 10.6815 2.0548 7.60691C2.0548 4.53229 4.53238 2.05471 7.607 2.05471Z" fill="#C4C4C4" />
          </svg>
        </button>
      </div>
    </div>
    <div class="mainColumn_body">
      <div class="dashboardWrap">
        <div class="dashboardWrap_list">
          <dl class="dashboardWrap_list_user">
            <dd class="active">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                  <rect width="32" height="32" rx="16" fill="#E2E2E2"/>
                </mask>
                <g mask="url(#mask0)">
                  <rect width="32" height="32" rx="16" fill="#6FCF97"/>
                  <rect x="10" y="4" width="12" height="12" rx="6" fill="white"/>
                  <rect x="1" y="17" width="31" height="31" rx="15.5" fill="white"/>
                </g>
              </svg>
            </dd>
            <dd>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                  <rect width="32" height="32" rx="16" fill="#E2E2E2"/>
                </mask>
                <g mask="url(#mask0)">
                  <rect width="32" height="32" rx="16" fill="#56CCF2"/>
                  <rect x="10" y="4" width="12" height="12" rx="6" fill="white"/>
                  <rect x="1" y="17" width="31" height="31" rx="15.5" fill="white"/>
                </g>
              </svg>
            </dd>
            <dd>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                  <rect width="32" height="32" rx="16" fill="#E2E2E2"/>
                </mask>
                <g mask="url(#mask0)">
                  <rect width="32" height="32" rx="16" fill="#4F9589"/>
                  <rect x="10" y="4" width="12" height="12" rx="6" fill="white"/>
                  <rect x="1" y="17" width="31" height="31" rx="15.5" fill="white"/>
                </g>
              </svg>
            </dd>
            <dd>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                  <rect width="32" height="32" rx="16" fill="#E2E2E2"/>
                </mask>
                <g mask="url(#mask0)">
                  <rect width="32" height="32" rx="16" fill="#DE6868"/>
                  <rect x="10" y="4" width="12" height="12" rx="6" fill="white"/>
                  <rect x="1" y="17" width="31" height="31" rx="15.5" fill="white"/>
                </g>
              </svg>
            </dd>
            <dd>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                  <rect width="32" height="32" rx="16" fill="#E2E2E2"/>
                </mask>
                <g mask="url(#mask0)">
                  <rect width="32" height="32" rx="16" fill="#BB6BD9"/>
                  <rect x="10" y="4" width="12" height="12" rx="6" fill="white"/>
                  <rect x="1" y="17" width="31" height="31" rx="15.5" fill="white"/>
                </g>
              </svg>
            </dd>
            <dd class="dots">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6.61537 12.3077C6.61537 13.5822 5.58219 14.6154 4.30769 14.6154C3.03319 14.6154 2 13.5822 2 12.3077C2 11.0332 3.03319 10 4.30769 10C5.58219 10 6.61537 11.0332 6.61537 12.3077ZM14.3078 12.3077C14.3078 13.5822 13.2746 14.6154 12.0001 14.6154C10.7256 14.6154 9.69242 13.5822 9.69242 12.3077C9.69242 11.0332 10.7256 10 12.0001 10C13.2746 10 14.3078 11.0332 14.3078 12.3077ZM19.6924 14.6154C20.9669 14.6154 22.0001 13.5822 22.0001 12.3077C22.0001 11.0332 20.9669 10 19.6924 10C18.4179 10 17.3847 11.0332 17.3847 12.3077C17.3847 13.5822 18.4179 14.6154 19.6924 14.6154Z" fill="#333333"/>
              </svg>
            </dd>
          </dl>
          <dl v-if="!editMode" class="dashboardWrap_list_menu">
            <dd>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.16667 2V5.33333H7.83333V2H6.16667ZM16.1667 2V5.33333H17.8333V2H16.1667ZM2.83333 4.5C2.37435 4.5 2 4.87435 2 5.33333V7.83333C2 8.29232 2.37435 8.66667 2.83333 8.66667V22H21.1667V8.66667C21.6257 8.66667 22 8.29232 22 7.83333V5.33333C22 4.87435 21.6257 4.5 21.1667 4.5H18.6667V6.16667H15.3333V4.5H8.66667V6.16667H5.33333V4.5H2.83333ZM4.5 8.66667H19.5V20.3333H4.5V8.66667ZM6.16667 10.3333V12H7.83333V10.3333H6.16667ZM9.5 10.3333V12H11.1667V10.3333H9.5ZM12.8333 10.3333V12H14.5V10.3333H12.8333ZM16.1667 10.3333V12H17.8333V10.3333H16.1667ZM6.16667 13.6667V15.3333H7.83333V13.6667H6.16667ZM9.5 13.6667V15.3333H11.1667V13.6667H9.5ZM12.8333 13.6667V15.3333H14.5V13.6667H12.8333ZM16.1667 13.6667V15.3333H17.8333V13.6667H16.1667ZM6.16667 17V18.6667H7.83333V17H6.16667ZM9.5 17V18.6667H11.1667V17H9.5ZM12.8333 17V18.6667H14.5V17H12.8333ZM16.1667 17V18.6667H17.8333V17H16.1667Z" fill="#333333" fill-opacity="0.72"/>
              </svg>
            </dd>
            <dd>
              <svg @click="favorite(!isFavorite)" class="favoriteIcon" :class="{active: isFavorite}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1.5L14.3574 8.75532H21.9861L15.8143 13.2394L18.1717 20.4947L12 16.0106L5.82825 20.4947L8.18565 13.2394L2.01391 8.75532H9.6426L12 1.5Z" fill="#333333" fill-opacity="0.72"/>
              </svg>
            </dd>
            <dd>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.4161 1.50552C16.0844 1.56935 14.8038 2.15025 13.8139 3.13969L9.93066 7.02087C10.5406 6.40805 12.8047 6.82936 13.354 7.37834L15.7044 5.02921C16.2249 4.50896 16.8764 4.18978 17.5438 4.16105C17.9973 4.13871 18.6391 4.23447 19.2044 4.79941C19.7313 5.32604 19.8431 5.93886 19.8431 6.35698C19.8431 7.05598 19.5237 7.75178 18.9745 8.29757L14.8869 12.4085C13.8586 13.4363 12.2938 13.5193 11.3869 12.6128C10.8695 12.0958 10.0169 12.0926 9.49635 12.6128C8.97582 13.1331 8.97582 13.9821 9.49635 14.5023C10.4288 15.4343 11.6551 15.9067 12.9197 15.9067C14.2865 15.9067 15.682 15.3481 16.7518 14.2725L20.865 10.1871C21.9092 9.14657 22.5 7.75497 22.5 6.35698C22.5 5.05794 22.0082 3.82273 21.0949 2.90989C20.1177 1.93321 18.8052 1.44168 17.4161 1.50552ZM11.0803 8.09329C9.7135 8.09329 8.29562 8.65504 7.22263 9.72747L3.13504 13.8129C2.09078 14.8534 1.5 16.245 1.5 17.643C1.5 18.9421 1.99179 20.1773 2.90511 21.0901C3.8823 22.0668 5.1948 22.5583 6.58394 22.4945C7.9156 22.4307 9.19617 21.8498 10.1861 20.8603L14.0693 16.9791C13.4562 17.592 11.1953 17.1706 10.646 16.6217L8.29562 18.9708C7.77509 19.491 7.12363 19.807 6.4562 19.8389C6.00274 19.8613 5.36086 19.7655 4.79562 19.2006C4.2687 18.674 4.15693 18.0579 4.15693 17.643C4.15693 16.944 4.47628 16.2482 5.02555 15.7024L9.11314 11.5915C10.1414 10.5637 11.7062 10.4839 12.6131 11.3872C13.1337 11.9074 13.9863 11.9074 14.5036 11.3872C15.0242 10.8669 15.0242 10.0179 14.5036 9.49767C13.5712 8.56567 12.3417 8.09329 11.0803 8.09329Z" fill="#333333" fill-opacity="0.72"/>
              </svg>
            </dd>
            <dd>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5V18.3H3.6V3.6H18.3V1.5H1.5ZM5.7 5.7V22.5H22.5V5.7H5.7ZM7.8 7.8H20.4V20.4H7.8V7.8Z" fill="#333333" fill-opacity="0.72"/>
              </svg>
            </dd>
            <dd>
              <svg @click="destroy()" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.9375 1.5L8.90625 2.55H3.75V4.65H20.25V2.55H15.0938L14.0625 1.5H9.9375ZM4.78125 6.75V20.4C4.78125 21.555 5.70938 22.5 6.84375 22.5H17.1562C18.2906 22.5 19.2188 21.555 19.2188 20.4V6.75H4.78125ZM7.875 8.85H9.9375V20.4H7.875V8.85ZM14.0625 8.85H16.125V20.4H14.0625V8.85Z" fill="#333333" fill-opacity="0.72"/>
              </svg>
            </dd>
          </dl>
        </div>
        <my-project-status-input
          v-model="task.status"
          :options="statusOptions"
          :disabled="!editMode"
          class="dashboardWrap_status"
        />
        <dl class="dashboardWrap_tag">
          <dd>優先度高</dd>
          <dd class="button">タグを追加</dd>
        </dl>
        <div class="dashboardWrap_task">
          <textarea v-model="task.body" :disabled="!editMode" placeholder="タスクの詳細を追加"/>
        </div>
        <div class="dashboardWrap_submit" v-if="editMode">
          <button v-if="editMode" @click="save()">編集を終了</button>
        </div>
        <div class="dashboardWrap_post" v-if="!editMode">
          <small>2019/3/12 Satoshi Hashimoto が課題を作成しました。</small>
          <div class="dashboardWrap_post_board">
            <table>
              <tr>
                <th class="dashboardWrap_post_board_user">
                  <img src="@/assets/images/mainColumn/icn_post-user-heavyGreen.svg" alt="">
                </th>
                <td class="dashboardWrap_post_board_text">
                  <h3>Satoshi Hashimoto</h3>
                  <p>ダッシュボードに期待するのは何でしょうかね？<br>
                    <br>
                    <br>
                    - 自分が持っているタスク一覧<br>
                    <br>
                    - 自分に@通知が来たコメントの最新一覧
                  </p>
                </td>
                <td class="dashboardWrap_post_board_log">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.5">
                      <path d="M13.6419 0.151417C13.734 0.0565617 13.86 0.00212747 13.9922 6.08852e-05C14.059 -0.000982093 14.1253 0.0113843 14.1872 0.036429C14.2491 0.0614737 14.3053 0.0986872 14.3526 0.145865C14.3999 0.193043 14.4372 0.249227 14.4624 0.311089C14.4875 0.37295 14.5 0.439232 14.4991 0.50601V3.50076H17.4938C17.5599 3.49983 17.6256 3.51205 17.687 3.53671C17.7483 3.56137 17.8042 3.59799 17.8513 3.64443C17.8984 3.69087 17.9358 3.74621 17.9613 3.80723C17.9869 3.86825 18 3.93374 18 3.99989C18 4.06603 17.9869 4.13152 17.9613 4.19254C17.9358 4.25356 17.8984 4.3089 17.8513 4.35534C17.8042 4.40179 17.7483 4.4384 17.687 4.46307C17.6256 4.48773 17.5599 4.49995 17.4938 4.49901H14.4991V7.49376C14.5 7.5599 14.4878 7.62557 14.4632 7.68695C14.4385 7.74832 14.4019 7.80419 14.3554 7.85129C14.309 7.89839 14.2537 7.93579 14.1926 7.96132C14.1316 7.98685 14.0661 8 14 8C13.9339 8 13.8684 7.98685 13.8073 7.96132C13.7463 7.93579 13.691 7.89839 13.6446 7.85129C13.5981 7.80419 13.5615 7.74832 13.5368 7.68695C13.5122 7.62557 13.5 7.5599 13.5009 7.49376V4.49901H10.5062C10.4401 4.49995 10.3744 4.48773 10.313 4.46307C10.2517 4.4384 10.1958 4.40179 10.1487 4.35534C10.1016 4.3089 10.0642 4.25356 10.0387 4.19254C10.0131 4.13152 10 4.06603 10 3.99989C10 3.93374 10.0131 3.86825 10.0387 3.80723C10.0642 3.74621 10.1016 3.69087 10.1487 3.64443C10.1958 3.59799 10.2517 3.56137 10.313 3.53671C10.3744 3.51205 10.4401 3.49983 10.5062 3.50076H13.5009V0.50601C13.4991 0.3738 13.5498 0.246273 13.6419 0.151417Z" fill="#333333" fill-opacity="0.72"/>
                      <path d="M8 2C3.5816 2 0 5.5816 0 10C0 14.4184 3.5816 18 8 18C12.4184 18 16 14.4184 16 10C16 9.2824 15.8963 8.58973 15.7188 7.92812C15.6179 8.00332 15.5159 8.07778 15.4031 8.15938L14.9359 8.49688L14.3063 8.95C14.3631 9.2924 14.4 9.6416 14.4 10C14.4 13.5344 11.5344 16.4 8 16.4C4.4656 16.4 1.6 13.5344 1.6 10C1.6 6.4656 4.4656 3.6 8 3.6C8.3144 3.6 8.62104 3.631 8.92344 3.675C8.78664 3.1278 8.76867 2.586 8.87187 2.05C8.58547 2.0188 8.2952 2 8 2ZM5.2 6.8C4.53726 6.8 4 7.33726 4 8C4 8.66274 4.53726 9.2 5.2 9.2C5.86274 9.2 6.4 8.66274 6.4 8C6.4 7.33726 5.86274 6.8 5.2 6.8ZM10.8 6.8C10.1373 6.8 9.6 7.33726 9.6 8C9.6 8.66274 10.1373 9.2 10.8 9.2C11.4627 9.2 12 8.66274 12 8C12 7.33726 11.4627 6.8 10.8 6.8ZM3.9125 11.6C4.5525 13.232 6.136 14.4 8 14.4C9.864 14.4 11.4475 13.232 12.0875 11.6H3.9125Z" fill="#333333" fill-opacity="0.72"/>
                    </g>
                  </svg>
                  <p>4 days ago</p>
                </td>
              </tr>
              <tr>
                <th class="dashboardWrap_post_board_user">
                  <img src="@/assets/images/mainColumn/icn_post-user-lightGreen.svg" alt="">
                </th>
                <td class="dashboardWrap_post_board_text">
                  <h3>Shingo Mori</h3>
                  <p>ダッシュボードに期待するのは以下だとどうでしょう？<br>
                    <br>
                    ・自分がバトンを持っているタスク一覧<br>
                    <br>
                    ・自分が担当に含まれるタスクの最近の動き(@通知を含む)
                  </p>
                </td>
                <td class="dashboardWrap_post_board_log">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.5">
                      <path d="M13.6419 0.151417C13.734 0.0565617 13.86 0.00212747 13.9922 6.08852e-05C14.059 -0.000982093 14.1253 0.0113843 14.1872 0.036429C14.2491 0.0614737 14.3053 0.0986872 14.3526 0.145865C14.3999 0.193043 14.4372 0.249227 14.4624 0.311089C14.4875 0.37295 14.5 0.439232 14.4991 0.50601V3.50076H17.4938C17.5599 3.49983 17.6256 3.51205 17.687 3.53671C17.7483 3.56137 17.8042 3.59799 17.8513 3.64443C17.8984 3.69087 17.9358 3.74621 17.9613 3.80723C17.9869 3.86825 18 3.93374 18 3.99989C18 4.06603 17.9869 4.13152 17.9613 4.19254C17.9358 4.25356 17.8984 4.3089 17.8513 4.35534C17.8042 4.40179 17.7483 4.4384 17.687 4.46307C17.6256 4.48773 17.5599 4.49995 17.4938 4.49901H14.4991V7.49376C14.5 7.5599 14.4878 7.62557 14.4632 7.68695C14.4385 7.74832 14.4019 7.80419 14.3554 7.85129C14.309 7.89839 14.2537 7.93579 14.1926 7.96132C14.1316 7.98685 14.0661 8 14 8C13.9339 8 13.8684 7.98685 13.8073 7.96132C13.7463 7.93579 13.691 7.89839 13.6446 7.85129C13.5981 7.80419 13.5615 7.74832 13.5368 7.68695C13.5122 7.62557 13.5 7.5599 13.5009 7.49376V4.49901H10.5062C10.4401 4.49995 10.3744 4.48773 10.313 4.46307C10.2517 4.4384 10.1958 4.40179 10.1487 4.35534C10.1016 4.3089 10.0642 4.25356 10.0387 4.19254C10.0131 4.13152 10 4.06603 10 3.99989C10 3.93374 10.0131 3.86825 10.0387 3.80723C10.0642 3.74621 10.1016 3.69087 10.1487 3.64443C10.1958 3.59799 10.2517 3.56137 10.313 3.53671C10.3744 3.51205 10.4401 3.49983 10.5062 3.50076H13.5009V0.50601C13.4991 0.3738 13.5498 0.246273 13.6419 0.151417Z" fill="#333333" fill-opacity="0.72"/>
                      <path d="M8 2C3.5816 2 0 5.5816 0 10C0 14.4184 3.5816 18 8 18C12.4184 18 16 14.4184 16 10C16 9.2824 15.8963 8.58973 15.7188 7.92812C15.6179 8.00332 15.5159 8.07778 15.4031 8.15938L14.9359 8.49688L14.3063 8.95C14.3631 9.2924 14.4 9.6416 14.4 10C14.4 13.5344 11.5344 16.4 8 16.4C4.4656 16.4 1.6 13.5344 1.6 10C1.6 6.4656 4.4656 3.6 8 3.6C8.3144 3.6 8.62104 3.631 8.92344 3.675C8.78664 3.1278 8.76867 2.586 8.87187 2.05C8.58547 2.0188 8.2952 2 8 2ZM5.2 6.8C4.53726 6.8 4 7.33726 4 8C4 8.66274 4.53726 9.2 5.2 9.2C5.86274 9.2 6.4 8.66274 6.4 8C6.4 7.33726 5.86274 6.8 5.2 6.8ZM10.8 6.8C10.1373 6.8 9.6 7.33726 9.6 8C9.6 8.66274 10.1373 9.2 10.8 9.2C11.4627 9.2 12 8.66274 12 8C12 7.33726 11.4627 6.8 10.8 6.8ZM3.9125 11.6C4.5525 13.232 6.136 14.4 8 14.4C9.864 14.4 11.4475 13.232 12.0875 11.6H3.9125Z" fill="#333333" fill-opacity="0.72"/>
                    </g>
                  </svg>
                  <p>4 days ago</p>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="dashboardWrap_comment" v-if="!editMode">
          <div class="dashboardWrap_comment_box">
            <label class="dashboardWrap_comment_box_upload" for="file_upload">
              <input type="file" id="file">
              <input type="text" id="file_upload" value="">
            </label>
            <input type="text" class="dashboardWrap_comment_box_content" placeholder="コメントを追加">
          </div>
          <div class="dashboardWrap_comment_text show">
            <p>Satoshi Hashimotoさんが入力中です</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.mainColumn
  .favoriteIcon
    &.active path
      fill: #EDA62A !important
  &.editMode
    .dashboardWrap_task
      textarea
        margin: 24px 0 0
        height: calc(100vh - 380px)
    .dashboardWrap_submit
      display: block
      width: 100%
      min-height: 60px
      padding: 9px 20px 24px 20px
      background: #fff
      border-top: 2px solid #ededed
      text-align: center
      display: inline-block
      position: absolute
      bottom: 0
      left: 0
      button
        display: inline-block
        width: 220px
        padding: 10px
        margin: 15px 1.5% 0 1.5%
        border: none
        border-radius: 90px
        cursor: pointer
        font-family: 'Noto Sans CJK JP'
        font-size: 14px
        line-height: 1
        text-align: center
        &:first-child
          background: #2f80ed
          color: #fff
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Location, Route, NavigationGuard } from 'vue-router';
import { first } from 'rxjs/operators';
import {
  Task, TaskStatus, TasksPostRequestBody, TasksTaskIdPutRequestBody,
  apiRegistry, TasksApi,
} from '@/lib/api';
import store from '@/store';
import MyProjectStatusInput from '@/components/MyProjectStatusInput.vue';

async function initData(to: Route): Promise<Partial<Pick<TaskColumn, 'isAdd' | 'isFavorite' | 'editMode' | 'statusOptions' | 'task'>>> {
  const loginUser = store.state.activeUser.loggedInUser!;
  const tasksApi = apiRegistry.load(TasksApi, loginUser.token);
  const spaceId = loginUser.space.id;
  const projectId = store.state.activeUser.activeProjectId;
  const statusOptionsPromise = tasksApi.tasksStatusGet({
    spaceId: store.state.activeUser.loggedInUser!.space.id,
    projectId: store.state.activeUser.activeProjectId!,
  }).pipe(first()).toPromise();

  if (to.name === 'task-add') {
    // 新規
    return {
      isAdd: true,
      isFavorite: false,
      editMode: true,
      statusOptions: await statusOptionsPromise,
      task: {
        subject: '新規タスク',
        chargeUsers: [],
        tags: [],
      },
    };
  } else {
    // 既存
    const [statusOptions, task, resFavorite] = await Promise.all([
      statusOptionsPromise,
      tasksApi.tasksTaskIdGet({
        spaceId: store.state.activeUser.loggedInUser!.space.id,
        projectId: store.state.activeUser.activeProjectId!,
        taskId: parseInt(to.params.taskId),
      }).pipe(first()).toPromise(),
      tasksApi.tasksTaskIdFavoriteGet({
        spaceId: store.state.activeUser.loggedInUser!.space.id,
        projectId: store.state.activeUser.activeProjectId!,
        taskId: parseInt(to.params.taskId),
      }).pipe(first()).toPromise(),
    ]);
    return {
      isAdd: false,
      isFavorite: resFavorite.value,
      editMode: false,
      statusOptions,
      task,
    };
  }
}

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate',
  'beforeRouteLeave',
]);
@Component({
  components: {
    MyProjectStatusInput,
  },
})
export default class TaskColumn extends Vue {
  task: TasksPostRequestBody | TasksTaskIdPutRequestBody = null as any;
  statusOptions: TaskStatus[] = null as any;
  isFavorite = false;
  isAdd = false;
  editMode = false;
  saving = false;

  get fullMainColumn() {
    return this.$store.state.fullMainColumn;
  }

  setFullMainColumn(v: boolean) {
    this.$store.mutations.setFullMainColumn(v);
  }

  async save() {
    if (this.saving) {
      return;
    }
    const loginUser = store.state.activeUser.loggedInUser!;
    const projectId = store.state.activeUser.activeProjectId!;
    const tasksApi = apiRegistry.load(TasksApi, loginUser.token);
    try {
      this.saving = true;

      if (this.isAdd) {
        const task = await tasksApi.tasksPost({
          spaceId: loginUser.space.id,
          projectId,
          tasksPostRequestBody: this.task as TasksPostRequestBody,
        }).pipe(first()).toPromise();

        this.$store.actions.activeUser.replaceTask(task);
        this.$router.replace({
          name: 'task',
          params: {
            userId: loginUser.id.toString(),
            projectId: projectId.toString(),
            taskId: task.id.toString(),
          },
        });

      } else {
        const task = await tasksApi.tasksTaskIdPut({
          spaceId: loginUser.space.id,
          projectId,
          taskId: parseInt(this.$route.params.taskId),
          tasksTaskIdPutRequestBody: this.task as TasksTaskIdPutRequestBody,
        }).pipe(first()).toPromise();
        this.$store.actions.activeUser.replaceTask(task);
        this.editMode = false;
      }

    } catch (err) {
      this.$showApiError(this, err);
    }

    this.saving = false;
  }

  async destroy() {
    if (this.saving) {
      return;
    }
    const loginUser = store.state.activeUser.loggedInUser!;
    const projectId = store.state.activeUser.activeProjectId!;
    const tasksApi = apiRegistry.load(TasksApi, loginUser.token);

    try {
      this.saving = true;
      await tasksApi.tasksTaskIdDelete({
        spaceId: loginUser.space.id,
        projectId,
        taskId: parseInt(this.$route.params.taskId),
      }).pipe(first()).toPromise();
      this.$store.mutations.activeUser.deleteTask(parseInt(this.$route.params.taskId));
      this.$flash('削除しました', 'error');
      this.$router.replace({
        name: 'tasks',
        params: {
          userId: loginUser.id.toString(),
          projectId: projectId.toString(),
        },
      });

    } catch (err) {
      this.$showApiError(this, err);
    }

    this.saving = false;
  }

  async favorite(value: boolean) {
    if (this.saving) {
      return;
    }

    const loginUser = store.state.activeUser.loggedInUser!;
    const projectId = store.state.activeUser.activeProjectId!;
    const tasksApi = apiRegistry.load(TasksApi, loginUser.token);
    try {
      this.saving = true;
      const res = await tasksApi.tasksTaskIdFavoritePost({
        spaceId: loginUser.space.id,
        projectId: projectId,
        taskId: parseInt(this.$route.params.taskId),
        tasksTaskIdFavoritePostRequestBody: { value },
      }).pipe(first()).toPromise();
      this.isFavorite = res.value;

    } catch (err) {
      this.$showApiError(this, err);
    }

    this.saving = false;
  }

  async beforeRouteEnter(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    const options = await initData(to);
    store.mutations.setFullMainColumn(false);
    next((vm) => {
      (Object.keys(options) as (keyof typeof options)[]).forEach((k) => {
        (vm as any)[k] = options[k]!;
      });
    });
  }

  async beforeRouteUpdate(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    const options = await initData(to);
    store.mutations.setFullMainColumn(false);
    (Object.keys(options) as (keyof typeof options)[]).forEach((k) => {
      (this as any)[k] = options[k]!;
    });
    this.saving = false;
    next();
  }

  beforeRouteLeave(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    store.mutations.setFullMainColumn(false);
    next();
  }
}
</script>
