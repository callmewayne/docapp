import React,{useState,useEffect,useRef} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch,faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'

const FileSearch = ({title,onFileSearch})=>{
   const [ inputActive,setInputActive] = useState(false)
   const [value,setValue] = useState('')
   const closeSearch = (event)=>{
    event.preventDefault()
    setInputActive(false)
    setValue('')
   }
   let node = useRef(null)
   useEffect(()=>{
       //响应键盘事件
       const handleInputEvent = (event)=>{
           const { keyCode } = event
           if(keyCode === 13 && inputActive){
            onFileSearch(value)
           }else if(keyCode === 27 && inputActive){
            closeSearch(event)
           }
       }
       document.addEventListener('keyup',handleInputEvent)
       return ()=>{
           document.removeEventListener('keyup',handleInputEvent)
       }
   })
   useEffect(()=>{
       //响应聚焦事件
       if(inputActive){
        node.current.focus()
       }
   },[inputActive])
  return(
      <div className="alert alert-primary">
        {!inputActive && 
           <div className="d-flex justify-content-between align-items-center">
               <span>
                   {title}
                </span>
                   <button  type="button" className="icon-button" onClick={()=>setInputActive(true)}>
                      <FontAwesomeIcon icon={faSearch} title="搜索"/>
                   </button>
              
           </div>
        }
        {
            inputActive && 
            <div className="d-flex justify-content-between align-items-center">
                <input className="form-control " ref={node} value={value} onChange={(e)=>{setValue(e.target.value)}} />
                    <button  type="button" className="icon-button " onClick={closeSearch}>
                      <FontAwesomeIcon icon={faTimes} title="关闭"/>
                    </button>
            </div>
              
        }
      </div>
  )
}

//属性检查
FileSearch.propTypes = {
    title:PropTypes.string,
    onFileSearch:PropTypes.func.isRequired
}
//默认属性
FileSearch.defaultProps = {
    title:"我的云文档"
}


export default FileSearch

