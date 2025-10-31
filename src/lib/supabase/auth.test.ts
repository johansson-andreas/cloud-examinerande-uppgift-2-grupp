// Import the function we want to test. This function calls `supabase.auth.signUp`
// under the hood, so in the tests we will replace that client with a mock.
import { signUp } from "./auth";

// jest.mock replaces the actual module with a factory function that returns
// the mocked module. Here we replace '@/lib/supabase/client' with an object
// that has the same shape (a `supabase.auth.signUp` function), but where
// `signUp` is a jest mock function (jest.fn()). That prevents network calls
// during tests and lets us control what the mocked function returns.
jest.mock("./client", () => {
  return {
    supabase: {
      auth: {
        // jest.fn() creates a mock function we can configure per-test
        // (e.g. mockResolvedValue) and assert it was called with expected args.
        signUp: jest.fn(),
      },
    },
  };
});

// After calling jest.mock, we can import the mocked module to change its
// behavior in individual tests. This import gives us access to the same
// object that our code under test will receive.
import { supabase } from "./client";

describe("signUp", () => {
  const email = "test@example.com";
  const password = "secret123";

  beforeEach(() => {
    // Reset mock call counts and implementations between tests so tests
    // remain isolated and don't influence each other.
    jest.clearAllMocks();
  });

  it("returns data when Supabase signUp succeeds", async () => {
    // Configure the mocked signUp to resolve to a successful response.
    // mockResolvedValue makes the mock return a promise that resolves to
    // the provided value (simulating an async API call).
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: { id: "user_123", email } },
      error: null,
    });

    // Call the function under test. Because we've mocked the client, this
    // will use the mocked signUp implementation above instead of making a
    // real network request.
    const result = await signUp({ email, password });

    // Assert that the code called the supabase client's signUp with the
    // expected arguments and that the function returned the expected data.
    expect(supabase.auth.signUp).toHaveBeenCalledWith({ email, password });
    expect(result).toEqual({ user: { id: "user_123", email } });
  });

  it("throws when Supabase signUp returns an error", async () => {
    // Simulate an API response that indicates an error (e.g. email exists).
    const err = new Error("Email already registered");
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: null,
      error: err,
    });

    // The signUp function under test throws when the supabase client returns
    // an `error` property. Use `rejects.toThrow` to assert the promise rejects
    // with the expected message.
    await expect(signUp({ email, password })).rejects.toThrow(
      "Email already registered"
    );

    // Also assert that the mocked client was called with the expected args.
    expect(supabase.auth.signUp).toHaveBeenCalledWith({ email, password });
  });
});
