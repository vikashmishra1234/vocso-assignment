import { NextResponse } from 'next/server'
import { scrapeProjects } from '@/lib/scraper'
import { geocodeProjects } from '@/lib/geocoder'

export async function GET(
  request: Request,
  { params }: { params: { cityName: string } }
) {
  try {
    const projects = await scrapeProjects(params.cityName)
    const projectsWithCoordinates = await geocodeProjects(projects)
    return NextResponse.json(projectsWithCoordinates)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

