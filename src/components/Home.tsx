'use client'
import Link from 'next/link'
import React, { useState } from 'react'

const Home = () => {
  const [cityName, setCityName] = useState<string | undefined>()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Search Projects</h1>
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCityName(e.target.value)}
          type="text"
          placeholder="Enter city name"
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Link
          href={`/city/${cityName}`}
          className={`w-full block text-center py-3 rounded text-white font-medium ${
            cityName
              ? 'bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Search
        </Link>
      </div>
    </div>
  )
}

export default Home
