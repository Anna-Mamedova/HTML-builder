const fs = require('fs')
const path = require('path')
const readline = require('readline')
const filePath = path.join(__dirname, 'newTxt.txt')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

function updateFile(path, value) {
    fs.writeFile(
        path,
        value,
        (err) => {
            if (err) return console.log(err.message)
        }
    )
}

rl.question('\u001B[32m Введите текст \n\u001B[0m', (value) => {
    rl.on('line', (input) => {
        if (input === 'exit') {
            rl.close()
        }
    })

    updateFile(filePath, value)

    rl.on('history', (history) => {
        const text = [...history].reverse().join('\n')
        updateFile(filePath, text)
    })
})

rl.on('close', () => {
    console.log('\u001B[36m Спасибо за текст :) \u001B[0m')
})
