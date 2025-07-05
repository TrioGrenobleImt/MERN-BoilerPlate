import { describe, it, expect, vitest } from "vitest";
import "dotenv/config";
import request from "supertest";
import { User } from "../../../src/models/userModel.js";
import { generateAccessToken } from "../../../src/utils/generateAccessToken.js";
import { adminUser } from "../../fixtures/users.js";

//Import server and app
import { app } from "../../../src/app.js";
import { Config } from "../../../src/models/configModel.js";
import { IUser } from "../../../src/interfaces/IUser.js";

describe("GET /api/config", () => {
  it("should return a 200 success status and the list of the config", async () => {
    const user: IUser = await User.create(adminUser);
    const res = await request(app)
      .get("/api/config")
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`)
      .send();
    expect(res.status).toBe(200);
    expect(res.body.config.length).toBe(0);
  });

  it("should return a 200 success status and the list of the config", async () => {
    const user: IUser = await User.create(adminUser);
    await Config.create({
      key: "key1",
      value: "value1",
    });
    const res = await request(app)
      .get("/api/config?keys=key1")
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.config[0].value).toBe("value1");
    expect(res.body.config[0].key).toBe("key1");
  });

  it("should return a 500 status if an error occurs", async () => {
    const user: IUser = await User.create(adminUser);

    vitest.spyOn(Config, "find").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .get(`/api/config?keys=${["key1", "key2"].join(",")}`)
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});

describe("PUT /api/config", () => {
  it("should return a 200 success status and update the config", async () => {
    const user: IUser = await User.create(adminUser);
    await Config.create({
      key: "key1",
      value: "value1",
    });

    const res = await request(app)
      .put("/api/config")
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`)
      .send({
        keys: ["key1"],
        config: {
          key1: "newValue",
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("config_updated");
  });

  it("should return a 400 error if the keys are not in the config object", async () => {
    const user: IUser = await User.create(adminUser);
    await Config.create({
      key: "key1",
      value: "value1",
    });

    const res = await request(app)
      .put("/api/config")
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`)
      .send({
        keys: ["key2"],
        config: {
          key1: "newValue",
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("config_not_found");
  });

  it("should return a 400 error if the format is invalid", async () => {
    const user: IUser = await User.create(adminUser);
    await Config.create({
      key: "key1",
      value: "value1",
    });

    const res = await request(app)
      .put("/api/config")
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`)
      .send({
        keys: "key2",
        config: {
          key1: "newValue",
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("invalid_config");
  });

  it("should return a 400 error if the format is invalid", async () => {
    const user: IUser = await User.create(adminUser);
    await Config.create({
      key: "key1",
      value: "value1",
    });

    const res = await request(app)
      .put("/api/config")
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`)
      .send({
        keys: ["key2"],
        config: "test",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("invalid_config");
  });

  it("should return a 400 error if the format is invalid", async () => {
    const user: IUser = await User.create(adminUser);
    await Config.create({
      key: "key1",
      value: "value1",
    });

    const res = await request(app)
      .put("/api/config")
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`)
      .send({
        keys: ["key2"],
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("invalid_config");
  });

  it("should return a 500 status if an error occurs", async () => {
    const user: IUser = await User.create(adminUser);
    await Config.create({
      key: "key1",
      value: "value1",
    });

    vitest.spyOn(Config, "findOneAndUpdate").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const response = await request(app)
      .put("/api/config")
      .set("Authorization", `Bearer ${generateAccessToken(user._id)}`)
      .send({
        keys: ["key1"],
        config: {
          key1: "newValue",
        },
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Test error");
  });
});
