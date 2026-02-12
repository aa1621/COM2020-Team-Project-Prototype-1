import { jest } from "@jest/globals";
import request from "supertest";

// Mock supabase BEFORE importing app.js
jest.unstable_mockModule("../src/lib/supabaseClient.js", () => {
  // Build a fake query chain:
  // supabaseAdmin.from().select().eq().eq().single()
  const fakeQuery = {
    select: () => fakeQuery,
    eq: () => fakeQuery,
    single: async () => {
      // Simulate "no rows" error Supabase gives when .single() finds nothing
      return { data: null, error: { code: "PGRST116" } };
    }
  };

  const supabaseAdmin = {
    from: () => fakeQuery
  };

  return {
    supabaseAdmin,
    supabaseUser: {} // not used in login
  };
});

// Now import app AFTER mocks are set
const { default: app } = await import("../src/app.js");

const LOGIN_PATH = "/auth/login";

describe("Login rejection tests", () => {
  test("rejects wrong password", async () => {
    const res = await request(app).post(LOGIN_PATH).send({
      username: "demouser",
      password: "wrongpassword"
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid credentials." });
  });

  test("rejects wrong username", async () => {
    const res = await request(app).post(LOGIN_PATH).send({
      username: "wronguser",
      password: "demopassword"
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid credentials." });
  });

  test("rejects missing username and password", async () => {
    const res = await request(app).post(LOGIN_PATH).send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Username and password are required." });
  });

  test("rejects SQL injection attempt", async () => {
    const res = await request(app).post(LOGIN_PATH).send({
      username: "demouser",
      password: "' OR '1'='1"
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid credentials." });
  });
});

