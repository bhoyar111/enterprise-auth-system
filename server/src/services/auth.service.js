import User from "../models/user.model.js";

export const registerService = async (data) => {
    const existingUser = await User.findOne({
        email: data.email,
    });

    if (existingUser) {
        throw new Error("User already exists.");
    }

    const user = await User.create(data);

    return user;
};

export const loginService = async (email, password) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password.");
    }

    return user;
};