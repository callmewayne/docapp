const qiniu = require('qiniu')
const accessKey = 'FrzGLaK_GX5y-EyNg7lEZAP2otACOoYnVwVSHtsM'
const secretKey = 'vFvIvQD9v1bvRqD2g19ulVE5I6yJj4LEQVuEJQso'


const options = {
    scope:'doccloud'
}



class QiniuManager{
    constructor(accessKey,secretKey,bucket){
        //生成mac
        this.mac = new qiniu.auth.digest.Mac(accessKey,secretKey)
        this.bucket = bucket
        //初始化配置
        this.config = new qiniu.conf.Config()

        this.config.zone = qiniu.zone.Zone_z0
        
        this.bucketManager = new qiniu.rs.BucketManager(this.mac,this.config)


    }

    uploadFile(key,localFilePath){
        const options = {
            scope:this.bucket + ':' + key
        }
        const putPolicy = new qiniu.rs.PutPolicy(options)
        const uploadToken = putPolicy.uploadToken(this.mac)

        const formUploader = new qiniu.form_up.FormUploader(this.config);
        const putExtra = new qiniu.form_up.PutExtra();

        formUploader.putFile(uploadToken,key,localFilePath,putExtra,function(err,body,info){
            if(err){
                throw err
            }
            if(info.statusCode === 200){
                console.log(body)
            } else{
               console.log(info)
            }
        })
    }

    deleteFile(key){
        this.bucketManager.delete(this.bucket,key,function(err,body,info){
            if(err){
                throw err
            }
            if(info.statusCode === 200){
                console.log(body)
            } else{
               console.log(info)
            }
        })
    }

}

module.exports = QiniuManager