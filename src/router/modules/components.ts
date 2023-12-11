import Layout from '@/layouts/index.vue';
import ListIcon from '@/assets/assets-slide-list.svg';

export default [
  {
    path: '/list',
    name: 'list',
    component: Layout,
    redirect: '/list/base',
    meta: {
      title: '列表页',
      icon: ListIcon,
    },
    children: [
      {
        path: 'filter',
        name: 'ListFilter',
        component: () => import('@/pages/list/filter/index.vue'),
        meta: {
          title: 'excel表格查询',
        },
      },
    ],
  },
];
