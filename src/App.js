import React ,{ useState,useEffect,Fragment} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,faFileImport ,faSave} from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import fileHelper from './utils/fileHelper'
import { flattenArr,objToArr,timestampToString} from './utils/helper'
import uuidv4 from 'uuid/v4'
import FileSearch from './components/FileSearch'
import FilesList from './components/FileList'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'
import Loader from './components/Loader'
import useIpcRenderer from './hooks/useIpcRenderer'

const { join ,basename,extname,dirname} = window.require('path')
const { remote,ipcRenderer } = window.require('electron')
const  Store = window.require('electron-store')
const fileStore = new Store({'name':'Files Data'})
const settingStore = new Store({name:'Settings'})
console.log(fileStore.get('files'))
const getAutoSync = () => ['accessKey', 'secretKey', 'bucketName', 'enableAutoSync'].every(key => !!settingStore.get(key))
//保存文件列表到store
const saveFilesToStore = (files)=>{
  //不需要把所有的信息都存到filesystem里
  const fileStoreObj = objToArr(files).reduce((result,file)=>{
    const { id, path ,title,createdAt,isSynced,updatedAt} = file
    result[id] = {
      id,
      path,
      title,
      createdAt,
      isSynced,
      updatedAt
    }
    return result
  },{})
  fileStore.set('files',fileStoreObj)
}





