import jwt from "jsonwebtoken";


export const adminToken = (usrname?: string) => {
    return jwt.sign({ name: usrname }, process.env.jwt_string,{
        expiresIn: 86400000
    });
}

export const userToken = (id?): string => {
    return jwt.sign({ id: id}, process.env.jwt_string, {
        expiresIn: 86400000
    })
}