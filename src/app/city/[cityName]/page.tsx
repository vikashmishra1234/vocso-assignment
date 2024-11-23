import ProjectList from '@/components/ProjectList'
import Map from '@/components/Map'

export default function CityPage({ params }: { params: { cityName: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Showing Data for city {params.cityName}</h1>
      </header>
      <main className="flex-grow flex">
        <div className="w-1/2 p-4 overflow-y-auto">
       
            <ProjectList cityName={params.cityName} />
         
        </div>
        <div className="w-1/2">
          <Map cityName={params.cityName} />
        </div>
      </main>
    </div>
  )
}

