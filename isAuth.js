const jwt=require('jsonwebtoken')

module.exports = (req,res,next)=>{
    const authToken= req.get('Authorization')
    if(!authToken){
        req.isAuth=false
        return next()
    }
    const token = authToken.split(' ')[1]
    if(!token || token == ''){
        req.isAuth=false
        return next()
    }
    let decodedToken;
    try{
        decodedToken=jwt.verify(token,'somesecretkeyy')
    }catch(err){
        req.isAuth=false
        return next()
    }
    req.isAuth=true
    req.userId=decodedToken.userId
    next()
}
