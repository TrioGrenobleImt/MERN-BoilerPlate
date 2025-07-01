import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN || "", // assure une string même vide
  credentials: true,
  methods: "GET, POST, PUT, PATCH, DELETE",
  preflightContinue: true,
};
