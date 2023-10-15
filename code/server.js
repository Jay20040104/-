const { User } = require('./models')

const express = require('express')

const app = express()
const jwt = require('jsonwebtoken')
const SECRET = 'jayxisnkkjwiiqosaddasdssa'
app.use(express.json())

// 拿到用户数据
app.get('/api/users', async (req, res) => {
    const users = await User.find()
    res.send(users)
})

// 注册
app.post('/api/register', async (req, res) => {
    console.log(req.body)
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
    })
    res.send(user)
    // res.send('register')
})

// 登录
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    // 没有接收到数据时，中断程序并返回错误提示
    if (!user) {
        return res.status(422).send({
            message: '用户名不存在'
        })
    }
    // 比对密码
    const isPassswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if (!isPassswordValid) {
        return res.status(422).send({
            message: '密码无效'
        })
    }
    // 生成token
    // const jwt = require('jsonwebtoken')
    const token = jwt.sign({
        // 字符串格式化
        id: String(user._id),
        // 密钥，要保密，不能出现在代码里面
    }, SECRET)
    res.send({
        user,
        token
    })
})

const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop()
    const { id } = jwt.verify(raw, SECRET)
    req.user = await User.findById(id)
    next()
}

app.get('/api/profile', auth,async (req, res) => {
    console.log(String(req.headers.authorization).split(' ').pop())
    // const raw = String(req.headers.authorization).split(' ').pop()
    // const {id}= jwt.verify(raw,SECRET)
    // req.user = await User.findById(id)
    return res.send(req.user)
})

app.listen(3001, () => {
    console.log('http://localhost:3001')
})