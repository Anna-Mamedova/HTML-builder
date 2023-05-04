const path = require('path')
const fs = require('fs')

const filePath = path.join(__dirname, 'text.txt')
const stream = fs.createReadStream(filePath, 'utf-8')

const chunks = []

stream.on('readable', () => {
  let chunk
  while (null !== (chunk = stream.read())) {
    chunks.push(chunk)
  }
})

stream.on('end', () => {
  const content = chunks.join('')
  console.log(content)
})
