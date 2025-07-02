import { model, Schema } from "mongoose";
import { ILog } from "../interfaces/ILog.js";
import { logLevels } from "../utils/enums/logLevels.js";

const allowedLogLevels = Object.values(logLevels);

// Crée un objet schema en respectant SchemaDefinition<ILog>
const logSchema = new Schema<ILog>(
  {
    message: { type: String, required: true },
    level: {
      type: String,
      enum: allowedLogLevels,
      required: true,
      default: logLevels.INFO,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true },
);

export const Log = model<ILog>("Log", logSchema);
