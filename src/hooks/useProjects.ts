"use client"
import { useState, useEffect } from 'react'
import { Project } from '@/types'

export function useProjects(cityName: string) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(`/api/projects/${cityName}`)
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        const data = await response.json()
        setProjects(data)
        setIsLoading(false)
      } catch (err:any) {
        setError(err.message)
        setIsLoading(false)
      }
    }

    cityName&&fetchProjects()
  }, [cityName])

  return { projects, isLoading, error }
}

