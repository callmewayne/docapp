import React,{useState,useEffect,useRef} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit,faTrash } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'
const FilesList = ({files,onFileClick,onSaveEdit,onFileDelete})=>{
   console.log(files)


    return (
        <ul className="list-group list-group-flush file-list" >
             {
                 files.map(file=>{
                  return   <li 
                       className="list-group-item row bg-light d-flex align-items-center file-list-item"
                       key={file.id}
                     >
                      <span className="col-2">
                      <FontAwesomeIcon icon={faMarkdown} title=""/>
                       </span>
                       <span className="col-7">
                           {file.title}
                       </span>
                       <button  type="button" className="icon-button col-1" >
                          <FontAwesomeIcon icon={faEdit} title="编辑"/>
                      </button>
                      <button  type="button" className="icon-button col-1">
                           <FontAwesomeIcon icon={faTrash} title="删除"/>
                      </button>
                     </li>
                 })
             }
        </ul>
    )
}

FilesList.propTypes = {

}
export default FilesList