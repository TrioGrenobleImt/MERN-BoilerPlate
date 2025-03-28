//CORS configuration
export const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: "GET, POST, PUT, PATCH, DELETE",
  preflightContinue: true,
};
