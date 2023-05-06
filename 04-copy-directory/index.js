const { copyFile, mkdir, readdir, rm } = require('fs/promises')
const path = require('path')
const folderPath = path.join(__dirname, 'files')
const copyFolderPath = path.join(__dirname, 'files-copy')

async function copyFilesToFolder() {
    await rm(copyFolderPath, { recursive: true })
    await mkdir(copyFolderPath, { recursive: true })

    const files = await readdir(folderPath, { withFileTypes: true })
     
    for(const file of files){
        try {
            await copyFile(path.join(folderPath, file.name), path.join(copyFolderPath, file.name))
            console.log(`\u001B[32mФайл ${file.name} был скопирован в папку files-copy\u001B[0m`)
        } catch (error) {
            console.error(error)
        }
    }

}

copyFilesToFolder()
