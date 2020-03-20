import { Getters, Mutations, Actions, module } from 'sinai';
import { Route, RawLocation } from 'vue-router';
import localStorage from '@/lib/local-storage';


function routeToRawLocation(route: Route): RawLocation {
  return {
    name: route.name,
    params: route.params,
    query: route.query,
    hash: route.hash,
  };
}


class LocationState {
  appLastLocation: RawLocation | null = null;
  userLastLocations: {[userId: number]: RawLocation} = {};
  projectLastLocations: {[userId: number]: {[projectId: number]: RawLocation}} = {};
}


class LocationGetters extends Getters<LocationState>() {
}


class LocationMutations extends Mutations<LocationState>() {
  setAppLastLocation(route: Route) {
    this.state.appLastLocation = routeToRawLocation(route);
    localStorage.appLastLocation = this.state.appLastLocation;
  }

  setUserLastLocation(route: Route) {
    const userId = parseInt(route.params.userId);
    if (!this.state.userLastLocations[userId]) {
      this.state.userLastLocations[userId] = {};
    }
    this.state.userLastLocations[userId] = routeToRawLocation(route);
    localStorage.userLastLocations = this.state.userLastLocations;
  }

  setProjectLastLocation(route: Route) {
    const userId = parseInt(route.params.userId);
    const projectId = parseInt(route.params.projectId);
    if (!this.state.projectLastLocations[userId]) {
      this.state.projectLastLocations[userId] = {};
    }
    if (!this.state.projectLastLocations[userId][projectId]) {
      this.state.projectLastLocations[userId][projectId] = {};
    }
    this.state.projectLastLocations[userId][projectId] = routeToRawLocation(route);
    localStorage.projectLastLocations = this.state.projectLastLocations;
  }

  init() {
    this.state.appLastLocation = localStorage.appLastLocation;
    this.state.userLastLocations = localStorage.userLastLocations;
    this.state.projectLastLocations = localStorage.projectLastLocations;
  }
}


class LocationActions extends Actions<LocationState, LocationGetters, LocationMutations>() {
  async init() {
    this.mutations.init();
  }
}


const location = module({
  state: LocationState,
  getters: LocationGetters,
  mutations: LocationMutations,
  actions: LocationActions,
});

export default location;
