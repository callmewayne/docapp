import React ,{ useState ,Fragment,useEffect} from 'react'
import axios from 'axios'
const DogShow = ()=>{
    const [ url,setUrl] = useState('')
    const [ loading,setLoding ] = useState(false)
    const [fetch,setFetch] = useState(false)
    useEffect(()=>{
setLoding(true)
axios.get('https://dog.ceo/api/breeds/image/random').then(res=>{
    console.log(res)
    setUrl(res.data.message)
    setLoding(false)
})
    },[fetch])

    return (
       <Fragment>

           {loading?<p>读取中</p>
           :
           <img src={url}  width="200" height="150"/>}
           <button onClick={()=>{setFetch(!fetch)}}>
               在看一张图片
           </button>
       </Fragment>
    )
}

export default DogShow