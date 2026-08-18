import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { registerService, loginService } from "../services/auth.service.js";

export const register = async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        const user = await registerService(validatedData);

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
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

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};