'use client';

import ProjectCard from './ProjectCard';
import { useProjects } from '@/hooks/useProjects';

export default function ProjectList({ cityName }: { cityName: string }) {
 
  const {projects,isLoading,error} = useProjects(cityName)

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading && projects.length === 0 && (
        <div className="text-center py-4">Loading projects...</div>
      )}
      
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}

      {!isLoading && projects.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No projects found for {cityName}
        </div>
      )}
    </div>
  );
}