// vite.config.js
const COS = require('cos-nodejs-sdk-v5');

const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const { secretId, secretKey, region, bucket } = config || {};
function getAllFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const filePath = path.join(dir, item);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      files = files.concat(getAllFiles(filePath));
    } else {
      files.push(path.relative(dirPath, filePath));
    }
  }
  return files;
}
const cos = new COS({
  SecretId: secretId || '',
  SecretKey: secretKey || '',
});
// 遍历文件夹
const dirPath = 'dist';
const files = getAllFiles(dirPath);

for (const file of files) {
  // 读取文件内容
  const filePath = path.join(dirPath, file);
  const fileContent = fs.readFileSync(filePath);
  console.log(fileContent);
  // 上传文件
  cos.putObject(
    {
      Bucket: bucket,
      Region: region,
      Key: path.join(file),
      Body: fileContent,
    },
    (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(data);
      }
    },
  );
}
