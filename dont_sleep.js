const { request_to_myself } = require('./lib/request_myself')
const request_myself =  require('./lib/request_myself')

setInterval(()=>{
    request_myself.request_to_myself()
},600000)