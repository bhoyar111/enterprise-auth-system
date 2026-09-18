import { ZodError } from "zod";

const errorMiddleware = (error, req, res, next) => {
	if (error instanceof ZodError) {
		return res.status(400).json({
			success: false,
			message: "Validation failed.",
			errors: error.issues.map((issue) => ({
				field: issue.path.join("."),
				message: issue.message,
			})),
		});
	}

	if (error.code === 11000) {
		return res.status(409).json({
			success: false,
			message: "An account with this email already exists.",
		});
	}

	const statusCode = error.message === "User already exists." ? 409 : 400;

	return res.status(statusCode).json({
		success: false,
		message: error.message || "Something went wrong.",
	});
};

export default errorMiddleware;
