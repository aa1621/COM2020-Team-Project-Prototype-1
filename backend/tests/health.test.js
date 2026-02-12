import request from "supertest";
import app from "../src/app.js";

describe("Health endpoint", () => {
  test("GET /health returns status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
