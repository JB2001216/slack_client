import { PluginObject } from 'vue';

type MessageType = 'success' | 'error';

declare const VueFlashMessage: PluginObject<VueFlashMessage.PluginOptions>;

// eslint-disable-next-line no-redeclare
declare namespace VueFlashMessage {
  export interface PluginOptions {
    /**
     * Global message options.
     * default: { timeout: true, important: false, autoEmit: true, pauseOnInteract: false }
     */
    messageOptions?: MessageOptions;

    /**
     * You can switch them off by using createShortcuts config option.
     * @default true
     */
    createShortcuts?: boolean;

    /**
     * You can rename default flash method via options.
     * @default 'flash'
     */
    method?: string;
  }

  export interface MessageOptions {
    /**
     * Number in milliseconds until message self destruct.
     */
    timeout?: number;

    /**
     * Defines if message has a close button.
     */
    important?: boolean;

    /**
     * Defines if message should be emitted immediately after calling flash method.
     */
    autoEmit?: boolean;

    /**
     * Defines if message destruct timer should be paused on user interaction.
     */
    pauseOnInteract?: boolean;

    /**
     * Fires bofore message is destroyed.
     */
    beforeDestroy?: () => void;

    /**
     * Fires on user interact with message element.
     */
    onStartInteract?: () => void;

    /**
     * Fires on user complete interaction with message element.
     */
    onCompleteInteract?: () => void;
  }

  export interface MessageStorage {
    /**
     * Same as this.flash method, except it does not return storage instance.
     */
    flash: MessageMethod;

    /**
     * Adds message object to storage with id key.
     */
    push: (id: string, message: string) => void;

    /**
     * Destroys message by given id.
     */
    destroy: (id: string) => void;

    /**
     * Destroys all messages.
     */
    destroyAll: () => void;
  }

  export interface MessageObject {
    /**
     * Adds message to global storage. Helpfull when message is created with autoEmit: false.
     */
    emit: () => void;

    /**
     * Destroys message.
     */
    destroy: () => void;

    /**
     * Returns global flash message storage object.
     */
    getStorage: () => MessageStorage;

    /**
     * Sets message self destruct timer value (in milliseconds)
     */
    setSelfDestructTimeout: (timeout: number) => void;

    /**
     * Starts self destruct timer.
     */
    startSelfDestructTimer: () => void;

    /**
     * Stops self destruct timer.
     */
    killSelfDestructTimer: () => void;
  }

  export type MessageMethod = {
    (message: string, name: MessageType, options?: MessageOptions): MessageObject;
    (): MessageStorage;
  };
}

export default VueFlashMessage;
