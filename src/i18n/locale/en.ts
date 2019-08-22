import { LocaleStruct } from '../types';

const struct: LocaleStruct = {
  i18n: {
    common: {
      deleted: 'Deleted',
      filterByKeyword: 'Filter by keyword',
      anErrorHasOccurred: 'An error has occurred',
      networkConnectionError: 'Network connection error',
      invalidInput: 'Invalid input',
      login: 'Login',
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
        project: 'Project',
        archive: 'Archive',
      },

      // sub
      subColumn: {
        tabs: {
          task: 'Task',
          file: 'File',
          note: 'Note',
          ganttChart: 'GanttChart',
        },
      },
      projectAddColumn: {
        addANewProject: 'Add a new Project',
        projectName: 'Project Name',
      },
      tasksColumn: {
        addANewTask: 'Add a new task',
        filter: 'Filter',
        ordering: {
          priorityOrder: 'Priority order',
          deadlineOrder: 'Deadline order',
          statusOrder: 'Status order',
        },
      },
      notesColumn: {
        addANewNote: 'Add a new note',
        filter: 'Filter',
        ordering: {
          priorityOrder: 'Priority order',
          statusOrder: 'Status order',
        },
      },

      // main
      taskColumn: {
        addTags: 'Add tags',
        writeDetails: 'Write details',
        save: 'save',
        '_name_HasCreatedTask': '{name} has created a task.',
        writeAComment: 'Write a comment',
        commentSyncFailed: 'Comment sync failed',
      },
      noteColumn: {
        save: 'save',
        enterWideScreen: 'Enter wide screen',
        exitWideScreen: 'Exit wide screen',
        markdownHelp: 'Markdown Help',
      },

      // single
      login: {
        noLoginableUsersFound: 'No loginable users found.',
        welcomeHomeLetsWorkSmoothlyToday: 'Welcome home! Let\'s work smoothly today.',
        yourLoginURLHasBeenSent: 'Your login URL has been sent.',
        yourPinHasBeenSent: 'Your PIN has been sent.',
        loginUsingEmail: 'Login using Email',
        loginUsingSMS: 'Login using SMS',
        smsLogin: 'SMS Login',
        enterTheEmail: 'Enter the email',
        enterThePhoneNumber: 'Enter the phone number',
        enterPin: 'Enter PIN',
      },
      loginSpaceSelect: {
        spaceSelection: 'Space Selection',
        loginToTheSelectedSpace: 'Login to the selected space',
      },
      spaceAdd: {
        topMessage: 'Get Ernie\'s complete project management. Registration is free.',
        doYouAlreadyHaveAnAccount: 'Do you already have an account?',
        login: 'Login',
        enterTheEmail: 'Enter the email',
        theRegistrationURLHasBeenSent: 'The registration URL has been sent.',
        addANewspace: 'Add a new space',
        spaceName: 'Space Name (Alphanumeric only)',
        userName: 'User Name (Alphanumeric only)',
      },
    },
  },
  moment: {},
};
export default struct;
