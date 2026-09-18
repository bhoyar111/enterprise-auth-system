import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { registerService, loginService } from "../services/auth.service.js";
import generateToken from "../utils/generateToken.js";

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
};

const publicUser = (user) => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
});

export const register = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        const user = await registerService(validatedData);

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: publicUser(user),
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        const user = await loginService(
            validatedData.email,
            validatedData.password
        );

        res.cookie("accessToken", generateToken(user), cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: publicUser(user),
        });
    } catch (error) {
        next(error);
    }
};

export const currentUser = (req, res) => {
    return res.status(200).json({
        success: true,
        data: publicUser(req.user),
    });
};

export const logout = (req, res) => {
    res.clearCookie("accessToken", cookieOptions);

    return res.status(200).json({
        success: true,
        message: "Logged out successfully.",
    });
};