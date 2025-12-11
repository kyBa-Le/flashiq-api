import { User } from '@prisma/client'
import { prisma } from '../../utils/prisma'

export const getAllUsers = async () => {
    const users = await prisma.user.findMany()
    return users
}
export const findOneEmail = async (email: string): Promise<User | null> => {
    return prisma.user.findFirst({
        where: {
            email: email
        }
    })

}
export const createUser = async (user: any) => {
    const newUser = await prisma.user.create({
        data: {
            name: user.name,
            email: user.email,
            password: user.password
        }
    })
    return newUser
}