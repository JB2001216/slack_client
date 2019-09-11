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
      save: 'Save',
      cancel: 'Cancel',
      spaceRole: {
        OWNER: 'Owner',
        ADMIN: 'Administrator',
        USER: 'User',
      },
      projectRole: {
        PROJECT_ADMIN: 'Project Administrator',
        USER_WRITABLE: 'User (Writable)',
        USER_READONLY: 'User (Readonly)',
      },
      alreadyLoggedIn: 'Already logged in',
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
        spaceMenu: {
          profileAndAccount: 'Profile and Account',
          inviteMembers: 'Invite members',
          spaceSettings: 'Space settings',
        },
      },

      // sub
      subColumn: {
        tabs: {
          task: 'Task',
          file: 'File',
          note: 'Note',
          ganttChart: 'GanttChart',
        },
        projectMenu: {
          addMembers: 'Add members',
          projectSettings: 'Project settings',
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
        filterForm: {
          all: 'All',
          notClosed: 'Not {closedName}',
          status: 'Status',
          assignedUsers: 'Assigned users',
          assignedUser: 'Assigned user',
          batonHolder: 'Baton holder',
          tags: 'Tags',
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
        enterDetails: 'Enter details',
        detailsAreEmpty: 'Details are empty.',
        '_name_HasCreatedTask': '{name} has created a task.',
        enterAComment: 'Enter a comment',
        commentSyncFailed: 'Comment sync failed',
      },
      noteColumn: {
        save: 'save',
        enterWideScreen: 'Enter wide screen',
        exitWideScreen: 'Exit wide screen',
        markdownHelp: 'Markdown Help',
      },

      // setting
      setting: {
        sub: {
          spaces: {
            title: 'Space Settings',
            general: 'General',
            members: 'Members',
          },
        },
        main: {
          spaceMembers: {
            memberList: 'Member List',
            email: 'Email',
            name: 'Name',
            role: 'Role',
            addMember: 'Add Member',
          },
          spaceMemberInvite: {
            title: 'Invite members to {spaceName}',
            invitationLink: 'Invitation Link',
            copy: 'Copy',
            email: 'Email',
            account: 'Account Name',
            role: 'Role',
            addAnEntryField: 'Add an entry field',
            sendInvitation: 'Send Invitation',
            accountSample: 'john_smith',
            invitedMessage: 'Invitation email sent successfully',
          },
          projectMemberAdd: {
            title: 'Add members to {projectName}',
            searchTextPlaceholder: 'Search by name or email address',
            email: 'Email',
            name: 'Name',
            role: 'Role',
            addMembers: 'Add Members',
          },
        },
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
