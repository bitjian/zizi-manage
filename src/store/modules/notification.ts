import { defineStore } from 'pinia';
import type { NotificationItem } from '@/types/interface';

const msgData = [
  {
    id: '123',
    content: '将就用用',
    type: '动态',
    status: true,
    collected: false,
    date: '2023-12-01 08:00',
    quality: 'high',
  },
];

type MsgDataType = typeof msgData;

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    msgData,
  }),
  getters: {
    unreadMsg: (state) => state.msgData.filter((item: NotificationItem) => item.status),
    readMsg: (state) => state.msgData.filter((item: NotificationItem) => !item.status),
  },
  actions: {
    setMsgData(data: MsgDataType) {
      this.msgData = data;
    },
  },
  persist: true,
});
