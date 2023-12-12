import { request } from '@/utils/request';
import type { ListResult } from '@/api/model/listModel';

const Api = {
  BaseList: '/excel-find/getShopList',
  DelAllShop: '/excel-find/delAllShop',
};

export function getList(params: any) {
  return request.post<ListResult>({
    url: Api.BaseList,
    data: { ...params },
  });
}

export function delAllData() {
  return request.post({
    url: Api.DelAllShop,
  });
}
