import { useState } from 'react'
import axios from 'axios'

const Login = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const response = await axios.post(`http://localhost:8080${endpoint}`, {
        username,
        password,
      })
      setMessage(response.data)
      if (response.data === 'Login successful') {
        // Navigate to game or something, but for now just message
      }
    } catch (error: any) {
      setMessage(error.response?.data || 'Error occurred')
    }
  }

  return (
    <div className="min-h-screen gradient-cinematic flex flex-col items-center justify-center relative overflow-hidden">
      {/* Cinematic background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 filter brightness-50 contrast-150 blur-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}></div>
        {/* Dramatic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>
        {/* Spotlight effect */}
        <div className="absolute inset-0 gradient-spotlight"></div>
      </div>

      {/* Atmospheric fog particles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900 rounded-full blur-3xl opacity-20 atmospheric-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-600 rounded-full blur-3xl opacity-15 atmospheric-pulse animation-delay-2000"></div>

      {/* Ornate decorative elements */}
      <div className="absolute top-20 left-20 w-40 h-40 border-2 border-gold-aged rounded-full opacity-30 atmospheric-pulse flicker"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 border border-crimson rounded-full opacity-25 atmospheric-pulse animation-delay-1000"></div>

      {/* Side lighting effects */}
      <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-black via-transparent to-transparent opacity-60"></div>
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-red-900 via-transparent to-transparent opacity-40"></div>

      {/* Floating spectral elements */}
      <div className="absolute top-1/3 right-1/6 w-2 h-2 bg-spectral-accent rounded-full flicker opacity-60"></div>
      <div className="absolute bottom-1/3 left-1/6 w-1 h-1 bg-yellow-400 rounded-full atmospheric-pulse opacity-40"></div>

      <div className="relative z-10 glassmorphism-dark border-ornate rounded-2xl p-10 w-full max-w-md shadow-volumetric clip-gothic overflow-hidden ring-1 ring-yellow-500/20">
        {/* Background texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-900/10 to-transparent"></div>
        <div className="relative z-10">
          <h2 className="gothic-title text-3xl mb-8 text-center text-yellow-500 drop-shadow-lg">
            {isRegister ? 'Create Account' : 'Enter the Realm'}
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-8"></div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wider" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow-lg appearance-none border-2 border-gray-600 rounded-2xl w-full py-4 px-5 text-gray-100 leading-tight focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/40 bg-gray-700 text-lg transition duration-300 ring-1 ring-transparent hover:ring-2 hover:ring-red-500/20"
                required
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border border-gray-600 rounded-2xl w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:border-red-500 bg-gray-700 ring-1 ring-transparent hover:ring-2 hover:ring-red-500/20 transition duration-300"
                required
              />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-10 rounded-2xl text-xl uppercase tracking-wider transition duration-300 shadow-lg hover:shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 hover:rotate-1 hover:brightness-110 ring-1 ring-red-600/20 hover:ring-2 ring-red-600/40"
              >
                {isRegister ? 'Register' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-gray-400 hover:text-red-400 font-bold text-sm uppercase tracking-wider transition duration-300"
              >
                {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
              </button>
            </div>
          </form>
          {message && <p className="mt-6 text-center text-red-400 font-bold">{message}</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-gray-500 text-sm">
        NeverLucky Card Game - Enter at your own risk
      </div>
    </div>
  )
}

export default Login
