import * as XLSX from 'xlsx';

export const downExcel = () => {
  // 定义表头字段
  const headers = ['shop_id', 'shop_name', 'shop_addr', 'province', 'sys_name'];

  // 创建一个空的工作簿
  const workbook = XLSX.utils.book_new();

  // 创建一个空的工作表
  const worksheet = XLSX.utils.json_to_sheet([], { header: headers });

  // 将工作表添加到工作簿中
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 将工作簿转换为二进制数据
  const data = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  // 创建一个 Blob 对象，并将二进制数据写入其中
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // 创建一个下载链接，并将 Blob 对象绑定到链接中
  const url = window.URL.createObjectURL(blob);

  // 创建一个 <a> 元素，并设置其属性
  const link = document.createElement('a');
  link.href = url;
  link.download = 'dict.xlsx';

  // 将 <a> 元素添加到文档中，并模拟点击它
  document.body.appendChild(link);
  link.click();
  link.remove();

  // 释放 Blob 对象
  window.URL.revokeObjectURL(url);
};
