<template>
  <div class="list-common-table">
    <t-row justify="start" class="mb-20">
      <t-upload
        :action="`${host}/api/excel-find/uploadExcel`"
        :tips="tips"
        :before-upload="beforeUpload"
        :disabled="uploadDisable"
        @fail="handleFail"
        @success="handleSuc"
      >
        <t-button theme="primary" shape="round" :disabled="uploadDisable">上传字典</t-button>
      </t-upload>
      <t-button theme="success" shape="round" class="ml-20" @click="downExcel">下载模板</t-button>
      <t-popconfirm
        :visible="visible"
        theme="default"
        content="是否要删除所有字典！"
        @cancel="() => (visible = false)"
        @confirm="onDelAllData"
        @visible-change="onVisibleChange"
      >
        <t-button theme="warning" shape="round" class="ml-20">删除字典</t-button>
      </t-popconfirm>
    </t-row>
    <t-form
      ref="form"
      :data="formData"
      :label-width="80"
      colon
      :style="{ marginBottom: '8px' }"
      @reset="onReset"
      @submit="onSubmit"
    >
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[16, 24]">
            <t-col :span="4">
              <t-form-item label="搜索词" name="name">
                <t-input
                  v-model.trim="formData.keyword"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入搜索关键词"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="店铺系统" name="status">
                <t-input
                  v-model.trim="formData.sys_name"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入店铺系统"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="省份/城市" name="no">
                <t-input
                  v-model.trim="formData.province"
                  class="form-item-content"
                  placeholder="请输入省份/城市"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button theme="primary" type="submit" :style="{ marginLeft: '8px' }"> 查询 </t-button>
          <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table
        :data="data"
        :columns="COLUMNS"
        :row-key="rowKey"
        :vertical-align="verticalAlign"
        :hover="hover"
        :pagination="pagination"
        :loading="dataLoading"
        :header-affixed-top="headerAffixedTop"
        @page-change="rehandlePageChange"
      >
      </t-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { PrimaryTableCol, TableRowData, PageInfo, MessagePlugin } from 'tdesign-vue-next';
import { getList, delAllData } from '@/api/list';
import { useSettingStore } from '@/store';
import { prefix } from '@/config/global';
import { downExcel } from '@/utils/xlsx';
import proxy from '@/config/proxy';

const env = import.meta.env.MODE || 'development';

// 如果是mock模式 或 没启用直连代理 就不配置host 会走本地Mock拦截 或 Vite 代理
const host = env === 'mock' || !proxy.isRequestProxy ? '' : proxy[env].host;
const tips = '大小在 5M 内';
const store = useSettingStore();

const files = ref([]);
const uploadDisable = ref(false);
const handleFail = ({ file }) => {
  uploadDisable.value = false;
  MessagePlugin.error(`文件 ${file.name} 上传失败`);
};
const handleSuc = async ({ file }) => {
  await fetchData();
  MessagePlugin.success(`文件 ${file.name} 上传成功, 请不要频繁操作`);
  setTimeout(() => {
    files.value = [];
    uploadDisable.value = false;
  }, 60 * 1000);
};
const beforeUpload = (file) => {
  if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    MessagePlugin.warning('请上传xlsx文件类型');
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    MessagePlugin.warning('上传的xlsx不能大于5M');
    return false;
  }
  uploadDisable.value = true;
  return true;
};

const visible = ref(false);
const onDelAllData = async () => {
  const msg = MessagePlugin.info('提交中');
  await delAllData();
  await fetchData();
  const timer = setTimeout(() => {
    MessagePlugin.close(msg);
    MessagePlugin.success('删除成功！');
    visible.value = false;
    uploadDisable.value = false;
    clearTimeout(timer);
  }, 1000);
};
const onVisibleChange = (val) => {
  visible.value = val;
};
const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  {
    title: '店铺编号(shop_id)',
    fixed: 'left',
    width: 200,
    ellipsis: true,
    align: 'left',
    colKey: 'shop_id',
  },
  { title: '店铺名称(shop_name)', colKey: 'shop_name', width: 200 },
  {
    title: '系统名称(sys_name)',
    width: 200,
    ellipsis: true,
    colKey: 'sys_name',
  },
  {
    title: '省份/城市(province)',
    width: 200,
    ellipsis: true,
    colKey: 'province',
  },
  {
    title: '店铺地址(shop_addr)',
    width: 200,
    ellipsis: true,
    colKey: 'shop_addr',
  },
];

const searchForm = {
  keyword: '',
  province: '',
  sys_name: '',
};

const formData = ref({ ...searchForm });
const rowKey = 'index';
const verticalAlign = 'top' as const;
const hover = true;

const pagination = ref({
  defaultPageSize: 20,
  total: 100,
  defaultCurrent: 1,
});

const data = ref([]);

const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { defaultCurrent: pageNum, defaultPageSize: pageSize } = pagination.value;

    const params = { ...formData.value, page: { pageNum, pageSize } };
    const { list, count } = await getList(params);
    data.value = list;
    pagination.value = {
      ...pagination.value,
      total: count,
    };
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const onReset = (val) => {
  formData.value = { ...searchForm };
};
const onSubmit = (val) => {
  fetchData();
};
const rehandlePageChange = (pageInfo: PageInfo) => {
  const { current, pageSize } = pageInfo;
  pagination.value = { ...pagination.value, defaultCurrent: current, defaultPageSize: pageSize };
  fetchData();
};
const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    } as any), // TO BE FIXED
);
</script>

<style lang="less" scoped>
.mb-20 {
  margin-bottom: 20px;
}
.ml-20 {
  margin-left: 20px;
}
.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: 30px 32px;
  border-radius: var(--td-radius-default);

  .table-container {
    margin-top: 30px;
  }
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .expand {
    .t-button__text {
      display: flex;
      align-items: center;
    }
    .t-icon {
      margin-left: 4px;
      transition: transform 0.3s ease;
    }
  }
}

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}
</style>
