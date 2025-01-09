"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/types";
import "leaflet/dist/leaflet.css";
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const MapComponent = ({ projects }: { projects: Project[] }) => {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      setL(L);
     
    });
  }, []);

  if (!L) return null;

  const customIcon = new L.Icon({
    iconUrl: "/marker-icon.png",
    iconSize: [15, 21],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <MapContainer
      center={[projects[0]?.latitude || 0, projects[0]?.longitude || 0]}
      zoom={1}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
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
                <h3 className="font-bold text-lg mb-2 text-blue-600">
                  {project.name}
                </h3>
                <p className="text-gray-600 mb-1">{project.location}</p>
                <p className="text-gray-800 font-medium">
                  {project.priceRange}
                </p>
                <p className="text-gray-700">Builder: </p>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default function Map({ cityName }: { cityName: string }) {
  const { projects } = useProjects(cityName);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        Loading map...
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="flex items-center justify-center h-full bg-yellow-100 text-yellow-700">
        No project locations found to display on the map.
      </div>
    );
  }

  if (!projects[0]?.latitude || !projects[0]?.longitude) {
    return (
      <div className="flex items-center justify-center h-full bg-yellow-100 text-yellow-700">
        Invalid location data for projects. (may happens because free api expires)
      </div>
    );
  }

  return <MapComponent projects={projects} />;
}
