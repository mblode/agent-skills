export interface Holiday {
  date: string;
  name: string;
}

export interface BusinessDayOptions {
  holidays?: Holiday[];
}
