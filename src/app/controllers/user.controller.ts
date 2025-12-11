import * as userSer from '../services/user.service'

export const getUser = async (req: any, res: any) => {
    const user = await userSer.getAllUsers()
    res.status(200).json(user)
}