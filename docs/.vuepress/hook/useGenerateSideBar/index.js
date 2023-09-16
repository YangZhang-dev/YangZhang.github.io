import fs from "fs"
import path from "path"
export default () => {
    let folderPath = "./docs"
    let res = ge(folderPath).children
    // log(JSON.stringify(res))
    return res
}
// fullFileName 当前层级的路径
const ge = (fullFileName) => {
    try {
        const s = fs.statSync(fullFileName)
        let fos
        if(s.isDirectory()) {
            fos = allFile(fullFileName)
        }else {
            if(!fullFileName.includes(".md")) return null
            return fullFileName.replace("docs","").replace(".md","").replace(/\\/g,"/");
        }
        if(!fos) return null
        let cs = [];
        fos.map(fileName => {
            const stats = fs.statSync(fullFileName)
            let o
            if(stats.isDirectory()) {
                o = ge(fileName)
            }
            if(o != null && o != undefined && o != "") cs.push(o)
        })
        let ps = fullFileName.split("\\");
        let p = ps[ps.length - 1];
        let cur = {
            text: p,
            collapsible:true,
            children:cs,
        }
        return cur
      } catch (err) {
        console.error(err);
      }
}
const allFile = (folderPath) => {
    return fs.readdirSync(folderPath).
    filter(filename=>{
        return filename != ".vuepress" && filename != "README.md" 
    }).
    map(fileName =>{
        return path.join(folderPath, fileName)
    })
}
