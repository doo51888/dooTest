  const fs = require('fs').promises;
     async function rmdirAsync (directoryPath) {
    try {
      let stat = await fs.stat(directoryPath)
      if (stat.isFile()) {
        await fs.unlink(directoryPath)
      } else {
        let dirs = await fs.readdir(directoryPath)
        // 递归删除文件夹内容(文件/文件夹)
      
        dirs = dirs.map(dir => rmdirAsync(path.join(directoryPath, dir)))
        await Promise.all(dirs)
        await fs.rmdir(directoryPath)
      }

    } catch (e) {
    
      console.error("1------------------------"+e);
    }
    // return new Promise((resolve,reject)=>{
        

    // })

  }
exports._deleteDir =  (directoryPath) => {

    require('fs').existsSync(directoryPath) &&   rmdirAsync(directoryPath);

}
  