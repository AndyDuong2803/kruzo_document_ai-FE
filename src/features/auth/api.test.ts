import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("Google authentication client", () => {
  it("posts the Google credential to the configured HTTPS endpoint", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.kruzoservice.com");
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: true,
      error_code: null,
      message: "Google login successful.",
      data: { access_token: "kruzo-jwt", token_type: "bearer" },
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);
    const { loginWithGoogleToken } = await import("./api");

    const result = await loginWithGoogleToken("google-credential", true);

    expect(result.access_token).toBe("kruzo-jwt");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.kruzoservice.com/api/v1/auth/google");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body as string)).toEqual({
      id_token: "google-credential",
      accept_legal_terms: true,
      terms_version: "2026-08-05",
      privacy_version: "2026-08-05",
    });
  });
});
