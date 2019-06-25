import { LocaleMessageObject } from 'vue-i18n';
import { LocaleSpecification } from 'moment';

export type Locale = 'en' | 'ja';

export type LocaleMomentStruct = LocaleSpecification;

export interface LocaleStruct {
  i18n: LocaleMessageStruct;
  moment: LocaleMomentStruct;
}

export interface LocaleMessageStruct extends LocaleMessageObject {
  task: {
    state: {
      name: {
        notStarted: string;
        inProgress: string;
        waiting: string;
        pending: string;
        later: string;
        leftAlone: string;
        done: string;
        rejected: string;
      };
    };
  };
}
