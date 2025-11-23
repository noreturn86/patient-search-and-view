import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProvider } from '../features/auth/authSlice.js';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigateToRegister = () => {
    navigate('/register');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8080/api/login-provider', form, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.data.token && res.data.provider) {
        // Dispatch provider to Redux store
        dispatch(setProvider({ provider: res.data.provider, token: res.data.token }));
        navigate('/dashboard');
      } else {
        setError('Login failed: Invalid credentials');
      }
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <form
        onSubmit={handleSubmit}
        className="bg-blue-500 p-10 rounded-xl shadow-lg max-w-md w-full space-y-6 border-2 border-blue-700"
      >
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">Provider Login</h2>

        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors duration-200"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <hr className="border-gray-300" />

        <button
          type="button"
          onClick={navigateToRegister}
          className="w-full bg-blue-200 hover:bg-blue-100 text-blue-800 font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          Create Account
        </button>

        {error && (
          <p className="mt-4 text-red-600 text-center font-medium">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
