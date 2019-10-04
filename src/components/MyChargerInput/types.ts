export type MyChargerInputValue = {
  batonUser: number | null;
  chargeUsers: number[];
} | null;

export interface MyChargerInputChangeEvent {
  value: MyChargerInputValue;
  target?: { id: number; action: 'add' | 'delete' | 'baton'; from: 'input' | 'dialog' };
}
