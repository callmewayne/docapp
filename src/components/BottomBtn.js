import React,{useState,Fragment,useEffect,useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit,faTrash ,faTimes} from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
const  BottomBtn = ({text,colorClass,icon,onBtnclick})=>(
    <button
     type="button"
     className={`btn btn-block no-border ${colorClass}`}
     onClick={onBtnclick}
    >
          <FontAwesomeIcon 
            className="mr-2"
            size="lg"
            icon={icon}
          
          />
          {text}
    </button>
)
BottomBtn.propTypes = {
    text:PropTypes.string,
    colorClass:PropTypes.string,
    // icon:PropTypes.element.isRequired,
    onBtnclick:PropTypes.func
}
BottomBtn.defaultProps = {
    text:'新建'
}

export default BottomBtn