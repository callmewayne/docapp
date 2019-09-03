import React ,{ useState ,Fragment,useEffect} from 'react'

const LikeButton = ()=>{
    //初始state的值
    const [like,setLike] = useState(0)
    const [ obj,setObj ] = useState({like:0,on:true})
    //无需清除副作用
    useEffect(()=>{
        document.title = `点击了${obj.like}次`
    })
    return (
        <Fragment>
        <button onClick={()=>{setObj({like:obj.like+1,on:obj.on})}}>
            {obj.like}
        </button>
          <button onClick={()=>{setObj({on:!obj.on,like:obj.like})}}>
            {obj.on?'on':'off'}
        </button>
        </Fragment>
    )
}
export default LikeButton