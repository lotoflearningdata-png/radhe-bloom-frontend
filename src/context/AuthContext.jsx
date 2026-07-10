// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('rb_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('/api/auth/me')
        .then(r => setUser(r.data.user))
        .catch(() => {
          localStorage.removeItem('rb_token')
          delete axios.defaults.headers.common['Authorization']
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // Email + password login
  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    localStorage.setItem('rb_token', data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data
  }

  // Email + password register (no phone anymore)
  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password })
    localStorage.setItem('rb_token', data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data
  }

  // Google sign-in — called after backend verifies the Google credential
  const setUserFromGoogle = (token, userData) => {
    localStorage.setItem('rb_token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('rb_token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  // Update phone number (called at checkout)
  const updatePhone = async (phone) => {
    const { data } = await axios.put('/api/auth/profile', { phone, name: user?.name })
    setUser(data.user)
    return data.user
  }

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, setUserFromGoogle, updatePhone, setUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)