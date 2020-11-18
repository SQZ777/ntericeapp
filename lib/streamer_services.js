const MongoDB = require('./mongodb')

async function get_streamer(streammer_name) {
    return await MongoDB.findOneData({
        name: streammer_name
    })
}

async function update_streamer_notify_time(streamer_name, notify_time = new Date) {
    return await MongoDB.updateData({
        name: streamer_name
    }, {
        $set: {
            notify_time: notify_time
        }
    })
}

async function update_streamer_status(streamer_name, status) {
    return await MongoDB.updateData({
        name: streamer_name
    }, {
        $set: {
            status: status
        }
    })
}

async function update_streamer_close_time(streamer_name, close_time = new Date) {
    return await MongoDB.updateData({
        name: streamer_name
    }, {
        $set: {
            close_time: close_time
        }
    })
}


// async function go() {
//     var x = await get_streamer('AttackFromTaiwan')
//     console.log(Math.abs(x.notify_time - x.close_time) / 1000 / 60)
// }
// go()

module.exports = {
    get_streamer,
    update_streamer_status,
    update_streamer_notify_time,
    update_streamer_close_time
}