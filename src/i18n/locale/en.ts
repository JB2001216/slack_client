import { LocaleStruct } from '../types';

const struct: LocaleStruct = {
  i18n: {
    common: {
      yes: 'Yes',
      no: 'No',
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
        PROJECT_USER: 'User',
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
            profileAndAccount: 'Profile & Account',
            userProfile: 'Profile Settings',
            userAccount: 'Account Settings',
          },
          projects: {
            title: 'Project Settings',
            general: 'General',
            members: 'Members',
            taskSettings: 'Task Settings',
            noteSettings: 'Note Settings',
          },
        },
        main: {
          spaceMembers: {
            memberList: 'Member List',
            email: 'Email',
            name: 'Name',
            role: 'Role',
            addMember: 'Add Member',
            deleteConfirmMessage: 'Delete {name} ({email}) ?',
            deleteAttentionMessage: 'Once deleted, it cannot be recovered.',
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
          projectMembers: {
            memberList: 'Member List',
            email: 'Email',
            name: 'Name',
            role: 'Role',
            addMember: 'Add Member',
            removeConfirmMessage: 'Remove {name} ({email}) ?',
          },
          projectMemberAdd: {
            title: 'Add members to {projectName}',
            searchTextPlaceholder: 'Search by name or email address',
            email: 'Email',
            name: 'Name',
            role: 'Role',
            addMembers: 'Add Members',
            addedMessage: 'Member added successfully',
          },
          statusFlow: {
            title: {
              task: 'Task flow Settings',
              note: 'Note flow Settings',
            },
            flow: 'Flow',
            others: 'Others',
            addAnEntryField: 'Add an entry field',
            save: 'Save',
            updatedMessage: 'Updated.',
            blankItemExists: 'Black item exists.',
          },
          userAccount: {
            title: 'Email address',
            emailDescription: 'Your email address is',
            subTitle: 'New email address',
            sendEmailBtn: 'Send email',
            phoneNumber: 'Phone number',
            sendPassBtn: 'Send pincode',
            temporaryPassPlaceholder: 'Temporary password',
            text: 'As a remedy in case you forget your email address or forget it SMS registration is recommended. It is private to non-persons.',
          }
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
        addANewSpace: 'Add a new space',
        spaceName: 'Space Name (Alphanumeric only)',
        userName: 'User Name (Alphanumeric only)',
      },
    },
  },
  moment: {},
};
export default struct;
