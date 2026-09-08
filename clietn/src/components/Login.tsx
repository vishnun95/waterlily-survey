import { useState } from "react";

type LoginProps = {
  onLogin: (token: string) => void;
  onSignupClick: () => void;
};

function Login({ onLogin, onSignupClick }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Invalid email or password"
        );
      }

      localStorage.setItem("token", data.token);

      onLogin(data.token);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-decoration">
        <div className="decoration-circle circle-one" />
        <div className="decoration-circle circle-two" />
      </div>

      <div className="login-card">

        <div className="login-brand">
          <div className="brand-mark">W</div>
          <span>Waterlily</span>
        </div>

        <div className="login-heading">
          <span className="eyebrow">
            Welcome back
          </span>

          <h1>Ready to continue?</h1>

          <p>
            Sign in to continue your assessment.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <span>→</span>}
          </button>

        </form>
   

        <div className="demo-login">
          <span>Demo account</span>

          <strong>
            test@example.com
          </strong>

          <small>
            Password: password123
          </small>
        </div>

             <button
  type="button"
  className="signup-link"
  onClick={onSignupClick}
>
  Don't have an account?{" "}
  <strong>Sign up</strong>
</button>


      </div>
    </div>
  );
}

export default Login;