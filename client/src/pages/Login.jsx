import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import {
  SiteHeader,
  SiteFooter,
  CREATOR_NAME,
  CONTACT_EMAIL,
  SOCIAL_LINKS,
} from "../components/SiteChrome";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/login", { email, password });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    //   <form
    //     className="bg-white p-6 rounded shadow-md w-full max-w-sm"
    //     onSubmit={handleSubmit}
    //   >
    //     <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

    //     <input
    //       type="email"
    //       placeholder="Email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       className="w-full p-2 mb-4 border rounded"
    //       required
    //     />

    //     <input
    //       type="password"
    //       placeholder="Password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       className="w-full p-2 mb-4 border rounded"
    //       required
    //     />

    //     <button
    //       type="submit"
    //       className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
    //     >
    //       Login
    //     </button>

    //     <p className="text-center mt-4">
    //       Don't have an account?{' '}
    //       <Link to="/register" className="text-blue-600 hover:underline">
    //         Register
    //       </Link>
    //     </p>
    //   </form>
    // </div>
    <>
      <SiteHeader
        variant="auth"
        rightLink={{ to: "/register", label: "Register" }}
      />

      <main className="min-h-[70vh] flex items-center justify-center px-4 py-10 bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white border rounded-xl p-6"
        >
          <h1 className="text-xl font-semibold text-[#1E2A5A] mb-4">Sign in</h1>
          {/* email */}
          <label className="block text-sm text-gray-700">Email</label>
          <input
            className="input mt-1 mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* password */}
          <label className="block text-sm text-gray-700">Password</label>
          <input
            type="password"
            className="input mt-1 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-primary w-full" type="submit">
            Login
          </button>

          <p className="text-center mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#0052CC] underline">
              Register
            </Link>
          </p>
        </form>
      </main>

      <SiteFooter
        creatorName={CREATOR_NAME}
        contactEmail={CONTACT_EMAIL}
        socialLinks={SOCIAL_LINKS}
      />
    </>
  );
};

export default Login;
