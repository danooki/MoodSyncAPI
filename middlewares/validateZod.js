import { z } from "zod";

const validateZod = (zodSchema) => (req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Content-Type:", req.get("Content-Type"));

  const { data, error } = zodSchema.safeParse(req.body);
  if (error) {
    console.log("Validation error:", error.errors);
    const errorMessage = error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    next(new Error(errorMessage, { cause: 400 }));
  } else {
    req.sanitizedBody = data;
    next();
  }
};

export default validateZod;
