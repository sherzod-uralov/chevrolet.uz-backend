import fs from 'fs'
import Path from 'path'

const readFile = (road:String) => {
    return fs.readFileSync(Path.resolve(process.cwd(),`${road}`),'utf-8');
}

export {readFile}
