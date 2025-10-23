import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
   console.log("Token in isAuthenticated middleware:", req);
        if (!token) {
        return res.status(401).json({
            message: `Token not found. Request cookies: ${JSON.stringify(req.cookies)}, headers: ${JSON.stringify(req.headers)}`,
            success: false
        });
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        }

        req.id =decode.userId;
        next();
        
    }

    catch (error) {
        console.log(error);
    }
}

export default isAuthenticated;