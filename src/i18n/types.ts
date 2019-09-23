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
    filterByKeyword: string;
    anErrorHasOccurred: string;
    networkConnectionError: string;
    invalidInput: string;
    login: string;
    save: string;
    cancel: string;
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

  components: {
    myDateRangeInput: {
      save: string;
      cancel: string;
      clear: string;
    };
    myProjectStatusInput: {
      others: string;
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
    };
    notesColumn: {
      addANewNote: string;
      filter: string;
      ordering: {
        priorityOrder: string;
        statusOrder: string;
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
    };
    noteColumn: {
      save: string;
      enterWideScreen: string;
      exitWideScreen: string;
      markdownHelp: string;
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
        projectMembers: {
          memberList: string;
          email: string;
          name: string;
          role: string;
          addMember: string;
          removeConfirmMessage: string;
        };
        projectMemberAdd: {
          title: string;
          searchTextPlaceholder: string;
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
          flow: string;
          others: string;
          addAnEntryField: string;
          save: string;
          updatedMessage: string;
          blankItemExists: string;
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
