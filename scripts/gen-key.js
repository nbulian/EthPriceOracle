const { CryptoUtils } = require('loom-js')
const fs = require('fs')
const path = require('path')

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " <keyName>")
    process.exit(1);
}

const keyName = process.argv[2].toUpperCase() + '='
const rootDir = path.resolve('./')
const filePath = rootDir + '/' + '.env'
const privateKey = CryptoUtils.generatePrivateKey()
const privateKeyString = CryptoUtils.Uint8ArrayToB64(privateKey)

if (!fs.existsSync(filePath)) {
    fs.openSync(filePath, 'w')
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return console.log(err)

    let keyValue = keyName + privateKeyString;

    if (data.indexOf(keyName) >= 0) {

        let re = new RegExp('^.*' + keyName + '.*$', 'gm')
        keyValue = data.replace(re, keyValue)
        fs.writeFile(filePath, keyValue, 'utf8', (err) => {
            if (err) return console.log(err)
        })
    } else {

        keyValue = '\n' + keyValue
        fs.appendFile(filePath, keyValue, 'utf8', (err) => {
            if (err) return console.log(err)
        })
    }

    console.log('Done!')
})
