import { Project } from '@/types'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold">{project.name}</h2>
      <p className="text-gray-600">{project.location}</p>
      <p className="text-gray-800">{project.priceRange}</p>
      <p className="text-gray-800">latitude: {project.latitude}</p>
      <p className="text-gray-800">longitude: {project.longitude}</p>
      <p className="text-gray-700">Builder: </p>
    </div>
  )
}

