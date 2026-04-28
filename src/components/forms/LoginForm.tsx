import React from 'react';

const LoginForm = () => {
  return (
    <form className="login-form">
      <h2>Login</h2>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
