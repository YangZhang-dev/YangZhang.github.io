import fs from "fs";
import yaml from "js-yaml";
import path from "path";

export default () => {
    let folderPath = "./docs"
    let res = ge(folderPath).children
    // log(JSON.stringify(res))
    return res
}

const ge = (fullFileName) => {
    try {
        const s = fs.statSync(fullFileName)
        let fos
        if(s.isDirectory()) {
            fos = allFile(fullFileName)
        }else {
            if(!fullFileName.includes(".md")) return null
            return fullFileName.replace("docs","").replace(".md","").replaceAll(path.sep,"/");
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
        let ps = fullFileName.split(path.sep);
        let p = ps[ps.length - 1];
        cs = sort(cs)
        return {
            text: p,
            collapsible: true,
            children: cs,
        }
      } catch (err) {
        console.error(err);
      }
}
const sort = (fileList) => {
    let res = []
    fileList.map(fileName => {
        if(typeof fileName != "string") {
            res.push(fileName)
            return null
        }
    })
    res.push(...fileList.filter(fileName => {
        return typeof fileName == "string"
    }).sort((a,b) => {
        return getOrder(a) - getOrder(b)
    }))
    return res
}
const getOrder = (fileName) => {
    fileName = "./docs" + fileName + ".md"
    fileName = fileName.replaceAll("/",path.sep)
    const content = fs.readFileSync(fileName, 'utf8')
    let re = /---(.*?)---/sg
    let s = re.exec(content)[1]
    return yaml.load(s).order
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
