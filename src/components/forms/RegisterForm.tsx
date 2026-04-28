import React from 'react';

const RegisterForm = () => {
  return (
    <form className="register-form">
      <h2>Register</h2>
      <input type="text" placeholder="Full Name" required />
      <input type="email" placeholder="Campus Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default RegisterForm;
