import React from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardOverview from '../../components/DashboardOverview'

const Home = () => {
  useUserAuth();
  return (

    <DashboardLayout activeMenu="dashboard">
      <div className='my-5'></div>
      <div className="px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
        <DashboardOverview />
      </div>
    </DashboardLayout>
  )
}

export default Home
