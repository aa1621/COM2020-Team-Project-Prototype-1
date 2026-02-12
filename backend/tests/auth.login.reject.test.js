import request from "supertest";
import { jest } from "@jest/globals";

// ---- Mock Supabase (so tests do NOT hit the real network) ----
const mockSingle = jest.fn();

const mockEq2 = jest.fn(() => ({ single: mockSingle }));
const mockEq1 = jest.fn(() => ({ eq: mockEq2 }));
const mockSelect = jest.fn(() => ({ eq: mockEq1 }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

jest.unstable_mockModule("../src/lib/supabaseClient.js", () => {
  return {
    supabaseAdmin: { from: mockFrom },
    // app imports this too in some places, so keep it defined
    supabaseUser: {}
  };
});

// Import app AFTER mocking (important)
const { default: app } = await import("../src/app.js");

const LOGIN_PATH = "/auth/login";

beforeEach(() => {
  mockSingle.mockReset();
  mockFrom.mockClear();
  mockSelect.mockClear();
  mockEq1.mockClear();
  mockEq2.mockClear();
});

describe("Auth login tests", () => {
  test("rejects wrong password", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "PGRST116" } // your controller treats this as invalid credentials
    });

    const res = await request(app).post(LOGIN_PATH).send({
      username: "demouser",
      password: "wrongpassword"
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid credentials." });
  });

  test("rejects wrong username", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "PGRST116" }
    });

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
    mockSingle.mockResolvedValue({
      data: null,
      error: { code: "PGRST116" }
    });

    const res = await request(app).post(LOGIN_PATH).send({
      username: "demouser",
      password: "' OR '1'='1"
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid credentials." });
  });

  test("logs in successfully with correct credentials", async () => {
    const mockUser = {
      user_id: 1,
      username: "demouser",
      display_name: "Demo User",
      role: "user",
      group_id: 1
    };

    mockSingle.mockResolvedValue({
      data: mockUser,
      error: null
    });

    const res = await request(app).post(LOGIN_PATH).send({
      username: "demouser",
      password: "demopassword"
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: mockUser });
  });
});


