import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "test@gmail.com",
    password: "123456789"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // For displaying error messages

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
  };

  const onLogin = async (event) => {
    event.preventDefault();
    console.log("Login clicked", data); // 🔹 Debug log
    setLoading(true);
    setError("");

    try {
      const endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
      const response = await axios.post(`${url}${endpoint}`, data);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        setError(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name='name'
              type="text"
              placeholder='Your name'
              value={data.name}
              onChange={onChangeHandler}
              required
            />
          )}
          <input
            name='email'
            type="email"
            placeholder='Your email'
            value={data.email}
            onChange={onChangeHandler}
            required
          />
          <input
            name='password'
            type="password"
            placeholder='Password'
            value={data.password}
            onChange={onChangeHandler}
            required
          />
          {error && <p className="login-error">{error}</p>}
        </div>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p className='continuee'>By continuing, I agree to the terms of use & privacy policy</p>
        </div>

        <button type='submit' disabled={loading}>
          {loading ? "Please wait..." : (currState === "Sign Up" ? "Create Account" : "Login")}
        </button>

        <p>
          {currState === "Login" ? (
            <>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></>
          ) : (
            <>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;



