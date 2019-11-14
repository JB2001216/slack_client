import { LocaleStruct } from '../types';
import moment from 'moment';

const struct: LocaleStruct = {
  i18n: {
    common: {
      yes: 'はい',
      no: 'いいえ',
      deleted: '削除しました',
      copied: 'コピーしました',
      filterByKeyword: 'キーワードで絞り込む',
      anErrorHasOccurred: 'エラーが発生しました',
      networkConnectionError: 'ネットワーク接続に問題があります',
      invalidInput: '入力内容に問題があります',
      login: 'ログイン',
      save: '保存',
      confirm: '確認する',
      cancel: 'キャンセル',
      finishEditing: '編集を終了する',
      markdownHelp: 'Markdownヘルプ',
      spaceRole: {
        OWNER: 'オーナー',
        ADMIN: '管理者',
        USER: 'ユーザー',
      },
      projectRole: {
        PROJECT_ADMIN: 'プロジェクト管理者',
        PROJECT_USER: 'ユーザー',
      },
      alreadyLoggedIn: '既にログイン済です',
    },

    notifications: {
      space: {
        updated: '{spaceName}更新しました。',
        noLongerMemberOfCurrent: 'あなたはもうメンバーではありません{spaceName}スペース。',
        noLongerMemberOfAny: 'もはやスペースのメンバーではありません。',
      },
      project: {
        created: '事業{projectName}正常に作成されました。',
        updated: '事業{projectName}更新成功。',
        deleted: '事業{projectName}削除しました。',
      },
    },

    components: {
      myConfirmChangeDiscardDialog: {
        title: '入力中の内容は保存されていません。',
        description: '入力中の内容は破棄されますがよろしいですか？',
      },
      myDateRangeInput: {
        save: 'Save',
        cancel: 'Cancel',
        clear: 'Clear',
      },
      myProjectStatusInput: {
        others: 'その他',
      },
      myChargerInput: {
        baton: '担当',
        notSet: '未設定',
        addMembers: 'メンバーを追加',
      },
      myChargerDialog: {
        title: 'メンバーの管理',
        baton: '担当',
      },
      mySpaceUserSearchInput: {
        notfound: '条件に一致するユーザーは見つかりませんでした',
        searchTextPlaceholder: '名前またはメールアドレスで検索',
      },
      myMarkdownEditor: {
        noteLink: {
          move: '移動',
          enter: '確定',
          cancel: 'キャンセル',
          lastUpdated: '最終更新日',
        },
      },
    },

    views: {
      // project
      projectColumn: {
        project: 'プロジェクト',
        archive: 'アーカイブ',
        spaceMenu: {
          profileAndAccount: 'プロフィール & アカウント',
          inviteMembers: 'メンバー招待',
          spaceSettings: 'スペース設定',
        },
        deleteNotification: '事業{projectName}使用できなくなりました',
        roleChangedNotify: 'スペースの役割が変更されました',
      },

      // sub
      subColumn: {
        tabs: {
          task: 'タスク',
          file: 'ファイル',
          note: 'ノート',
          ganttChart: 'ガントチャート',
        },
        projectMenu: {
          addMembers: 'メンバーの追加',
          projectSettings: 'プロジェクト設定',
        },
      },
      projectAddColumn: {
        addANewProject: 'プロジェクト追加',
        projectName: 'プロジェクト名',
      },
      tasksColumn: {
        addANewTask: '新規タスク',
        filter: '絞り込み',
        ordering: {
          priorityOrder: '優先度順',
          deadlineOrder: '期限順',
          statusOrder: 'ステータス順',
        },
        filterForm: {
          all: 'すべて',
          notClosed: '{closedName}以外',
          status: 'ステータス',
          assignedUsers: '担当者',
          assignedUser: '担当になっている人',
          batonHolder: 'バトンを持っている人',
          tags: 'タグ',
        },
        createNotify: '仕事{taskName}作成した',
        deleteNotify: '仕事{taskName}削除された',
        noLongerNotify: '仕事{taskName}使用できなくなりました',
      },
      notesColumn: {
        addANewNote: '新規ノート',
        filter: '絞り込み',
        ordering: {
          priorityOrder: '優先度順',
          statusOrder: 'ステータス順',
        },
        filterForm: {
          all: 'すべて',
          notClosed: '{closedName}以外',
          status: 'ステータス',
          assignedUsers: '担当者',
          assignedUser: '担当になっている人',
          batonHolder: 'バトンを持っている人',
        },
      },

      // main
      taskColumn: {
        addTags: 'タグを追加',
        enterDetails: '詳細を入力',
        detailsAreEmpty: '詳細は未入力です',
        '_name_HasCreatedTask': '{name} がタスクを作成しました。',
        enterAComment: 'コメントを追加',
        commentSyncFailed: 'コメントの取得に失敗しました',
        addedChargeUser: 'タスクメンバーに{name}を追加しました。',
        deletedChargeUser: 'タスクメンバーから{name}を除外しました。',
        chargerDialogTitle: 'タスクメンバー管理',
        deleteConfirmDialog: {
          title: 'タスクの削除',
          description: 'このタスクを削除してよろしいですか？',
        },
      },
      noteColumn: {
        save: '編集を終了',
        enterDetails: '詳細を入力',
        detailsAreEmpty: '詳細は未入力です',
        enterWideScreen: '全画面表示',
        exitWideScreen: 'デフォルト表示',
        markdownHelp: 'Markdownヘルプ',
        addedChargeUser: 'ノートメンバーに{name}を追加しました。',
        deletedChargeUser: 'ノートメンバーから{name}を除外しました。',
        chargerDialogTitle: 'ノートメンバー管理',
        status: 'ステータス',
        baton: '担当',
        lastUpdated: '最終更新日',
        deleteConfirmDialog: {
          title: 'ノートの削除',
          description: 'このノートを削除してよろしいですか？',
        },
      },

      // setting
      setting: {
        sub: {
          spaces: {
            title: 'スペース設定',
            general: '基本設定',
            members: 'メンバー設定',
            profileAndAccount: 'プロフィール＆アカウント',
            userProfile: 'プロフィール設定',
            userAccount: 'アカウント設定',
          },
          projects: {
            title: 'プロジェクト設定',
            general: '基本設定',
            members: 'メンバー設定',
            taskSettings: 'タスク設定',
            noteSettings: 'ノート設定',
          },
        },
        main: {
          spaceGeneral: {
            title: 'スペースアイコン',
            uploadBtn: '画像をアップロード',
            uploadDescription: 'スペースアイコンはドラッグアンドドロップで変更できます',
            title2: 'スペース表示名',
            saveBtn: '変更内容を保存',
            deleteBtn: 'スペースを削除する',
            confirmDeleteSpace: '消去してもよろしいですか{spaceName}スペース',
          },
          spaceMembers: {
            memberList: 'メンバー一覧',
            email: 'メールアドレス',
            name: '名前',
            role: '権限',
            addMember: 'メンバーを追加する',
            deleteConfirmMessage: '{name} ({email}) を削除してよろしいですか？',
            deleteAttentionMessage: '一度削除をすると元に戻せません。',
          },
          spaceMemberInvite: {
            title: '{spaceName}にメンバーを招待する',
            invitationLink: 'メンバー招待用リンク',
            copy: 'コピーする',
            email: 'メールアドレス',
            account: 'アカウント名',
            role: '権限',
            addAnEntryField: '枠を一つ追加する',
            sendInvitation: '招待を送信する',
            accountSample: 'taro_yamada',
            invitedMessage: '招待メールを送信しました',
          },
          projectGeneral: {
            title: 'プロジェクト名',
            save: '変更を保存する',
            delete: 'プロジェクトを削除',
            deleteConfirmDialog: '消去してもよろしいですか{projectName}事業？',
          },
          projectMembers: {
            memberList: 'メンバー一覧',
            email: 'メールアドレス',
            name: '名前',
            role: '権限',
            addMember: 'メンバーを追加する',
            removeConfirmMessage: '{name} ({email}) を削除してよろしいですか？',
            removedMessage: 'メンバーを削除しました',
            removedCrntUserMessage: 'あなたはもうメンバーではありません{projectName}事業',
            changedProjectRole: 'プロジェクトの役割が変更されました',
          },
          projectMemberAdd: {
            title: '{projectName}にメンバーを追加する',
            email: 'メールアドレス',
            name: '名前',
            role: '権限',
            addMembers: 'メンバーを追加する',
            addedMessage: 'メンバーの追加に成功しました',
          },
          statusFlow: {
            title: {
              task: 'タスクフローの設定',
              note: 'ノートフローの設定',
            },
            preview: 'プレビュー',
            flow: 'フロー',
            others: 'その他',
            addAnEntryField: '枠を追加する',
            save: '保存',
            updatedMessage: '更新しました',
            blankItemExists: '空欄の項目があります',
          },
          userAccount: {
            title: 'メールアドレス',
            emailDescription: 'あなたのメールアドレスは',
            subTitle: '新しいメールアドレス',
            sendEmailBtn: '確認メールを送信',
            phoneNumber: '電話番号',
            sendPassBtn: '変更用パスワードを送信',
            temporaryPassPlaceholder: 'ワンタイムパスワード',
            text: 'メールアドレスが利用出来ない、忘れてしまった場合の救済措置として SMS登録をおすすめします。本人以外には非公開です。',
            confirmEmailHasBeenSent: '確認メールを送信しました。',
            smsWithPincodeHasBeenSent: 'ワンタイムパスワードを送信しました。',
          },
          userProfile: {
            uploadBtn: '画像をアップロード',
            uploadDescription: 'プロフィール画像はドラッグ&ドロップで変更できます。',
            userAvatar: 'プロフィール画像',
            userName: 'ユーザー名',
            saveBtn: '変更を保存する',
          },
        },
      },

      // single
      login: {
        noLoginableUsersFound: 'ログイン可能なユーザーが見つかりませんでした',
        welcomeHomeLetsWorkSmoothlyToday: 'お帰りなさい！今日もスムーズに仕事を進めましょう。',
        yourLoginURLHasBeenSent: 'ログイン用URLを送信しました',
        yourPinHasBeenSent: 'ワンタイムパスワードを送信しました。',
        loginUsingEmail: 'メールアドレスでログインする',
        loginUsingSMS: 'SMSでログインする',
        smsLogin: 'SMSログイン',
        enterTheEmail: 'メールアドレスを入力',
        enterThePhoneNumber: '電話番号を入力',
        enterPin: 'ワンタイムパスワードを入力',
      },
      loginSpaceSelect: {
        spaceSelection: 'スペース選択',
        loginToTheSelectedSpace: '選択したスペースにログイン',
      },
      spaceAdd: {
        topMessage: 'アーニーによる完璧なプロジェクト管理を手に入れましょう。登録は無料です。',
        doYouAlreadyHaveAnAccount: 'すでにアカウントをお持ちですか？',
        login: 'ログインする',
        enterTheEmail: 'メールアドレスを入力',
        theRegistrationURLHasBeenSent: '登録用URLを送信しました。',
        addANewSpace: 'スペース作成',
        spaceName: 'スペース名(英数字のみ)',
        userName: 'ユーザー名(英数字のみ)"',
      },
    },
  },

  moment: {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
    weekdaysShort: '日_月_火_水_木_金_土'.split('_'),
    weekdaysMin: '日_月_火_水_木_金_土'.split('_'),
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'YYYY/MM/DD',
      LL: 'YYYY年M月D日',
      LLL: 'YYYY年M月D日 HH:mm',
      LLLL: 'YYYY年M月D日 dddd HH:mm',
      l: 'YYYY/MM/DD',
      ll: 'YYYY年M月D日',
      lll: 'YYYY年M月D日 HH:mm',
      llll: 'YYYY年M月D日(ddd) HH:mm',
    },
    meridiemParse: /午前|午後/i,
    isPM(input) {
      return input === '午後';
    },
    meridiem(hour, minute, isLower) {
      if (hour < 12) {
        return '午前';
      } else {
        return '午後';
      }
    },
    calendar: {
      sameDay: '[今日] LT',
      nextDay: '[明日] LT',
      nextWeek(this: moment.Moment, now) {
        if (moment.isMoment(now) && now.week() < this.week()) {
          return '[来週]dddd LT';
        } else {
          return 'dddd LT';
        }
      },
      lastDay: '[昨日] LT',
      lastWeek(this: moment.Moment, now) {
        if (moment.isMoment(now) && this.week() < now.week()) {
          return '[先週]dddd LT';
        } else {
          return 'dddd LT';
        }
      },
      sameElse: 'L',
    },
    dayOfMonthOrdinalParse: /\d{1,2}日/,
    ordinal: <LocaleStruct['moment']['ordinal']> function(number: number, period: string) {
      switch (period) {
        case 'd':
        case 'D':
        case 'DDD':
          return number + '日';
        default:
          return number;
      }
    },
    relativeTime: {
      future: '%s後',
      past: '%s前',
      s: '数秒',
      ss: '%d秒',
      m: '1分',
      mm: '%d分',
      h: '1時間',
      hh: '%d時間',
      d: '1日',
      dd: '%d日',
      M: '1ヶ月',
      MM: '%dヶ月',
      y: '1年',
      yy: '%d年',
    },
  },
};
export default struct;
