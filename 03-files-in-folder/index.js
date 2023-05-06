const { readdir } = require('fs/promises')
const { stat } = require('fs')
const path = require('path')
const folderPath = path.join(__dirname, 'secret-folder')

async function getFileInfo() {
    try {
        const files = await readdir(folderPath, { withFileTypes: true })
        for (const file of files) {
            stat(path.join(folderPath, file.name), (err, stats) => {
                if (!file.isDirectory()) {
                    console.log(`${file.name.slice(0, file.name.indexOf('.'))} - ${path.extname(file.name).slice(1)} - ${stats.size}b`)
                }
            })
        }
    } catch (err) {
        console.error(err)
    }
}

getFileInfo()
