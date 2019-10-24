import Router, { RawLocation } from 'vue-router';
import { appEventBus } from '@/plugins/app-event';
import store from '../store';


export function bindLastLocation(router: Router) {
  // Save last location
  router.afterEach((to) => {
    if (to.path.match(/^\/main\/users\/\d+/) && to.params.userId) {
      store.mutations.location.setAppLastLocation(to);
      store.mutations.location.setUserLastLocation(to);
    }
    if (to.path.match(/^\/main\/users\/\d+\/projects\/\d+/) && to.params.userId && to.params.projectId) {
      store.mutations.location.setProjectLastLocation(to);
    }
  });
}


export function getAppLastLocation(): RawLocation {
  const location = store.state.location.appLastLocation;
  if (location) {
    return location;

  } else if (store.state.activeUser.activeProjectData) {
    return {
      name: 'project',
      params: {
        userId: store.state.activeUser.myUser!.id.toString(),
        projectId: store.state.activeUser.activeProjectData.id.toString(),
      },
    };
  } else if (store.state.loggedInUsers.length) {
    return {
      name: 'user',
      params: {
        userId: store.state.loggedInUsers[0].id.toString(),
      },
    };
  } else {
    return {
      name: 'space-add1',
    };
  }
}

export function getUserLastLocation(userId: number) {
  const locations = store.state.location.userLastLocations;
  if (locations[userId]) {
    return locations[userId];
  } else {
    return {
      name: 'user',
      params: {
        userId: userId.toString(),
      },
    };
  }
}

export function getProjectLastLocation(userId: number, projectId: number) {
  const locations = store.state.location.projectLastLocations;
  if (locations[userId] && locations[userId][projectId]) {
    return locations[userId][projectId];
  } else {
    return {
      name: 'project',
      params: {
        userId: userId.toString(),
        projectId: projectId.toString(),
      },
    };
  }
}
