const jwt = require('jsonwebtoken');

export const verifyToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Truy cập bị từ chối. Token không hợp lệ.' })
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'Truy cập bị từ chối. Token không hợp lệ.' })
    }
}