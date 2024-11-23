import { Project } from '@/types'

export async function geocodeProjects(projects: Project[]): Promise<Project[]> {
  const apiKey = "728505ec6527607d7961d53b35465af2"
console.log(apiKey)
  const geocodedProjects = await Promise.all(
    projects.map(async (project) => {
      const response = await fetch(
        `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${encodeURIComponent(project.location)}`
      )
      const data = await response.json()

      if (data.data && data.data.length > 0) {
        return {
          ...project,
          latitude: data.data[0].latitude,
          longitude: data.data[0].longitude,
        }
      }

      return project
    })
  )

  return geocodedProjects
}

