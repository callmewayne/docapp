const qiniu = require('qiniu')

class QiniuManager{
    constructor(accessKey, secretKey,bucket){
        this.mac =  new qiniu.auth.digest.Mac(accessKey, secretKey);
        this.bucket = bucket

        this.config = new qiniu.conf.Config();
        this.config.zone = qiniu.zone.Zone_z0;
        this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
        this.publicBucketDomain = 'http://q06tnx03r.bkt.clouddn.com';
    }
 
    //上传文件
    uploadFile(key,localFilePath){
        var options = {
            scope:this.bucket +':' + key,

          }
          var putPolicy = new qiniu.rs.PutPolicy(options);
          var uploadToken=putPolicy.uploadToken(this.mac);
          var formUploader = new qiniu.form_up.FormUploader(this.config);
          var putExtra = new qiniu.form_up.PutExtra();
        //   var key='devdoc.md';
          return new Promise((resolve,reject)=>{
            // 文件上传
            formUploader.putFile(uploadToken, key, localFilePath, putExtra, this._handleCallback(resolve,reject));
          })
          
   }

   deleteFile(key){
    return new Promise((resolve,reject)=>{
        this.bucketManager.delete(this.bucket,key, this._handleCallback(resolve,reject))
        
    })
     
   }


   _handleCallback(resolve,reject){
       return (respErr,respBody, respInfo)=>{
            if (respErr) {
                throw respErr;
            }
            if (respInfo.statusCode == 200) {
                resolve(respBody)
                console.log(respBody);
            } else {
                reject({
                    statusCode:respInfo.statusCode,
                    body:respBody
                })
                console.log(respInfo.statusCode);
                console.log(respBody);
            }
       }
      
   
   }
}

module.exports = QiniuManager