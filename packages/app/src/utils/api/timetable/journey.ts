import * as cheerio from 'cheerio';
import { Journey, JourneyInformation, JourneyMessage, JourneyStop } from './types';

const baseUrl = 'https://reiseauskunft.bahn.de';

export const parseJourneys = (html: string): Journey[] => {
  const $ = cheerio.load(html);
  const journeyRows = $('.result [id^="journeyRow_"]');

  const journey = journeyRows
    .map((index, elm) => {
      const time = $(elm).find('.time').text().trim();
      const train = $(elm).find('.train:nth-child(3)').text().trim().replace(/\s+/, ' ');
      const trainDetailUrl = baseUrl + $(elm).find('.train:nth-child(3) a').attr('href') || '';
      const destination = $(elm).find('.route > .bold:first-child').text().trim();
      const stops = parseStops($(elm));
      const message = parseMessage($(elm));

      const platform = $(elm).find('.platform > strong').text().trim() || null;
      const actualTime = $(elm).find('.ris > .delay, .ris > .delayOnTime').text().trim() || null;
      const delayed = $(elm).find('.ris > .delay').text().trim() !== '';

      const information = $(elm)
        .find('.ris > .red')
        .map((index, elm) => {
          return $(elm).text().trim().replace(/\n+/g, ' ');
        })
        .get();

      const journey: Journey = {
        time,
        actualTime,
        delayed,
        train,
        trainDetailUrl,
        destination,
        stops,
        platform,
        message,
        information: extractinformation(information),
      };
      return journey;
    })
    .get();

  return journey;
};

const parseStops = ($row: cheerio.Cheerio<cheerio.Element>): JourneyStop[] => {
  return (
    $row
      .find('.route')
      .html()
      ?.trim()
      .replace(
        '<img src="https://www.img-bahn.de/s3/prod/v/img_old/sq_sep.gif" height="9" width="9" border="0" alt="">',
        '-'
      )
      .split(/(?:\n-\n|\n<br>\n)/)
      .slice(1)
      .map((row: string) => {
        const matches = row.match(/^(.+) \n(\d{1,2}:\d{2})/);
        const [, station, time] = matches || ['', '', ''];

        return {
          station: station.replace('(Halt entfällt)', '').trim(),
          time,
          noStop: station.includes('(Halt entfällt)'),
        };
      }) ?? []
  );
};

const parseMessage = ($row: cheerio.Cheerio<cheerio.Element>): JourneyMessage | null => {
  const title = $row.find('.route .himMessagesHigh .himMessage').text().trim() || null;

  if (!title) {
    return null;
  }

  const onClick = $row.find('.route .himMessagesHigh .arrowlink').attr('onclick');
  const onClickMatches = onClick?.match(/himMessagesAjaxRequest\('.+','(.+)',this\)/);
  const [, ajaxUrl] = onClickMatches || ['', ''];

  return {
    title,
    text: '',
    ajaxUrl: baseUrl + ajaxUrl,
  };
};

const extractinformation = (info: string[]): JourneyInformation => {
  return {
    canceled: info.includes('Fahrt fällt aus'),
    replaced: info.some((i) => i.match(/^Es verkehrt Ersatzfahrt\s/)),
    changedPlatform: info.includes('Gleiswechsel'),
    changedRoute: info.includes('Änderung im Fahrtverlauf!'),
    changedOrigin: info.some((i) => i.match(/^Fährt heute erst ab\s/)),
    changedDestination: info.some((i) => i.match(/^Fährt heute nur bis\s/)),
    specialTrain: info.includes('Sonderfahrt'),
    replacementTrain: info.some((i) => i.match(/^Ersatzfahrt für\s/)),
    others: info.filter((i) => {
      if (['Fahrt fällt aus', 'Gleiswechsel', 'Änderung im Fahrtverlauf!', 'Sonderfahrt'].includes(i)) {
        return false;
      }
      if (
        [/^Es verkehrt Ersatzfahrt\s/, /^Ersatzfahrt für\s/, /^Fährt heute erst ab\s/, /^Fährt heute nur bis\s/].some(
          (regexp) => i.match(regexp)
        )
      ) {
        return false;
      }
      return true;
    }),
  };
};

export const parseJourneyMessageText = (html: string): string => {
  const $ = cheerio.load(html);
  const text = $('span[class=""]').text().trim();
  return text;
};
