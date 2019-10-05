import JuggleResizeObserver from '@juggle/resize-observer';
import { ResizeObserverEntry as JuggleResizeObserverEntry } from '@juggle/resize-observer/lib/ResizeObserverEntry';

declare global {
  interface ResizeObserver extends JuggleResizeObserver {}
  interface ResizeObserverEntry extends JuggleResizeObserverEntry {}
  interface Window {
    ResizeObserver: typeof JuggleResizeObserver;
  }
}
