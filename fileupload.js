const QiniuManager = require('./src/utils/QiniuManager')

var accessKey = 'FrzGLaK_GX5y-EyNg7lEZAP2otACOoYnVwVSHtsM';
var secretKey = 'vFvIvQD9v1bvRqD2g19ulVE5I6yJj4LEQVuEJQso';



var localFile = "D:/stations/cloud-doc/devdoc.md";

var key='devdoc.md';
// 文件上传

var publicBucketDomain = 'http://pyfijq4ug.bkt.clouddn.com';

const manager = new QiniuManager(accessKey,secretKey,'doccloud')
manager.uploadFile(key,localFile).then(res=>{
    console.log(res)
    return manager.deleteFile(key)
}).then(data=>{
    console.log(data)
})

//manager.deleteFile(key)
// var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
// console.log(publicDownloadUrl);
