// 请求模块
const mongoose = require('mongoose')
// 创立链接
// mongoose.connect('mongodb://127.0.0.1:27017/express-auth', {
//     useCreateIndex: true,
//     useNewUrlParser: true
// })

mongoose.connect('mongodb://localhost:27017/express-auth', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB数据库连接成功')
    })
// 分离出数据格式
const UserSchema = new mongoose.Schema({
    // 属性,unique设置唯一
    username: { type: String, unique: true },
    password: {
        type: String,
        set(val) {
            // 密码散列和强度
            return require('bcrypt').hashSync(val, 10)
        }
    },
})
// 创建模型
const User = mongoose.model('User', UserSchema)
// 删除数据
// User.db.dropCollection('users')
// 导出模型
module.exports = { User }