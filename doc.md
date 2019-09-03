### 开发手册

#### 快速安装electron
 > git clone https://github.com/electron/electron-quick-start   
 >npm install   
 cd 到electron-quick-start   
   npm start即可开启electron


#### 进程Process

一个进程可以多个线程

- 进程   
CPU一个内核只有一个进程
- 线程    
一个进程可以包含多个线程

进程与线程之间的区别  

内存使用

通讯机制ipc

#### 主进程和渲染进程  
一个主进程，有多少tab就有多少个渲染进程

区别：
- 主进程  
1. 可以使用和系统对接的electron API- 创建菜单，上传文件等等  
2. 创建渲染进程
3. 支持nodejs
4. 有且只有一个，作为程序的入口

- 渲染进程
1. 可以有多个，每一个对应一个窗口
2. 每一个都是一个单独的进程
3. 支持nodejs 和 DOM API
4. 使用一部分electron api


#### 进程之间通讯方式
electron使用IPC在进程之间通讯

Main process <--> IPC <--> renderer process

使用remote模块实现跨进程访问
渲染进程可以直接使用主进程方法

#### 使用DEVTRON监控IPC传输事件

npx (npm5.0以上)避免全局安装模块

#### React

声明式写法
组件化


#### Hook
是能让你在函数的数组中勾入react特性的函数   

useState  

useEffect  
副作用   
- 无需清除的副作用   
```
   useEffect(()=>{
        document.title = `点击了${obj.like}次`
    })
```
- 需要清除的副作用
```
      const updateMouse = (event)=>{
                setPositions({x:event.clientX,y:event.clientY})
           
        }
        console.log('addlistener')
        document.addEventListener('click',updateMouse)
        return ()=>{
          console.log('remove listener')
           document.removeEventListener('click',updateMouse)
        }
    })
```
- 选择清除的副作用   
在useEffect添加第二个参数，选择需要监听哪个参数的变化
```
  const [ url,setUrl] = useState('')
  
    const [fetch,setFetch] = useState(false)
    useEffect(()=>{

axios.get('https://dog.ceo/api/breeds/image/random').then(res=>{
    console.log(res)
    setUrl(res.data.message)

})
    },[fetch])
```


