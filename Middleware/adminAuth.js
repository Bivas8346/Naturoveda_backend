const jwt = require('jsonwebtoken')
exports.jwAuth = (req,res,next)=>{
    if(req.cookies && req.cookies.userToken) {
        jwt.verify(req.cookies.userToken,process.env.JWT_SECRET_KEY,(err, data)=>{
            req.user = data
            next()
        })
    }else{
        next()
    }
}