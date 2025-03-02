import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../schemas/authSchema';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { ENDPOINTS } from '../config/api';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const authContext = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');

  // Password validation checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.post(ENDPOINTS.SIGNUP, {
        username: data.name,
        email: data.email,
        password: data.password
      });

      // Redirect to home page after successful registration
      if(response.status === 201){
        toast.success('Account created successfully!');
        authContext.login(
           response.data.token,
           response.data.user.username,
           response.data.user
        );
        navigate('/');
      }
      
    } catch (err) {
      console.error("Signup error:", err);
      handleSignupError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupError = (error) => {
    let errorMessage = 'An error occurred during registration.';
    
    if (error.response) {
      switch (error.response.status) {
        case 409:
          errorMessage = 'This email is already registered.';
          break;
        case 400:
          errorMessage = error.response.data.message || 'Invalid registration data.';
          break;
        default:
          errorMessage = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Check your internet connection.';
    }

    setError(errorMessage);
    toast.error(errorMessage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-headout-bg/20">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              {...register('name')}
              type="text"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-headout-purple"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-headout-purple"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-headout-purple"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            
            <div className="text-sm text-gray-600 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <div className={passwordChecks.length ? 'text-green-500' : 'text-red-500'}>
                  {passwordChecks.length ? '✓' : '✗'} 8+ characters
                </div>
                <div className={passwordChecks.uppercase ? 'text-green-500' : 'text-red-500'}>
                  {passwordChecks.uppercase ? '✓' : '✗'} Uppercase
                </div>
                <div className={passwordChecks.lowercase ? 'text-green-500' : 'text-red-500'}>
                  {passwordChecks.lowercase ? '✓' : '✗'} Lowercase
                </div>
                <div className={passwordChecks.number ? 'text-green-500' : 'text-red-500'}>
                  {passwordChecks.number ? '✓' : '✗'} Number
                </div>
                <div className={passwordChecks.specialChar ? 'text-green-500' : 'text-red-500'}>
                  {passwordChecks.specialChar ? '✓' : '✗'} Special char
                </div>
              </div>
            </div>
            
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isPasswordValid || loading}
            className={`w-full py-2 rounded-lg transition-all flex items-center justify-center ${
              isPasswordValid && !loading
                ? 'bg-headout-purple text-white hover:bg-headout-dark'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-headout-purple hover:underline"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}