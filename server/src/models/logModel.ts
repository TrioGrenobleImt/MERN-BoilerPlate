import { Schema, model, SchemaDefinition } from "mongoose";
import { ILog } from "../interfaces/ILog.ts";
import { logLevels } from "../utils/enums/logLevels.ts";

const allowedLogLevels = Object.values(logLevels);

// Crée un objet schema en respectant SchemaDefinition<ILog>
const logSchemaDefinition: SchemaDefinition<ILog> = {
  message: { type: String, required: true },
  level: {
    type: String,
    enum: allowedLogLevels,
    required: true,
    default: logLevels.INFO,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: false },
};

const LogSchema = new Schema<ILog>(logSchemaDefinition);

export const Log = model<ILog>("Log", LogSchema);
