const { copyFile, mkdir, readdir, unlink } = require('fs/promises')
const path = require('path')
const folderPath = path.join(__dirname, 'files')
const copyFolderPath = path.join(__dirname, 'files-copy')

async function copyFilesToFolder() {
    await mkdir(copyFolderPath, { recursive: true })

    const copyFolder = await readdir(copyFolderPath, { withFileTypes: true })

    for(const file of copyFolder){
        try {
            await unlink(path.join(copyFolderPath, file.name))
        } catch (error) {
            console.log(error)
        }
    }

    const files = await readdir(folderPath, { withFileTypes: true })
    
    for(const file of files){
        try {
            await copyFile(path.join(folderPath, file.name), path.join(copyFolderPath, file.name))
            console.log(`\u001B[32mФайл ${file.name} был скопирован в папку files-copy\u001B[0m`)
        } catch (error) {
            console.log(error)
        }
    }

}

copyFilesToFolder()
