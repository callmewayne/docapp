export const flattenArr = (arr) => {
    return arr.reduce((map, item) => {
        map[item.id] = item
        return map
    }, {})
}

export const objToArr = (obj) => {
    return Object.keys(obj).map(key => obj[key])
}

//查找是否含有此元素
export const getParentNode = (node, parentClassName) => {
    let current = node
    while (current !== null && current.classList.length!==0) {
        if (current.classList.contains(parentClassName)) {
            return current
        }
        current = current.parentNode
    }
    return false
}
export const timestampToString = (timestamp)=>{
    const date = new Date(timestamp)
    return date.toLocaleDateString()+ ' ' + date.toLocaleTimeString()
}