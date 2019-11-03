// const fs = require('fs')
// const zlib = require('zlib')
// const src = fs.createReadStream('./src/test.js')
// const writeDesc = fs.createWriteStream('./test.zip')
// src.pipe(zlib.createGzip()).pipe(writeDesc)//转换流，gulp
const path = require('path')
const  QiniuManager = require('./src/utils/QiniuManager')
const accessKey = 'FrzGLaK_GX5y-EyNg7lEZAP2otACOoYnVwVSHtsM'
const secretKey = 'vFvIvQD9v1bvRqD2g19ulVE5I6yJj4LEQVuEJQso'

const localFile = "C:/Users/wayne/Documents/newDocuments/newname.md"
const key = 'newnam.md'
const manager = new QiniuManager(accessKey,secretKey,'docstoreage')
//manager.uploadFile(key,localFile)
// manager.deleteFile(key)
// const publicBucketDomain = 'http://q06tnx03r.bkt.clouddn.com'
const downloadPath = path.join(__dirname,key)
// manager.generateDownloadLink(111).then(data=>{
//     console.log(data)
// })

manager.downloadFile(key,downloadPath)


