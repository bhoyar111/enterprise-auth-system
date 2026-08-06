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