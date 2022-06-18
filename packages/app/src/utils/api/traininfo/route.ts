import * as cheerio from 'cheerio';
import { Route, StationInformation } from '../traininfo/types';

export const parseRoute = (html: string): Route => {
  const $ = cheerio.load(html);
  const $routeRows = $('#trainroute .tqRow[class*="trainrow_"]');

  const route = $routeRows
    .map((index, elm) => {
      const $elm = $(elm);
      $elm.find('.tqContentHL, .risHL').each((i, elm) => {
        $(elm).remove();
      });
      const name = $elm.find('.station').text().trim();
      const arrival =
        $elm
          .find('.arrival')
          .text()
          .trim()
          .replace(/^an /, '')
          .replace(/\nan \d{2}:\d{2}$/, '') || null;
      const arrivalActualTime =
        $elm.find('.arrival .delay, .arrival .delayOnTime').text().trim().replace(/^an /, '') || null;
      const arrivalDelayed = $elm.find('.arrival .delay').text().trim() !== '';
      const departure =
        $elm
          .find('.departure')
          .text()
          .trim()
          .replace(/^ab /, '')
          .replace(/\nab \d{2}:\d{2}$/, '') || null;
      const departureActualTime =
        $elm.find('.departure .delay, .departure .delayOnTime').text().trim().replace(/^ab /, '') || null;
      const departureDelayed = $elm.find('.departure .delay').text().trim() !== '';
      const platform = $elm.find('.platform').text().trim();
      const information = $elm
        .find('.ris')
        .text()
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i);

      return {
        name,
        arrival,
        arrivalActualTime,
        arrivalDelayed,
        departure,
        departureActualTime,
        departureDelayed,
        platform,
        information: extractInformation(information),
      };
    })
    .get();

  return route;
};

const extractInformation = (information: string[]): StationInformation => {
  return {
    changedPlatform: information.includes('Gleiswechsel'),
    noStop: information.includes('Halt entfällt'),
    extraStop: information.includes('"(zusätzlicher Halt)"'),
    message: information.filter((i) => !['Gleiswechsel', 'Halt entfällt', '(zusätzlicher Halt)'].includes(i)),
  };
};
