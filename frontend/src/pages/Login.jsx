import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
   const navigate = useNavigate();

  const [data, setData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post("/auth/login", data);
    login(res.data);

    // 🔥 redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <>
      <style>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f3f4f6;
        }

        .auth-form {
          width: 100%;
          max-width: 380px;
          background: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .auth-form h2 {
          text-align: center;
          margin-bottom: 25px;
          color: #1f2937;
        }

        .auth-form input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 14px;
          outline: none;
        }

        .auth-form input:focus {
          border-color: #4f46e5;
        }

        .auth-form button {
          width: 100%;
          padding: 12px;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .auth-form button:hover {
          background-color: #4338ca;
        }

        .auth-footer {
          text-align: center;
          margin-top: 15px;
          font-size: 14px;
        }

        .auth-footer a {
          color: #4f46e5;
          font-weight: 600;
          text-decoration: none;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setData({ ...data, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setData({ ...data, password: e.target.value })
            }
            required
          />

          <button type="submit">Login</button>

          <div className="auth-footer">
            Don’t have an account?{" "}
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </>
  );
}
