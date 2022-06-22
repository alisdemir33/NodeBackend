const jwt =require('jsonwebtoken');

module.exports = (req,res,next) =>{

    const authHeader =req.get('Authorization');
    if(!authHeader){
        const error = new Error('Token is invalid:Auth Header Not Found')
        error.statusCode=401;
        throw error;
    }
    let decodedToken;
    const token =req.get('Authorization').split(' ')[1];
    try {
        decodedToken = jwt.verify(token,'somespersecretkey');

    } catch (error) {
       error.statusCode=500;
       throw error;
    }
    if(!decodedToken){
        const error = new Error('Token is invalid:token not verified')
        error.statusCode=401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
}