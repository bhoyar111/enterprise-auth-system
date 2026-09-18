import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const bearerToken = authHeader?.startsWith("Bearer ")
			? authHeader.slice(7)
			: null;
		const token = req.cookies.accessToken || bearerToken;

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Authentication required.",
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User no longer exists.",
			});
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Invalid or expired authentication token.",
		});
	}
};

export default authMiddleware;
