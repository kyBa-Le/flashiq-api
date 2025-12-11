import { createUser, findOneEmail } from "../services/user.service";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET
const generateToken = (user: any) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };
    const options = {
        expiresIn: '1h'
    };
    return jwt.sign(payload, secret, options);
}

export const register = async(req: any, res:any, next:any) =>{
    try {
        const {name, email, password} = req.body;
        const user = await findOneEmail(email);
        if(user){
            return res.status(400).json({message: 'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            name,
            email,
            password: hashedPassword
        }
        const createdUser = await createUser(newUser);
        if(!createdUser){
            return res.status(400).json({message: 'User not created'});
        }
        res.status(201).json({
            message: 'User created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }   
}

export const login = async(req: any, res: any, next: any) => {
    try {
        const {email, password} = req.body;
    const user = await findOneEmail(email);
    if(!user){
        return res.status(400).json({
            code: 9999,
            message: "User not found"
        })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({
            code: 9999,
            message: "Password is incorrect"
        })
    }
    const token = generateToken(user);
    res.status(200).json({
        code: 1000,
        message: "Login successful",
        token: token
    })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            code: 9999,
            message: "Internal server error"
        })
    }
}