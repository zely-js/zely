export interface StoreContext {
  $id: string;
}

export type CreateData<T = any> = (ctx: StoreContext) => Promise<T> | T;
export function $store<T>(
  createData: CreateData<T>,
  key?: any[]
): Promise<{ data: T; id: string }>;

export function $access(key: string): {
  refresh();
  set(value: any);
  value: any;
};
