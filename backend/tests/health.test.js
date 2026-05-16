import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";

describe("Health Check & Basic Routes", () => {
  // After all tests are done, ensure we close the DB connection
  // if mongoose was connected during server initialization
  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it("should return a 404 for an unknown route", async () => {
    const res = await request(app).get("/api/unknown-route");
    expect(res.statusCode).toEqual(404);
  });
});
