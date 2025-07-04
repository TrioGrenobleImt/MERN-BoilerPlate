import mongoose from "mongoose";
import { describe, beforeAll, afterAll, expect, test } from "vitest";
import "dotenv/config";
import { User } from "../../../src/models/userModel.js";
import { Log } from "../../../src/models/logModel.js";

describe("TEST fullname generation", () => {
  test("should handle lowercase forename correctly", () => {
    const user = new User({ name: "MARTIN", forename: "pierre" });

    expect(user.fullname).toBe("MARTIN Pierre");
  });

  test("should handle already formatted forename correctly", () => {
    const user = new User({ name: "LAMBERT", forename: "Élodie" });

    expect(user.fullname).toBe("LAMBERT Élodie");
  });

  test("should handle uppercase forename", () => {
    const user = new User({ name: "GIRAUD", forename: "ALAIN" });

    expect(user.fullname).toBe("GIRAUD Alain");
  });
});
