function request_to_myself(self) {
    const https = require('https')
    const options = {
        hostname: 'ntericeapp.herokuapp.com',
        port: 443,
        path: '/',
        method: 'GET'
    }
    https.request(options, (resp) => {
        console.log(resp.statusCode)
    }).end()
}

module.exports = {
    request_to_myself
};