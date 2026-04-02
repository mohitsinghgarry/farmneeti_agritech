import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { UserRole } from '../../types';

interface LoginFormData {
  email: string;
  password: string;
  role: UserRole;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      role: 'farmer',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password, data.role);
      addToast({
        title: 'Login Successful',
        message: `Welcome back!`,
        type: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Login Failed',
        message: 'Invalid credentials. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'farmer', label: 'Farmer', icon: '🌾' },
    { value: 'warehouse', label: 'Warehouse Operator', icon: '🏭' },
    { value: 'buyer', label: 'Buyer', icon: '🛒' },
    { value: 'admin', label: 'Administrator', icon: '🛡️' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-700 to-green-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Leaf className="w-10 h-10" />
              <div>
                <h1 className="text-3xl font-extrabold">AgriLink Ledger</h1>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-extrabold mb-4">
                Smart Agricultural Storage & Marketplace Platform
              </h2>
              <p className="text-lg text-white/70">
                Empowering farmers with data-driven decisions
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold">1,250+</div>
                <div className="text-sm text-white/70">Farmers Connected</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold">₹12Cr+</div>
                <div className="text-sm text-white/70">Transactions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold">34</div>
                <div className="text-sm text-white/70">Warehouses Online</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2">Sign in to your AgriLink account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email format',
                    },
                  })}
                  type="email"
                  placeholder="farmer@agrilink.com"
                  className={`w-full h-11 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 1,
                      message: 'Password is required',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`w-full h-11 pl-10 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1.5">{errors.password.message}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Login As
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((option) => (
                  <label
                    key={option.value}
                    className="relative flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:border-green-300"
                  >
                    <input
                      {...register('role', { required: 'Please select a role' })}
                      type="radio"
                      value={option.value}
                      className="sr-only peer"
                    />
                    <div className="peer-checked:border-green-600 peer-checked:bg-green-50 absolute inset-0 border-2 rounded-lg transition-all" />
                    <span className="relative text-2xl">{option.icon}</span>
                    <span className="relative text-sm font-medium text-gray-700 peer-checked:text-green-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1.5">{errors.role.message}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Demo Credentials */}
            <details className="mt-6">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                Demo Credentials
              </summary>
              <div className="mt-3 p-4 bg-gray-50 rounded-lg text-xs space-y-2">
                <div><strong>Farmer:</strong> farmer@test.com</div>
                <div><strong>Warehouse:</strong> warehouse@test.com</div>
                <div><strong>Buyer:</strong> buyer@test.com</div>
                <div><strong>Admin:</strong> admin@test.com</div>
                <div className="text-gray-500 mt-2">Password: any</div>
              </div>
            </details>

            <p className="text-center text-sm text-gray-400 mt-6">
              Don't have an account? Contact administrator
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
