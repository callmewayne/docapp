const  QiniuManager = require('./utils/QiniuManager')
const accessKey = 'FrzGLaK_GX5y-EyNg7lEZAP2otACOoYnVwVSHtsM'
const secretKey = 'vFvIvQD9v1bvRqD2g19ulVE5I6yJj4LEQVuEJQso'

const localFile = "C:/Users/wayne/Documents/newDocuments/newname.md"
const key = 'newname.md'
const manager = new QiniuManager(accessKey,secretKey,'docstoreage')
//manager.uploadFile(key,localFile)
manager.deleteFile(key)
// const publicBucketDomain = 'http://q06tnx03r.bkt.clouddn.com'

