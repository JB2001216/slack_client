export type MyChargerDialogValue = {
  batonUser: number | null;
  chargeUsers: number[];
} | null;

export interface MyChargerDialogChangeEvent {
  value: MyChargerDialogValue;
  target?: { id: number; action: 'add' | 'delete' | 'baton' };
}
