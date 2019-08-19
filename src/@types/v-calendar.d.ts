import { PluginObject } from 'vue';

declare const VCalendar: PluginObject<VCalendar.PluginOptions>;

// eslint-disable-next-line no-redeclare
declare namespace VCalendar {
  export interface PluginOptions {
    /** Locale identification in language-region format. Not all regions supported. Default: undefined */
    locale?: string;

    /** Custom prefix to use for plugin components. Replace if v-calendar and v-date-picker interfere with other component libraries. Default: "v" */
    componentPrefix?: string;

    /** Day number for the first day of the week (1: Sun - 7: Sat) Default: 1 */
    firstDayOfWeek?: number;

    // formats: Object Formats to use when display and parsing dates for various calendar sections Reference code

    /** Visibility state for calendar navigation panel. Default: "focus" */
    navVisibility?: 'focus' | 'hover' | 'visible' | 'hidden';

    /** Position of the title in the header. Default: "center" */
    titlePosition?: 'left' | 'center' | 'right';

    /** Transition type for title when navigating to a new page. Default: "slide-h" */
    titleTransition?: 'slide-h' | 'slide-v' | 'fade' | 'none';

    /** Transition type for weeks when navigating to a new page. Default: "slide-h" */
    weeksTransition?: 'slide-h' | 'slide-v' | 'fade' | 'none';

    /** Width of a single pane, in pixels. Default: 256 */
    paneWidth?: number;

    /**  When calendar is-linked and !is-vertical, show the inner header navigation buttons that are usually hidden. */
    showLinkedButtons?: boolean;

    /** Background color of the selected and dragged highlighted regions (opacity: 0.5 for dragged). This setting is overridden by select-attribute and drag-attribute if specified. Default: "#66B3CC" */
    datePickerTintColor?: string;

    /** Show caps and the end of the highlighted and dragged regions when mode === "range" Default: false */
    datePickerShowCaps?: boolean;

    /** Show popover for dragged and selected regions Default: true */
    datePickerShowDayPopover?: boolean;

    /** Popover wrapper for input or slot is expanded to the full width of its container. Default: false */
    popoverExpanded?: boolean;

    /** Direction that popover displays relative to input or slot element. Default: "bottom" */
    popoverDirection?: 'left' |'right' |'top' |'bottom';

    /** How the popover is aligned relative to input or slot element. Default: "left" */
    popoverAlign?: 'left' |'right' |'top' |'bottom';

    /** Visibility state of the popover. Default: "hover" */
    popoverVisibility?: 'hover' | 'focus' | 'hidden' | 'visible';

    /** Distance that the popover content is offset from the input or slot element. Default: "10px" */
    popoverContentOffset?: string;

    /** Keep the popover visible after a valid input has been selected. Default: false */
    popoverKeepVisibleOnInput?: boolean;

    /** Maximum time in milliseconds allowed for a swipe gesture to complete. Default: 300 */
    maxSwipeTime?: number;

    /** Minimum distance in pixels allowed for a horizontal swipe gesture. Default: 60 */
    minHorizontalSwipeDistance?: number;

    /** Maximum distance in pixels allowed for a horizontal swipe gesture. Default: 80 */
    maxVerticalSwipeDistance?: number;

    /** Maximum distance in pixels allowed for a tap between touchstart and touchend events Default: 0 */
    maxTapTolerance?: number;

    /** Maximum time in milliseconds allowed for a tap between touchstart and touchend events. Default: 200 */
    maxTapDuration?: number;
  }
}

export default VCalendar;
