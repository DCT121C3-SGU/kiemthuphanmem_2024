import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    const { token }  = req.headers

    if (!token) {
        return res.status(401).json({ success: false, message: 'Xác thực tài khoản thất bại' })
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export default authUser