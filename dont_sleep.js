const { request_to_myself } = require('./lib/request_myself')

setInterval(()=>{
    request_to_myself()
},600000)