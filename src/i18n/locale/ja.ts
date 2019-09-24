import { LocaleStruct } from '../types';
import moment from 'moment';

const struct: LocaleStruct = {
  i18n: {
    common: {
      yes: 'はい',
      no: 'いいえ',
      deleted: '削除しました',
      filterByKeyword: 'キーワードで絞り込む',
      anErrorHasOccurred: 'エラーが発生しました',
      networkConnectionError: 'ネットワーク接続に問題があります',
      invalidInput: '入力内容に問題があります',
      login: 'ログイン',
      save: '保存',
      cancel: 'キャンセル',
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

    components: {
      myDateRangeInput: {
        save: 'Save',
        cancel: 'Cancel',
        clear: 'Clear',
      },
      myProjectStatusInput: {
        others: 'Others',
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
      },
      notesColumn: {
        addANewNote: '新規ノート',
        filter: '絞り込み',
        ordering: {
          priorityOrder: '優先度順',
          statusOrder: 'ステータス順',
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
      },
      noteColumn: {
        save: '編集を終了',
        enterWideScreen: '全画面表示',
        exitWideScreen: 'デフォルト表示',
        markdownHelp: 'Markdownヘルプ',
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
          projectMembers: {
            memberList: 'メンバー一覧',
            email: 'メールアドレス',
            name: '名前',
            role: '権限',
            addMember: 'メンバーを追加する',
            removeConfirmMessage: '{name} ({email}) を削除してよろしいですか？',
          },
          projectMemberAdd: {
            title: '{projectName}にメンバーを追加する',
            searchTextPlaceholder: '名前またはメールアドレスで検索',
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
          }
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
