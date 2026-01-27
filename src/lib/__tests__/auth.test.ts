import { test, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("jose", () => ({
  SignJWT: vi.fn(),
  jwtVerify: vi.fn(),
}));

import { getSession, deleteSession, verifySession } from "@/lib/auth";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const mockCookies = cookies as ReturnType<typeof vi.fn>;
const mockJwtVerify = jwtVerify as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

test("getSession returns null when no token cookie exists", async () => {
  mockCookies.mockResolvedValue({
    get: vi.fn().mockReturnValue(undefined),
  });

  const session = await getSession();

  expect(session).toBeNull();
  expect(mockJwtVerify).not.toHaveBeenCalled();
});

test("getSession returns session payload when valid token exists", async () => {
  const mockPayload = {
    userId: "user-123",
    email: "test@example.com",
    expiresAt: new Date("2025-01-01"),
  };

  mockCookies.mockResolvedValue({
    get: vi.fn().mockReturnValue({ value: "valid-token" }),
  });
  mockJwtVerify.mockResolvedValue({ payload: mockPayload });

  const session = await getSession();

  expect(session).toEqual(mockPayload);
  expect(mockJwtVerify).toHaveBeenCalledTimes(1);
  expect(mockJwtVerify.mock.calls[0][0]).toBe("valid-token");
});

test("getSession returns null when jwtVerify throws an error", async () => {
  mockCookies.mockResolvedValue({
    get: vi.fn().mockReturnValue({ value: "invalid-token" }),
  });
  mockJwtVerify.mockRejectedValue(new Error("Invalid token"));

  const session = await getSession();

  expect(session).toBeNull();
});

test("getSession returns null when cookie value is empty string", async () => {
  mockCookies.mockResolvedValue({
    get: vi.fn().mockReturnValue({ value: "" }),
  });

  const session = await getSession();

  expect(session).toBeNull();
  expect(mockJwtVerify).not.toHaveBeenCalled();
});

test("deleteSession deletes the auth cookie", async () => {
  const mockDelete = vi.fn();
  mockCookies.mockResolvedValue({
    delete: mockDelete,
  });

  await deleteSession();

  expect(mockCookies).toHaveBeenCalled();
  expect(mockDelete).toHaveBeenCalledWith("auth-token");
});

test("verifySession returns null when no token cookie exists in request", async () => {
  const mockRequest = {
    cookies: {
      get: vi.fn().mockReturnValue(undefined),
    },
  };

  const session = await verifySession(mockRequest as never);

  expect(session).toBeNull();
  expect(mockJwtVerify).not.toHaveBeenCalled();
});

test("verifySession returns session payload when valid token exists", async () => {
  const mockPayload = {
    userId: "user-456",
    email: "verify@example.com",
    expiresAt: new Date("2025-06-01"),
  };

  const mockRequest = {
    cookies: {
      get: vi.fn().mockReturnValue({ value: "valid-request-token" }),
    },
  };

  mockJwtVerify.mockResolvedValue({ payload: mockPayload });

  const session = await verifySession(mockRequest as never);

  expect(session).toEqual(mockPayload);
  expect(mockJwtVerify).toHaveBeenCalledTimes(1);
  expect(mockJwtVerify.mock.calls[0][0]).toBe("valid-request-token");
});

test("verifySession returns null when jwtVerify throws an error", async () => {
  const mockRequest = {
    cookies: {
      get: vi.fn().mockReturnValue({ value: "invalid-token" }),
    },
  };

  mockJwtVerify.mockRejectedValue(new Error("Invalid token"));

  const session = await verifySession(mockRequest as never);

  expect(session).toBeNull();
});
