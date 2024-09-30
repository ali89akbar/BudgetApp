import React, { useState } from 'react'
import './styles.css';
const Forget = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /* const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call API to send reset password link
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password reset link sent to your email');
        setError(null);
      } else {
        setError(data.error);
        setSuccess(null);
      }
    } catch (error) {
      setError('Failed to send password reset link');
      setSuccess(null);
    }
  }; */

  return (
    <div className="forgot-password-container">
    <h2>Forgot Password</h2>
    <form >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <button className='btns' type="submit">Send Reset Link</button>
    </form>
  </div>
  )
}

export default Forget
