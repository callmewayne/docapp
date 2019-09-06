import React,{useState,Fragment,useEffect,useRef} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch,faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'
const FileSearch = ({title,onFileSearch})=>{
   const [ inputActive,setInputActive] = useState(false)
   const [value,setValue] = useState('')
   //利用自定义hook监听按键事件
   const enterPressed = useKeyPress(13)
   const escPressed = useKeyPress(27)


   const closeSearch = ()=>{
    setInputActive(false)
    setValue('')
    onFileSearch('')
   }
   let node = useRef(null)
   useEffect(()=>{
       //响应键盘事件
      if(enterPressed && inputActive){
        onFileSearch(value)
      }
      if(escPressed && inputActive){
        closeSearch()
      }


   
   })

  return(
      <div className="alert alert-primary mb-0">
        {!inputActive && 
           <div className="d-flex justify-content-between align-items-center ">
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
            <div className="d-flex justify-content-between align-items-center ">
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

