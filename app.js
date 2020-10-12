const 
    Koa = require('koa'),
    app = new Koa(),
    server = require('http').createServer(app.callback()),
    io = require('socket.io')(server)

let users = {}

server.listen(8081, () => {
    console.log('running')
})

io.on('connection', (socket) => {
    console.log('连接上了')
    // 注册
    socket.emit('connectIsOK', '连接上了')
    socket.on('register', (name)=>{
        let isNew = false
        // 判断当前有无重复名字
        if(!users[name]) {
            users[name] = name
            isNew = true
        }

        if(isNew) {
            // 把注册成功的用户名发送回去
            socket.emit('registerSuccess', name)
            // 向全部成员广播有新人加入
            io.emit('new', {name: name, code: 0})
        }else {
            socket.emit('registerFailure')
        }

    })
    // 接受到消息
    socket.on('sendMessage', (data) => {
        console.log(data)
        // 向全部人广播此条消息
        io.emit('receiveMessage', {name: data.name, message: data.message, time: data.time, code: 1})
    })
})