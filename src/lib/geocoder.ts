import { Project } from '@/types'

export async function geocodeProjects(project: Project): Promise<Project> {
  const apiKey = "162085c8136fa717acbaaf0326c6713c"
 
   
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
 
  

}

