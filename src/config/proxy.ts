export default {
  isRequestProxy: true,
  development: {
    // 开发环境接口请求
    host: 'http://localhost:3000',
    // 开发环境 cdn 路径
    cdn: '',
  },
  test: {
    // 测试环境接口地址
    host: 'https://www.bitjian.cn',
    // 测试环境 cdn 路径
    cdn: '',
  },
  release: {
    // 正式环境接口地址
    host: 'https://www.bitjian.cn',
    // 正式环境 cdn 路径
    cdn: '',
  },
};
