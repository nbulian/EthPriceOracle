const Web3 = require('web3')
const { Client, NonceTxMiddleware, SignedTxMiddleware, LocalAddress, CryptoUtils, LoomProvider } = require('loom-js')

function loadAccount(key) {
    const extdevChainId = 'extdev-plasma-us1'
    const privateKey = CryptoUtils.B64ToUint8Array(key)
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const client = new Client(
        extdevChainId,
        'wss://extdev-plasma-us1.dappchains.com/websocket',
        'wss://extdev-plasma-us1.dappchains.com/queryws'
    )
    client.txMiddleware = [
        new NonceTxMiddleware(publicKey, client),
        new SignedTxMiddleware(privateKey)
    ]
    client.on('error', msg => {
        console.error('Connection error', msg)
    })
    return {
        ownerAddress: LocalAddress.fromPublicKey(publicKey).toString(),
        web3js: new Web3(new LoomProvider(client, privateKey)),
        client
    }
}

module.exports = {
    loadAccount,
};
