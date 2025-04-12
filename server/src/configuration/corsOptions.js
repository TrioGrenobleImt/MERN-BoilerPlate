// Configuration CORS
export const corsOptions = {
  origin: process.env.CORS_ORIGIN, // Origine autorisée
  credentials: true, // Autoriser les cookies
  methods: "GET, POST, PUT, PATCH, DELETE", // Méthodes autorisées
  preflightContinue: true, // Laisser passer les requêtes préalables
};
