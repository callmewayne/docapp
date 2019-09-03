import React ,{ useState ,Fragment,useEffect} from 'react'

const MouseTracker = ()=>{
    const [positions,setPositions] = useState({x:0,y:0})
    useEffect(()=>{
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
    return(
        <Fragment>
           <p>
               X:{positions.x},Y:{positions.y}
           </p>

        </Fragment>
    )
}

export default MouseTracker