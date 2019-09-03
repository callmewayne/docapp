const { app,BrowserWindow ,ipcMain}  = require('electron') 
app.on('ready',()=>{
require('devtron').install()
    let mainWindow = new BrowserWindow({
        width:1600,
        height:600,
        webPreferences:{
            nodeIntegration:true//在渲染进程可以使用node
        }
    })
    mainWindow.loadFile('index.html')

    mainWindow.webContents.openDevTools()
    ipcMain.on('message',(event,arg)=>{
        console.log(arg)
        event.reply('reply','hello from mainpeocess')
    })
    // let secoundWindow = new BrowserWindow({
    //     width:800,
    //     height:400,
    //     webPreferences:{
    //         nodeIntegration:true//在渲染进程可以使用node
    //     },
    //     parent:mainWindow
    // })
    // secoundWindow.loadFile('secound.html')
}) 

