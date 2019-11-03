const qiniu = require('qiniu')
const axios = require('axios')
const fs = require('fs')
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
   //下载文件
   downloadFile(key,downloadPath){
       this.generateDownloadLink(key).then(link=>{
           const timeStamp = new Date().getTime()
           const url = `${link}?timestamp=${timeStamp}`
           console.log(url)
           return axios({
               url,
               method:"GET",
               responseType:'stream',
               headers:{'Cache-Control':'no-cache'}
           }).then(response=>{
            
               const writer = fs.createWriteStream(downloadPath)
               response.data.pipe(writer)
               return new Promise((resolve,reject)=>{
                   writer.on('finish',resolve)
                   writer.on('error',reject)
               })
           })
       }).catch(err=>{
        console.log(err.response)
        return Promise.reject({err:err.response})
    })
   }

   //删除文件
   deleteFile(key){
    return new Promise((resolve,reject)=>{
        this.bucketManager.delete(this.bucket,key, this._handleCallback(resolve,reject))
        
    })
     
   }
    //获取bucket域名
    getBucketDomain(){
        const reqUrl = `http://api.qiniu.com/v6/domain/list?tbl=${this.bucket}`
        const digest = qiniu.util.generateAccessToken(this.mac,reqUrl)
        return new Promise((resolve,reject)=>{
            qiniu.rpc.postWithoutForm(reqUrl,digest,this._handleCallback(resolve,reject))
        })
    }
    generateDownloadLink(key){
        const domainPromise = this.publicBucketDomain?
        Promise.resolve([this.publicBucketDomain]):
        this.getBucketDomain()
        return domainPromise.then(data=>{
            if(Array.isArray(data) && data.length>0){
                const pattern = /^https?/
                this.publicBucketDomain = pattern.test(data[0])?data[0]:`http://${data[0]}`   
                return this.bucketManager.publicDownloadUrl(this.publicBucketDomain,key)
            }else{
                throw Error('域名未找到')
            }
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