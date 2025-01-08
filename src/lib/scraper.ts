import * as cheerio from 'cheerio';
import axios from 'axios';
import { Project } from '@/types';

export async function* scrapeProjects(cityName: string): AsyncGenerator<Project> {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    };

    const url = `https://www.magicbricks.com/new-projects-${encodeURIComponent(cityName)}`;
    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);

    // console.log('Total project cards found:', $('.projdis__prjcard').length);

    $('.projdis__prjcard').each((index, element) => {
      const $element = $(element);
      
      const name = $element.find('.mghome__prjblk__prjname').text().trim();
      const location = $element.find('.mghome__prjblk__locname').text().trim();
      const priceRange = $element.find('.mghome__prjblk__price').text().trim();
      
      const latitude = parseFloat($element.attr('data-latitude') || '0');
      const longitude = parseFloat($element.attr('data-longitude') || '0');

      if (name && location && priceRange) {
        
        return {
          id: index.toString(),
          name,
          location,
          priceRange,
          latitude,
          longitude,
        };
      }
    }).get(); 

    const projects = $('.projdis__prjcard').map((index, element) => {
      const $element = $(element);
      
      const name = $element.find('.mghome__prjblk__prjname').text().trim();
      const location = $element.find('.mghome__prjblk__locname').text().trim();
      const priceRange = $element.find('.mghome__prjblk__price').text().trim();
      
      const latitude = parseFloat($element.attr('data-latitude') || '0');
      const longitude = parseFloat($element.attr('data-longitude') || '0');

      if (name && location && priceRange) {
        return {
          id: index.toString(),
          name,
          location,
          priceRange,
          latitude,
          longitude,
        };
      }
      return null;
    }).get().filter(project => project !== null);

    for (const project of projects) {
      yield project;
    }

  } catch (error:any) {
    console.error('Error scraping projects:', error);
    throw new Error(`Failed to scrape projects for ${cityName}: ${error.message}`);
  }
}

