const {app,BrowserWindow,Menu ,ipcMain} = require('electron')
const isDev = require('electron-is-dev')
const menuTemplate = require('./src/menuTemplate')
const Store = require('electron-store')
const path = require('path')
const uuidv4 = require('uuid/v4')
const AppWindow = require('./src/AppWindow')

let mainWindow,settingsWindow;

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
    //设置menu
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
})