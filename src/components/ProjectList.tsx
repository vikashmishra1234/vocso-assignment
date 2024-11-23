'use client'
import { useProjects } from '@/hooks/useProjects'
import ProjectCard from './ProjectCard'
import Loading from './Loading'

export default function ProjectList({ cityName }: { cityName: string }) {
  const { projects,isLoading, error } = useProjects(cityName)

  if (error) return <div>Error: {error}</div>
  if(isLoading) return <Loading/>
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

