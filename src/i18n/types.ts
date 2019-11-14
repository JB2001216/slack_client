import { LocaleMessageObject } from 'vue-i18n';
import { LocaleSpecification } from 'moment';

export type Locale = 'en' | 'ja';

export type LocaleMomentStruct = LocaleSpecification;

export interface LocaleStruct {
  i18n: LocaleMessageStruct;
  moment: LocaleMomentStruct;
}

export interface LocaleMessageStruct extends LocaleMessageObject {
  common: {
    yes: string;
    no: string;
    deleted: string;
    copied: string;
    filterByKeyword: string;
    anErrorHasOccurred: string;
    networkConnectionError: string;
    invalidInput: string;
    login: string;
    save: string;
    confirm: string;
    cancel: string;
    finishEditing: string;
    markdownHelp: string;
    spaceRole: {
      OWNER: string;
      ADMIN: string;
      USER: string;
    };
    projectRole: {
      PROJECT_ADMIN: string;
      PROJECT_USER: string;
      // USER_READONLY: string;
    };
    alreadyLoggedIn: string;
  };

  notifications: {
    space: {
      updated: string;
      noLongerMemberOfCurrent: string;
      noLongerMemberOfAny: string;
    };
  };

  components: {
    myConfirmChangeDiscardDialog: {
      title: string;
      description: string;
    };
    myDateRangeInput: {
      save: string;
      cancel: string;
      clear: string;
    };
    myProjectStatusInput: {
      others: string;
    };
    myChargerInput: {
      baton: string;
      notSet: string;
      addMembers: string;
    };
    myChargerDialog: {
      title: string;
      baton: string;
    };
    mySpaceUserSearchInput: {
      notfound: string;
      searchTextPlaceholder: string;
    };
    myMarkdownEditor: {
      noteLink: {
        move: string;
        enter: string;
        cancel: string;
        lastUpdated: string;
      };
    };
  };

  views: {
    // project
    projectColumn: {
      project: string;
      archive: string;
      spaceMenu: {
        profileAndAccount: string;
        inviteMembers: string;
        spaceSettings: string;
      };
      deleteNotification: string;
      roleChangedNotify: string;
    };

    // sub
    subColumn: {
      tabs: {
        task: string;
        file: string;
        note: string;
        ganttChart: string;
      };
      projectMenu: {
        addMembers: string;
        projectSettings: string;
      };
    };
    projectAddColumn: {
      addANewProject: string;
      projectName: string;
      createNotification: string;
    };
    tasksColumn: {
      addANewTask: string;
      filter: string;
      ordering: {
        priorityOrder: string;
        deadlineOrder: string;
        statusOrder: string;
      };
      filterForm: {
        all: string;
        notClosed: string;
        status: string;
        assignedUsers: string;
        assignedUser: string;
        batonHolder: string;
        tags: string;
      };
      createNotify: string;
      deleteNotify: string;
      noLongerNotify: string;
    };
    notesColumn: {
      addANewNote: string;
      filter: string;
      ordering: {
        priorityOrder: string;
        statusOrder: string;
      };
      filterForm: {
        all: string;
        notClosed: string;
        status: string;
        assignedUsers: string;
        assignedUser: string;
        batonHolder: string;
      };
    };

    // main
    taskColumn: {
      addTags: string;
      enterDetails: string;
      detailsAreEmpty: string;
      '_name_HasCreatedTask': string;
      enterAComment: string;
      commentSyncFailed: string;
      addedChargeUser: string;
      deletedChargeUser: string;
      chargerDialogTitle: string;
      deleteConfirmDialog: {
        title: string;
        description: string;
      };
    };
    noteColumn: {
      save: string;
      enterDetails: string;
      detailsAreEmpty: string;
      enterWideScreen: string;
      exitWideScreen: string;
      markdownHelp: string;
      addedChargeUser: string;
      deletedChargeUser: string;
      chargerDialogTitle: string;
      status: string;
      baton: string;
      lastUpdated: string;
      deleteConfirmDialog: {
        title: string;
        description: string;
      };
    };

    // setting
    setting: {
      sub: {
        spaces: {
          title: string;
          general: string;
          members: string;
          profileAndAccount: string;
          userProfile: string;
          userAccount: string;
        };
        projects: {
          title: string;
          general: string;
          members: string;
          taskSettings: string;
          noteSettings: string;
        };
      };
      main: {
        spaceGeneral: {
          title: string;
          uploadBtn: string;
          uploadDescription: string;
          title2: string;
          saveBtn: string;
          deleteBtn: string;
          confirmDeleteSpace: string;
        };
        spaceMembers: {
          memberList: string;
          email: string;
          name: string;
          role: string;
          addMember: string;
          deleteConfirmMessage: string;
          deleteAttentionMessage: string;
        };
        spaceMemberInvite: {
          title: string;
          invitationLink: string;
          copy: string;
          email: string;
          account: string;
          role: string;
          addAnEntryField: string;
          sendInvitation: string;
          accountSample: string;
          invitedMessage: string;
        };
        projectGeneral: {
          title: string;
          save: string;
          delete: string;
          updateNotification: string;
          deleteNotification: string;
          confirmationMsg: string;
          confirm: string;
          cancel: string;
        };
        projectMembers: {
          memberList: string;
          email: string;
          name: string;
          role: string;
          addMember: string;
          removeConfirmMessage: string;
          removedMessage: string;
          removedCrntUserMessage: string;
          changedProjectRole: string;
        };
        projectMemberAdd: {
          title: string;
          email: string;
          name: string;
          role: string;
          addMembers: string;
          addedMessage: string;
        };
        statusFlow: {
          title: {
            task: string;
            note: string;
          };
          preview: string;
          flow: string;
          others: string;
          addAnEntryField: string;
          save: string;
          updatedMessage: string;
          blankItemExists: string;
        };
        userAccount: {
          title: string;
          emailDescription: string;
          subTitle: string;
          sendEmailBtn: string;
          phoneNumber: string;
          sendPassBtn: string;
          temporaryPassPlaceholder: string;
          text: string;
          confirmEmailHasBeenSent: string;
          smsWithPincodeHasBeenSent: string;
        };
        userProfile: {
          uploadBtn: string;
          uploadDescription: string;
          userAvatar: string;
          userName: string;
          saveBtn: string;
        };
      };
    };

    // single
    login: {
      noLoginableUsersFound: string;
      welcomeHomeLetsWorkSmoothlyToday: string;
      yourLoginURLHasBeenSent: string;
      yourPinHasBeenSent: string;
      loginUsingEmail: string;
      loginUsingSMS: string;
      smsLogin: string;
      enterTheEmail: string;
      enterThePhoneNumber: string;
      enterPin: string;
    };
    loginSpaceSelect: {
      spaceSelection: string;
      loginToTheSelectedSpace: string;
    };
    spaceAdd: {
      topMessage: string;
      doYouAlreadyHaveAnAccount: string;
      login: string;
      enterTheEmail: string;
      theRegistrationURLHasBeenSent: string;
      addANewSpace: string;
      spaceName: string;
      userName: string;
    };
  };
}
