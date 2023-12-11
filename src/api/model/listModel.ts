export interface ListResult {
  list: Array<ListModel>;
  count: number;
}
export interface ListModel {
  id: number;
  shop_name: string;
  province: string;
  sys_name: string;
  shop_id: string;
  shop_addr: string;
}
