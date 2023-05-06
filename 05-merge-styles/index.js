const { createReadStream, appendFile, writeFile } = require('fs')
const { readdir } = require('fs/promises')
const path = require('path')

const cssPath = path.join(__dirname, 'styles')
const mergeCssPath = path.join(__dirname, 'project-dist', 'bundle.css')

async function mergeCSS() {
    try {
        const files = await readdir(cssPath, { withFileTypes: true })
        for (const file of files) {
            if (path.extname(file.name) === '.css') {
                const stream = createReadStream(path.join(cssPath, file.name), 'utf-8')
                let chunks = []
                stream.on('readable', () => {
                    let chunk
                    while (null !== (chunk = stream.read())) {
                        chunks.push(chunk)
                    }
                })
                stream.on('end', () => {
                    writeFile(
                        mergeCssPath, 
                        '', 
                        (err) => {
                            if (err) return console.log(err)
                        }
                    )
                    appendFile(
                        mergeCssPath, 
                        chunks.join('\n'), 
                        (err) => {
                            if (err) return console.log(err)
                        }
                    )
                })
                stream.on('error', (err) => console.log(err))
            }
        }
    } catch (err) {
        console.error(err)
    }
}

mergeCSS()