import * as cheerio from 'cheerio';
import axios from 'axios';
import { Project } from '@/types';

export async function scrapeProjects(cityName: string): Promise<Project[]> {
  const url = `https://www.magicbricks.com/new-projects-${cityName}`;

  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const projects: Project[] = [];

  $('.projdis__prjcard').each((index, element) => {
    const name = $(element).find('.mghome__prjblk__prjname').text().trim();
    const location = $(element).find('.mghome__prjblk__locname').text().trim();
    const priceRange = $(element).find('.mghome__prjblk__price').text().trim();
    // const builderName = $(element).find('.builder-name').text().trim();
    const latitude = parseFloat($(element).attr('data-latitude') || '0');
    const longitude = parseFloat($(element).attr('data-longitude') || '0');

   
    if (name && location && priceRange) {
      projects.push({
        id: index.toString(),
        name,
        location,
        priceRange,
        latitude,
        longitude,
      });
    }
  });

  return projects;
}
