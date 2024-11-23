'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useProjects } from '@/hooks/useProjects'

// Custom icon for map markers
const customIcon = new L.Icon({
  iconUrl: '/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '/marker-shadow.png',
  shadowSize: [41, 41],
})

export default function Map({ cityName }: { cityName: string }) {
  const { projects, isLoading, error } = useProjects(cityName)
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (projects.length > 0 && projects[0].latitude && projects[0].longitude) {
      setMapCenter([projects[0].latitude, projects[0].longitude])
    }
  }, [projects])

  if (isLoading)
    return <div className="flex items-center justify-center h-full bg-gray-100">Loading map...</div>

  if (error)
    return (
      <div className="flex items-center justify-center h-full bg-red-100 text-red-500">
        Failed to load map
      </div>
    )

  if (!mapCenter)
    return (
      <div className="flex items-center justify-center h-full bg-yellow-100 text-yellow-700">
        No project locations found to display on the map.
      </div>
    )

  return (
    <MapContainer center={mapCenter} zoom={14} style={{ height: '100%', width: '100%' }} className="z-0">
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {projects.map((project) =>
        project.latitude && project.longitude ? (
          <Marker
            key={project.id}
            position={[project.latitude, project.longitude]}
            icon={customIcon}
          >
            <Popup className="custom-popup">
              <div className="font-sans">
                <h3 className="font-bold text-lg mb-2 text-blue-600">{project.name}</h3>
                <p className="text-gray-600 mb-1">{project.location}</p>
                <p className="text-gray-800 font-medium">{project.priceRange}</p>
                <p className="text-gray-700">Builder: </p>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  )
}
