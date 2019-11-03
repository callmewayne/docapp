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

#### window.onload && window.addEventListener 区别
执行顺序：  
- addEventListener 比 onload 先执行 
- addEventListener 在DOM树加载完毕后执行
- onload 在DOM树加载完并且所有文件（图片，脚本）加载完之后执行
执行次数：
- addEventListener 可多次调用
- onload 只能绑定一次，多次绑定则执行最后一次绑定的处理函数



#### Hook
是能让你在函数的数组中勾入react特性的函数   

useState  
读写记录状态   

useRef   
可以记录绑定的节点元素，从而对其进行操作   

useEffect  
响应事件
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

#### HOC(Higher Order component)高阶组件   
- 高阶组件就是一个函数，接受一个组件作为参数，返回一个新的组件  


#### Hook规则

- 只在最顶层使用Hook   
不要在循环，条件或嵌套函数中调用 Hook  
- 是在react函数中使用Hook，或者其他自定义hook中使用hook


#### react 思想流程
- 将设计好的UI划分为组件层级  
- 创建应用的静态版本  
- 确定UI state最小且完整表示
...

#### 组件拆分  
左侧：   
- filesearch   
- filelist
- new file
- load file 

右侧：
- file tabs
- editor

启动插件   
concurrently   同时打开server和electron
wait-on //等待文件启动后启动另一个文件    
cross-env  //BROWSER=node server启动后不会打开web端   


开发模块
classnames 组合classname  

#### 自定义hook组件

useKeyPress监听键盘按下事件，按enter键提交，按esc退出输入框


#### 文件持久化

- 使用fs模块操作文件


#### flatten state
- 打平数据冗余，解决数据冗余，normalizing state shape
- 处理数据更加方便
```
export const flattenArr = (arr)=>{
      return arr.reduce((map,item)=>{
          map[item.id] = item
          return map
      },{})
}

```
使用reduce函数，遍历数组取元素id为key，元素本身为value，将数组组合成map形式数据结构

#### 添加持久化数据存储

使用electron-store来缓存文件索引信息   

#### 结构赋值技巧
将你想删除的对象抽离出来，然后取出后面所有的值，就相当于你在这个对象中删除了一个元素
```
const {[id]:value,...afterDelete} = files
value是你匹配出的对象
afterDelete是抽离目标对象后的元素
```

#### electron方法
electron dialog
menu
openExternal

#### DOM操作

当前点击的元素是否被targetSelector包含

document.querySelector(targetSelector).contains(e.target) 

#### DOMContentLoaded 与 load 事件的区别
DOMContentLoaded 指的是文档中 DOM 内容加载完毕的时间，也就是说 HTML 结构已经完整。但是我们知道，很多页面包含图片、特殊字体、视频、音频等其他资源，这些资源由网络请求获取，DOM 内容加载完毕时，由于这些资源往往需要额外的网络请求，还没有请求或者渲染完成。而当页面上所有资源加载完成后，load 事件才会被触发。因此，在时间线上，load 事件往往会落后于 DOMContentLoaded 事件。

#### 流的类型
- readable可读流
- writeable可写流
- duplex双向流
- transform转换流

