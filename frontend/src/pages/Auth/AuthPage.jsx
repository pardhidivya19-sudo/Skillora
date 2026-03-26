import React, { useState } from "react";
import "./AuthPage.css";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="auth-container">
      
      {/* LEFT SIDE */}
      <div className="auth-left">
        <div className="logo">
          <span>Skillora</span>
        </div>

        <div className="left-content">
          <h1>Expert services at your fingertips</h1>
          <p>
            Join 50,000+ customers who trust Skillora for their home and
            personal service needs.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">

        {!isSignup ? (
          <>
            <h2>Welcome back</h2>
            <p className="subtitle">
              Sign in to your account to continue
            </p>

            <div className="input-group">
              <input type="email" placeholder="Email address" />
            </div>

            <div className="input-group">
              <input type="password" placeholder="Password" />
            </div>

            <p className="forgot">Forgot password?</p>

            <button className="main-btn">
              Sign In →
            </button>

            <div className="divider">
              <span></span>
              <p>or continue with</p>
              <span></span>
            </div>

<div className="social-login">
  <button className="social-btn google">Google</button>
  <button className="social-btn apple">Apple</button>
</div>

            <p className="bottom-text">
              Don't have an account?
              <span onClick={() => setIsSignup(true)}> Sign up</span>
            </p>
          </>
        ) : (
          <>
            <h2>Create account</h2>
            <p className="subtitle">
              Start booking services today
            </p>

            <div className="input-group">
              <input type="text" placeholder="Full name" />
            </div>

            <div className="input-group">
              <input type="email" placeholder="Email address" />
            </div>

            <div className="input-group">
              <input type="password" placeholder="Password" />
            </div>

            <button className="main-btn">
              Create Account →
            </button>

            <div className="divider">
              <span></span>
              <p>or continue with</p>
              <span></span>
            </div>

<div className="social-login">
  <button className="social-btn google">Google</button>
  <button className="social-btn apple">Apple</button>
</div>

            <p className="bottom-text">
              Already have an account?
              <span onClick={() => setIsSignup(false)}> Sign in</span>
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default AuthPage;