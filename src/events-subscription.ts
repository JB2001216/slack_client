class EventsSubscription {

  private url: string = 'http://54.224.153.166:3001/notifications/subscribe?space_id=';
  source: any;
  initialized: boolean = false;

  init(spaceId: number): void {

    this.source = new EventSource(this.url + spaceId);

    this.source.onopen = () => {
      console.log('Server is opened.');
    };

    this.source.onmessage = (res: any) => {

      switch (res.event) {

        case 'updateSpace':
          // DO UPDATE HERE
          // + this.$store.mutations.editSpace(res.params);
          // + this.$flash(this.$t('views.setting.main.statusFlow.updatedMessage').toString(), 'success');
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
