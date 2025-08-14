import React, { useState, useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/inputs/input'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { validateEmail } from '../../utils/helper'
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector'
import axiosInstance from '../../utils/axioInstance'
import { API_PATHS } from '../../utils/apiPaths'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { updateUser } = useContext(UserContext)

  const handleProfilePhotoSelect = (file) => {
    setProfilePhoto(file)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (!formData.username) {
      setError('Username is required')
      setLoading(false)
      return
    }

    if (!formData.fullname) {
      setError('Full name is required')
      setLoading(false)
      return
    }

    if (!validateEmail(formData.email)) {
      setError('Invalid email address')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // Prepare form data for API
      const signupData = {
        username: formData.username,
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      }

      // Add profile photo if provided
      if (profilePhoto) {
        const formDataWithPhoto = new FormData()
        formDataWithPhoto.append('username', formData.username)
        formDataWithPhoto.append('fullname', formData.fullname)
        formDataWithPhoto.append('email', formData.email)
        formDataWithPhoto.append('password', formData.password)
        formDataWithPhoto.append('confirmPassword', formData.confirmPassword)
        formDataWithPhoto.append('profileImage', profilePhoto)

        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formDataWithPhoto, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const { token, user } = response.data
        if (token) {
          localStorage.setItem('token', token)
          updateUser(user)
          navigate('/dashboard')
        }
      } else {
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, signupData)
        const { token, user } = response.data

        if (token) {
          localStorage.setItem('token', token)
          updateUser(user)
          navigate('/dashboard')
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else if (error.response?.data?.error) {
        setError(error.response.data.error)
      } else {
        setError('An error occurred during registration. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Username, Fullname and ProfilePhotoSelector horizontal */}
          <div className="w-24">
              <ProfilePhotoSelector
                onImageSelect={handleProfilePhotoSelect}
                label="Photo"
                optional={true}
              />
            </div>
          <div className="flex items-center space-x-4">
          
            <div className="flex-1">
              <Input
                type="text"
                name="username"
                label="Username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <Input
                type="text"
                name="fullname"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullname}
                onChange={handleChange}
                helperText="Your full name as it appears on your ID"
                required
              />
            </div>
            
          </div>

          {/* Remaining fields below */}
          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Signup
