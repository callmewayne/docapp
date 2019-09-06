import React ,{ useState,useEffect,Fragment} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,faFileImport ,faTimes} from '@fortawesome/free-solid-svg-icons'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import fileHelper from './utils/fileHelper'

import uuidv4 from 'uuid/v4'
import FileSearch from './components/FileSearch'
import FilesList from './components/FileList'
import BottomBtn from './components/BottomBtn'
import TabList from './components/TabList'

const { join } = window.require('path')
const { remote } = window.require('electron')
let defaultFiles = [
  {
      id:'1',
      title:'first poo',
      body:'should be',
      createdAt:123456
  },
  {
      id:'2',
      title:'secend poo',
      body:'## should be',
      createdAt:123456
  },
 
  {
      id:'3',
      title:'thirds post',
      body:'## thirds post',
      createdAt:123456
  },
]

function App() {
    const [ files,setFiles] = useState(defaultFiles)
    const [ activeFileID,setActiveFileID ] = useState('')
    const [ openFileIDs,setOpenFileIDs ] = useState([])
    const [ unsaveFileIDs,setUnsaveFileIDs] = useState([])
    const [ searchedFiles,setSearchedFiles] = useState([])
    const savedLocation = remote.app.getPath('documents')
    const openedFiles = openFileIDs.map(openID=>{
      return files.find(file => file.id === openID)
    })
    const fileClick = (fileID)=>{
      setActiveFileID(fileID)
      if(!openFileIDs.includes(fileID)){
         setOpenFileIDs([...openFileIDs,fileID])
      }
      //add new open fileID

    }
    const activeFile = files.find(file => file.id === activeFileID)

    const tabClick = (fileID)=>{
      setActiveFileID(fileID)
     }

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

     const fileChange = (id,value)=>{
       //loop throuth file arrary to update to new value
            const newFiles = files.map(file=>{
              if(file.id ===id){
                file.boday = value
              }
              return file
            })
            setFiles(newFiles)
            //update unsavefileid
            if(!unsaveFileIDs.includes(id)){
              setUnsaveFileIDs([...unsaveFileIDs,id])
            }
     }

     const deleteFile = (id)=>{
           const newFiles = files.filter(file=>file.id !==id)
           setFiles(newFiles)
           //close tab if open
           tabClose(id)
     }

     const updateFileName = (id,title,isNew)=>{
       let modifyFile 
      const newFiles = files.map(file=>{
        if(file.id === id){
          modifyFile = file
          file.title = title
          file.isNew = false
        
        }
        return file
    })
       if(isNew){
          fileHelper.writeFile(join(savedLocation,`${modifyFile.title}.md`),modifyFile.body)
          .then(()=>{
              setFiles(newFiles)
          })
       }else{
        fileHelper.renameFile(join(savedLocation,`${modifyFile.title}.md`),
        join(savedLocation,`${title}.md`)
        )
        .then(()=>{
            setFiles(newFiles)
        })
       }
            

     }

     const fileSearch = (keyWords)=>{
           //filter out the new files
           const newFiles = files.filter(file=>file.title.includes(keyWords))
           setSearchedFiles(newFiles)
     }
     const fileListArray = (searchedFiles.length >0)?searchedFiles:files

     const createNewFile = ()=>{
       const newId = uuidv4()
       let newFiles = [...files,{
         id:newId,
         title:'',
         body:'## 请输入markdown',
         createdAt:new Date().getTime(),
         isNew:true
       }]
       
       setFiles(newFiles)
     }
  return (
    <div className="App container-fluid px-0">
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
                      icon={faFileImport}/>
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
                          minHeight:"450px"

                        }}
                />

                </Fragment>
             }
           
          </div>
       </div>
      
    </div>
  );
}
export default App;
