import jwt from "jsonwebtoken";

const sign = (data: object): string => {
    return jwt.sign(data, `${process.env.SECRET_KEY}`);
}

const verify = (token: string) => {
    try {
        return jwt.verify(token, `${process.env.SECRET_KEY}`);
    } catch (error) {
        console.error("Token verification error:", error);
        return null;
    }
}

export { sign, verify };
