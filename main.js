const {app,dialog,Menu ,ipcMain} = require('electron')
const isDev = require('electron-is-dev')
const menuTemplate = require('./src/menuTemplate')
const Store = require('electron-store')
const path = require('path')
const uuidv4 = require('uuid/v4')
const AppWindow = require('./src/AppWindow')
const settingStore = new Store({name:'Settings'})
const QiniuManager = require('./src/utils/QiniuManager')
const fileStore = new Store({'name':'Files Data'})
let mainWindow,settingsWindow;
const createManger = ()=>{
    const accessKey =  settingStore.get('accessKey')
    const secretKey =  settingStore.get('secretKey')
    const bucketName =  settingStore.get('bucketName')
    return new QiniuManager(accessKey,secretKey,bucketName)
}
app.on('ready',()=>{
    require('devtron').install()
    // mainWindow = new BrowserWindow({
    //     width:1024,
    //     height:680,
    //     webPreferences:{
    //         nodeIntegration:true
    //     }
    // })

    const mainWindowConfig = {
        width:1024,
        height:680
    }

    const urlLocation = isDev? 'http://localhost:3000':null
    mainWindow  = new AppWindow(mainWindowConfig,urlLocation)
    mainWindow.webContents.openDevTools()
   // mainWindow.loadURL(urlLocation)
   
   mainWindow.on('closed',()=>{
    mainWindow = null
})
//设置menu
const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)
ipcMain.on('open-settings-window',()=>{
    const settingWindowConfig = {
        width:500,
        height:400,
        parent:mainWindow
    }
    const settingsFileLocation = `file://${path.join(__dirname,'./settings/setting.html')}`
 settingsWindow = new AppWindow(settingWindowConfig,settingsFileLocation)
// settingsWindow.removeMenu()
 settingsWindow.on('closed',()=>{
    settingsWindow = null
})
})
//监听设置保存时间
ipcMain.on('config-is-saved',()=>{
     let qiniuMenu = process.platform ==='darwin'?menu.items[3]:menu.items[2]
     const switchItems = (toggle)=>{
         [1,2,3].forEach(number=>{
            qiniuMenu.submenu.items[number].enabled = toggle
         })
     }
     const qiniuIsConfiged = ['accessKey', 'secretKey', 'bucketName'].every(key =>  !!settingStore.get(key))
     if(qiniuIsConfiged){
         switchItems(true)
     }else{
        switchItems(false)
     }
})
//监听文件保存事件
ipcMain.on('upload-file',(event,data)=>{
    const manager = createManger()
    manager.uploadFile(data.key,data.path).then(data=>{
        console.log('上传成功',data)
        mainWindow.webContents.send('active-file-uploaded')
    }).catch(()=>{
        dialog.showErrorBox('同步失败','请检查七牛云同步是否正确')
      })
  })
ipcMain.on('download-file',(event,data)=>{
  const manager = createManger()
  const filesObj = fileStore.get('files')
  const { key,path,id} = data
  manager.getStat(data.key).then((resp=>{
     console.log(resp )
     console.log(filesObj[data.id])
     const serverupdateTime = Math.round(resp.putTime/10000)
     const localUpdatedTime = files
     if(serverupdateTime > localUpdatedTime || !localUpdatedTime){
         manager.downloadFile(key,path).then(()=>{
             mainWindow.webContents,send('file-download',{status:'download-success',id})
         })
     }else{
        mainWindow.webContents,send('file-download',{status:'node-new-file',id})
     }
  },error=>{
   console.log(error)
   if(error.statusCode==612){
       mainWindow.webContents.send('file-downloaded',{status:'no-file'})
   }
  }))
})
ipcMain.on('upload-all-to-qiniu',()=>{
    const manager = createManger()
    mainWindow.webContents.send('loading-status',true)
    const filesObj = fileStore.get('files') || {}
    const uploadPromiseArr = Object.keys(filesObj).map(key=>{
        const file = filesObj[key]
        return manager.uploadFile(`${file.title}.md`,file.path)

    })
    Promise.all(uploadPromiseArr).then(result=>{
        console.log(result)
        dialog.showMessageBox({
            type:'info',
            title:`成功上传了${result.length}个文件`,
            message:`成功上传了${result.length}个文件`,
        })
        mainWindow.webContents.send('files-uploaded')
    }).catch(error=>{
        dialog.showErrorBox('同步失败','请检查七牛云参数')
    }).finally(()=>{
        mainWindow.webContents.send('loading-status',false)

    })
   
})
ipcMain.on('download-from-qiniu',()=>{
    const manager = createManger()
    manager.getFileList().then(item=>{
        console.log(item)
    })
})
})
  