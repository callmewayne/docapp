// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//在渲染进程既可以使用node，也可以使用DOM
//页面的load事件会在DOMContentLoaded被触发之后才触发。DOMContentLoaded不要去关心图片的渲染

const { ipcRenderer} =require('electron')
const { BrowserWindow}  = require('electron').remote

window.addEventListener('DOMContentLoaded',()=>{
   document.getElementById('node-version').innerHTML = process.versions.node
   document.getElementById('send').addEventListener('click',()=>{
    ipcRenderer.send('message','hello from renderer')
    ipcRenderer.on('reply',(event,arg)=>{
        document.getElementById('message').innerHTML = arg
    })

    let win  = new BrowserWindow({
        width:800,
        height:600,
    })
    win.loadURL('http://www.baidu.com')
   })
})