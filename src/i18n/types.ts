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
    deleted: string;
    filterByKeyword: string;
    anErrorHasOccurred: string;
    networkConnectionError: string;
    invalidInput: string;
    login: string;
    save: string;
    cancel: string;
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
    };

    // sub
    subColumn: {
      tabs: {
        task: string;
        file: string;
        note: string;
        ganttChart: string;
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
      addANewspace: string;
      spaceName: string;
      userName: string;
    };
  };
}
