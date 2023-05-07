const { createReadStream, appendFile, writeFile } = require('fs')
const { readdir, readFile, unlink, mkdir, copyFile } = require('fs/promises')
const path = require('path')
const htmlPath = path.join(__dirname, 'template.html')
const assetsPath = path.join(__dirname, 'project-dist', 'assets')
const componentsPath = path.join(__dirname, 'components')
const stylePath = path.join(__dirname, 'styles')
const newFolderPath = path.join(__dirname, 'project-dist')
const newAssetsPath = path.join(__dirname, 'assets')
const newHtmlPath = path.join(__dirname, 'project-dist', 'index.html')
const newCssPath = path.join(__dirname, 'project-dist', 'style.css')

async function margeHtml(htmlCopy) {
    try {
        const htmlComponents = await readdir(componentsPath, { withFileTypes: true })
        for (const file of htmlComponents) {
            if (path.extname(file.name) === '.html') {
                try {
                    const component = await readFile(path.join(componentsPath, file.name), { encoding: 'utf-8' })
                    const HTMLtag = file.name.replace(path.extname(file.name), '')
                    htmlCopy = htmlCopy.replace(`{{${HTMLtag}}}`, component)

                    writeFile(newHtmlPath, 
                        htmlCopy,
                        (error) => {
                            if (error) return console.log(error.message)
                        })
                } catch (error) {
                    console.log(error.message)
                }
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

async function copyHTML() {
    await mkdir(newFolderPath, { recursive: true })

    let chunks = []
    const stream = createReadStream(htmlPath, 'utf-8')
    stream.on('readable', () => {
        let chunk
        while (null !== (chunk = stream.read())) {
            chunks.push(chunk)
        }
    })
    stream.on('end', () => {
        margeHtml(chunks.join('\n'))
    })
    stream.on('error', (error) => console.log(error.message))
}

copyHTML()

async function margeCSS() {
    try {
        const files = await readdir(stylePath, { withFileTypes: true })
        for (const file of files) {
            if (path.extname(file.name) === '.css') {
                let chunks = []
                const stream = createReadStream(path.join(stylePath, file.name), 'utf-8')
                stream.on('readable', () => {
                    let chunk
                    while (null !== (chunk = stream.read())) {
                        chunks.push(chunk)
                    }
                })
                stream.on('end', () => {
                    writeFile(
                    newCssPath,
                    '',
                    (error) => {
                        if (error) return console.log(error.message)
                    }
                    )
                    appendFile(
                        newCssPath, 
                        chunks.join('\n'), 
                        (error) => {
                            if (error) return console.log(error.message)
                        }
                    )
                })
                stream.on('error', (error) => console.log(error.message))
            }
        }
    } catch (error) {
        console.error(error.message)
    }
}

margeCSS()

async function copyFilesToFolder(from, to) {
    await mkdir(to, { recursive: true })

    const copyFolder = await readdir(to, { withFileTypes: true })

    for(const file of copyFolder){
        try {
            await unlink(path.join(to, file.name))
        } catch (error) {
            console.log(error.message)
        }
    }

    const files = await readdir(from, { withFileTypes: true })
    
    for(const file of files){
        try {
            if (file.isDirectory()) {
                copyFilesToFolder(path.join(from, file.name), path.join(to, file.name))
            } 
            else {
                copyFile(path.join(from, file.name),path.join(to, file.name))
            }
        } catch (error) {
            console.log(error.message)
        }
    }

}

copyFilesToFolder(newAssetsPath ,assetsPath)
