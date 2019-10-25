class EventsSubscription {

  private url: string = 'http://54.224.153.166:3001/notifications/subscribe?space_id=';
  private spaceId: any;
  source: any;
  initialized: boolean = false;

  init(myUser: any): void {

    if (!myUser || this.spaceId === myUser.space.id) { return; }

    this.spaceId = myUser.space.id;

    if (this.source) { this.source.close(); }

    this.source = new EventSource(this.url + this.spaceId);

    this.source.onopen = () => {
      console.log('Server is opened.');
    };

    this.source.onmessage = (res: any) => {

      switch (res.event) {

        case 'updateSpace':
          // DO UPDATE HERE
          // + this.$store.mutations.editSpace(res.params);
          break;

        default:
          break;

      }

    };

    this.source.onerror = () => {
      console.error('Something went wrong');
    };

    this.initialized = true;

  }

}

export const eventsSub = new EventsSubscription();