function App() {
    const [ files,setFiles] = useState(fileStore.get('files') || {})
    const [ activeFileID,setActiveFileID ] = useState('')
    const [ openFileIDs,setOpenFileIDs ] = useState([])
    const [ unsaveFileIDs,setUnsaveFileIDs] = useState([])
    const [ searchedFiles,setSearchedFiles] = useState([])
    const [ isLoading,setLoading] = useState(false)
    const savedLocation = settingStore.get('savedLocation') || remote.app.getPath('documents')
    const filesArr = objToArr(files)
    const openedFiles = openFileIDs.map(openID=>{
      return files[openID]
    })
    const activeFile = files[activeFileID]
    const fileListArray = (searchedFiles.length >0)?searchedFiles:filesArr

  


    //未发现文件事件
    const notFoundFile = (fileID)=>{
      var r = window.confirm("未找到此文件,将更新文件列表");
      if (r == true) {
        const {[fileID]:value,...afterDelete} = files
        setFiles(afterDelete)
        saveFilesToStore(afterDelete)
      } 
    }
  //点击文件事件
    const fileClick = (fileID)=>{
      setActiveFileID(fileID)
      const currentFile = files[fileID]
      const { id,title,path,isLoaded} = currentFile
      if(!isLoaded){
        if(getAutoSync()){
          ipcRenderer.send('download-file',{key:`${title}.md`,path,id})
        }else{
          fileHelper.readFile(currentFile.path).then((value=>{
            const newFile = {...files[fileID],body:value,isLoaded:true}
            setFiles({...files,[fileID]:newFile})
          })).catch(err=>{
            //如果没有找到本地文件，则会删除files里对应的文件
            if(err.toString().includes('no such file or directory')){
              notFoundFile(fileID)
            }else{
              console.log(false)
            }
          })
        }
            
      }
      if(!openFileIDs.includes(fileID)){
         setOpenFileIDs([...openFileIDs,fileID])
      }

    }
    
    //点击tab事件
    const tabClick = (fileID)=>{
      setActiveFileID(fileID)
     }

     //关闭tab事件
     const tabClose = (id)=>{
       //remove this current id from openFileIDs
           const tabsWithout = openFileIDs.filter(fileID=>fileID !== id)
           setOpenFileIDs(tabsWithout)
           //set active to the first opend tab if still tabs left
           if(tabsWithout.length>0){
            setActiveFileID(tabsWithout[0])
           }else{
            setActiveFileID('')
           }

     }
    //文件变化事件
     const fileChange = (id,value)=>{
       if(value !==files[id].body){
        const newFile = {...files[id],body:value}
        setFiles({...files,[id]:newFile})
          //update unsavefileid
          if(!unsaveFileIDs.includes(id)){
            setUnsaveFileIDs([...unsaveFileIDs,id])
          }
       }
     }
    //删除文件事件
     const deleteFile = (id)=>{
       if(files[id].isNew){
         //解构赋值技巧，
         //将你想删除的对象抽离出来，然后取出后面所有的值，就相当于你在这个对象中删除了一个key
         const {[id]:value,...afterDelete} = files
        //为什么不直接 delete files[id] ，删除一个对象后files的索引id不变，react不更新数据，所以采用抽离对象的方式改变files
        setFiles(afterDelete)
       }else{
        fileHelper.deleteFile(files[id].path)
        .then(()=>{
          const {[id]:value,...afterDelete} = files
          setFiles(afterDelete)
          saveFilesToStore(afterDelete)
         //close tab if open
         tabClose(id)
       
        }).catch(err=>{
          //如果没有找到本地文件，则会删除files里对应的文件
          if(err.toString().includes('no such file or directory')){
            notFoundFile(id)
          }else{
            console.log(false)
          }
        })
       }
     }

     const updateFileName = (id,title,isNew)=>{
       //根据是不是新文件做处理，如果不是新文件，则根据老path做处理。取到老文件的dirname，再加上文件的title
       const newPath = isNew? join(savedLocation,`${title}.md`):join(dirname(files[id].path),`${title}.md`)
       let modifyFile = {...files[id],title,isNew:false,path:newPath} 
       const newFiles = {...files,[id]:modifyFile}

       if(isNew){
          fileHelper.writeFile(newPath,files[id].body)
          .then(()=>{
              setFiles(newFiles)
              saveFilesToStore(newFiles)
          }).catch(err=>{
            //如果没有找到本地文件，则会删除files里对应的文件
            if(err.toString().includes('no such file or directory')){
              notFoundFile(id)
            }else{
              console.log(false)
            }
          })
       }else{
         let oldPath = files[id].path
        fileHelper.renameFile(oldPath,
          newPath
        )
        .then(()=>{
          setFiles(newFiles)
          saveFilesToStore(newFiles)
        }).catch(err=>{
          //如果没有找到本地文件，则会删除files里对应的文件
          if(err.toString().includes('no such file or directory')){
            notFoundFile(id)
          }else{
            console.log(false)
          }
        })
       }
            

     }

     const fileSearch = (keyWords)=>{
           //filter out the new files
           const newFiles = filesArr.filter(file=>file.title.includes(keyWords))

           setSearchedFiles(newFiles)
     }
     
    //创建文件事件
     const createNewFile = ()=>{
       const newId = uuidv4()
       let newFile = {
         id:newId,
         title:'',
         body:'## 请输入markdown',
         createdAt:new Date().getTime(),
         isNew:true
       }
   
       setFiles({...files,[newId]:newFile})
     }
    
     //保存文件方法
      const saveCurrentFile = ()=>{
        const { path ,body,title} = activeFile
     fileHelper.writeFile(join(path),body).then(()=>{
       setUnsaveFileIDs(unsaveFileIDs.filter(id=>id !== activeFile.id))
         
        if(getAutoSync()){
          ipcRenderer.send('upload-file',{key:`${title}.md`,path
})
        }
     })
      }
    const importFiles = ()=>{
      remote.dialog.showOpenDialog({
        title:'选择导入的 Markdown 文件',
        properties:['openFile','multiSelections'],
        filters:[
          {name:'Markdown files',extensions:['md']}
        ]
      },(paths=>{
        if(Array.isArray(paths)){
          //过滤electron-store里已经有的数据
         const filteredPaths = paths.filter(path=>{
           const alreadyAdded = Object.values(files).find(file=>{
             return file.path ==path
           })
           return !alreadyAdded
         })

        
          //扩展数组里的对象 
           const importFilesArr = filteredPaths.map(path=>{
             return {
               id:uuidv4(),
               title:basename(path,extname(path)),
               path,
             }
           })
         //获取flatten结构的数组
         const newFiles = {...files,...flattenArr(importFilesArr)}
         //setState 更新updateState
         
         setFiles(newFiles)
         saveFilesToStore(newFiles)
         if(importFilesArr.length > 0){
           remote.dialog.showMessageBox({
             type:'info',
             title:`文件导入成功！`,
             message:`成功导入了${importFilesArr.length}个文件`,
           })
         }
        }
      }))

    }
     //自动保存事件
     const activeFileUploaded = ()=>{
       const { id} = activeFile
       const modifiedFile = {...files[id],isSynced:true,updatedAt:new Date().getTime()}
       const newFiles = { ...files,[id]:modifiedFile }
       setFiles(newFiles)
       saveFilesToStore(newFiles)
     }
     //自动下载事件
     const activeFileDownloaded =(event,message)=>{
      const currentFile = files[message.id]
       const {  id,path} = currentFile
       fileHelper.readFile(path).then(value=>{
         let newFile
         if(message.status=='download-success'){
           newFile = {...files[id],body:value,isLoaded:true,isSynced:true,updatedAt:new Date().getTime()}
         }else{
          newFile = {...files[id],body:value,isLoaded:true,isSynced:true}
         }
         const newfiles = {...files,newFile}
         setFiles(newfiles)
         saveFilesToStore(newfiles)
       })
     }

     const filesUploaded = ()=>{
        const newFiles = objToArr(files).reduce((result,file)=>{
              const currentTime = new Date().getTime()
              result[file.id]={
                ...files[file.id],
                isSynced:true,
                updatedAt:currentTime
              }
              return result
        },{})
        setFiles(newFiles)
        saveFilesToStore(newFiles)
     }
     const downloadFilesFromQiniu = ()=>{}
      //监听ipc事件
      useIpcRenderer({
        'create-new-file':createNewFile,
        'import-file':importFiles,
        'save-edit-file':saveCurrentFile,
        'active-file-uploaded':activeFileUploaded,
        'file-download':activeFileDownloaded,
        'loading-status':(message,status)=>{
         setLoading(status)
        },
        'files-uploaded':filesUploaded,
        'download-files-from-qiniu':downloadFilesFromQiniu
      })
      
  return (
    <div className="App container-fluid px-0">
      { isLoading && <Loader />} 
      <div className="row no-gutters">
         <div className="col-4 bg-light left-panel">
              <FileSearch title='My Document' onFileSearch={fileSearch}/>
              <FilesList 
                files={fileListArray}
                onFileClick={fileClick}
                onFileDelete={deleteFile}
                onSaveEdit={updateFileName}
             
              />
              <div className="row no-gutters button-group">
                <div className="col-6">
                    <BottomBtn 
                       text="新建"
                       colorClass="btn-primary"
                       icon={faPlus}
                       onBtnclick={createNewFile}
                    />
                </div>
                <div className="col-6">
                    <BottomBtn 
                      text="导入"
                      colorClass="btn-success"
                      icon={faFileImport}
                      onBtnclick={importFiles}
                      
                      />
                     
                </div>
              </div>
          </div>
          <div className="col-8  right-panel">
          {!activeFile &&
           <div className="start-page">
           选择或者创建新的 markdown 文档

           </div>
          } 
             {
               activeFile &&
                <Fragment>
                        <TabList 
             
                        files={openedFiles}
                        activeId={activeFileID}
                        onTabClick={tabClick}
                        onCloseTab={tabClose}
                        unsaveIds={unsaveFileIDs}
                        />
                        <SimpleMDE 
                        key={ activeFile && activeFile.id}
                        onChange={(value)=>{fileChange(activeFile.id,value)}}
                        value={activeFile && activeFile.body }
                        options={{
                          minHeight:"437px"

                        }}
                       
                />
                     {
                          activeFile.isSynced && <span className="sync-status">已同步，上次同步：{timestampToString(activeFile.updatedAt)}</span>
                     }
                </Fragment>
             }
              {/* <BottomBtn 
                      text="保存"
                      colorClass="btn-success"
                      icon={faSave}
                      onBtnclick={saveCurrentFile}
                      /> */}
          </div>
         
       </div>
      
    </div>
  );
}
export default App;
