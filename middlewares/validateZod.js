import { z } from "zod/v4";

const validateZod = (zodSchema) => (req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Content-Type:", req.get("Content-Type"));

  const { data, error } = zodSchema.safeParse(req.body);
  if (error) {
    console.log("Validation error:", error.errors);
    next(new Error(z.prettifyError(error), { cause: 400 }));
  } else {
    req.sanitizedBody = data;
    next();
  }
};

export default validateZod;
