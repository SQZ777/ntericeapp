function go(client) {
    client.channels.cache.get("776035789108543528").send('in test!');
    client.channels.cache.get("776035789108543528").send('in test haha');
    console.log('in go')
}

module.exports = {
    go
}