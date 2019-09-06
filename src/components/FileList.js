import React,{useState,Fragment,useEffect,useRef} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit,faTrash ,faTimes} from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'


const FilesList = ({files,onFileClick,onSaveEdit,onFileDelete})=>{
const [ editStatus,setEditStatus ] = useState(false)
const [ value,setValue ] = useState('')
   //利用自定义hook监听按键事件
   const enterPressed = useKeyPress(13)
   const escPressed = useKeyPress(27)
   let node = useRef(null)
    const closeSearch = ()=>{
    setEditStatus(false)
    setValue('')
   }
   useEffect(()=>{
    //响应键盘事件
    if(enterPressed && editStatus){
        const editItem = files.find(file => file.id ===editStatus)
            onSaveEdit(editItem.id,value)
            setEditStatus(false)
            setValue('')
    }
    if(escPressed && editStatus){
        closeSearch()
    }
  
   
    // const handleInputEvent = (event)=>{
    //     const { keyCode } = event
    //     if(keyCode === 13 && editStatus){
    //         const editItem = files.find(file => file.id ===editStatus)
    //         onSaveEdit(editItem.id,value)
    //         setEditStatus(false)
    //         setValue('')
    //     }else if(keyCode === 27 && editStatus){
    //      closeSearch(event)
    //     }
    // }
    // document.addEventListener('keyup',handleInputEvent)
    // return ()=>{
    //     document.removeEventListener('keyup',handleInputEvent)
    // }
})

useEffect(()=>{
    //响应聚焦事件
    if(editStatus){
     node.current.focus()
    }
},[editStatus])
    return (
        <ul className="list-group list-group-flush file-list" >
             {
                 files.map(file=>{
                  return   <li 
                       className="list-group-item row bg-light d-flex align-items-center file-list-item mx-0"
                       key={file.id}
                     >

                     {
                         (file.id!== editStatus) &&
                         <Fragment>        
                            <span className="col-2 ">
                            <FontAwesomeIcon icon={faMarkdown} title=""/>
                            </span>
                            <span className="col-6 c-link" onClick={()=>{onFileClick(file.id)}}>
                                {file.title}
                            </span>
                            <button  type="button" className="icon-button col-2" onClick={()=>{setEditStatus(file.id);setValue(file.title)}} >
                                <FontAwesomeIcon icon={faEdit} title="编辑"/>
                            </button>
                            <button  type="button" className="icon-button col-2">
                                <FontAwesomeIcon icon={faTrash} onClick={()=>{onFileDelete(file.id)}} title="删除"/>
                            </button>
                         </Fragment>
                      }
                      {
                          (file.id===editStatus) &&
                          <Fragment>
                              <input className="form-control col-10" ref={node}  value={value} onChange={(e)=>{setValue(e.target.value)}} />
                                  <button  type="button" className="icon-button col-2" onClick={closeSearch}>
                                    <FontAwesomeIcon icon={faTimes} title="关闭"/>
                                  </button>
                          </Fragment>
                      }

                     </li>
                 })
             }
        </ul>
    )
}

FilesList.propTypes = {
    onFileClick:PropTypes.func,
    onFileDelete:PropTypes.func,
    onSaveEdit:PropTypes.func,
}
export default FilesList