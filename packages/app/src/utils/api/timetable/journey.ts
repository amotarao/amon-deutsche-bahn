import * as cheerio from 'cheerio';
import { Journey, JourneyInformation, JourneyMessage, JourneyStop, TrainType } from './types';

const baseUrl = 'https://reiseauskunft.bahn.de';

export const parseJourneys = (html: string, type: 'dep' | 'arr'): Journey[] => {
  const $ = cheerio.load(html);
  const $journeyRows = $('.result [id^="journeyRow_"]');

  const journey = $journeyRows
    .map((index, elm) => {
      const $elm = $(elm);
      const time = $elm.find('.time').text().trim();
      const trainType = parseTrainType($elm.find('.train:nth-child(2) img').attr('src') || '');
      const train = $elm.find('.train:nth-child(3)').text().trim().replace(/\s+/, ' ');
      const detailHref = parseDetailHref($elm.find('.train:nth-child(3) a').attr('href') || '');
      const originOrDestination = $elm.find('.route > .bold:first-child').text().trim();
      const stops = parseStops($elm);
      const message = parseMessage($elm);

      const platform = $elm.find('.platform > strong').text().trim() || null;
      const actualTime = $elm.find('.ris > .delay, .ris > .delayOnTime').text().trim() || null;
      const delayed = $elm.find('.ris > .delay').text().trim() !== '';

      const information = $elm
        .find('.ris > .red')
        .map((index, elm) => {
          const $elm = $(elm);
          return $elm.text().trim().replace(/\n+/g, ' ');
        })
        .get();

      const journey: Journey = {
        arrivalTime: type === 'arr' ? time : null,
        arrivalActualTime: type === 'arr' ? actualTime : null,
        departureTime: type === 'dep' ? time : null,
        departureActualTime: type === 'dep' ? actualTime : null,
        detailHref,
        delayed,
        trainType,
        train,
        origin: type === 'arr' ? originOrDestination : null,
        destination: type === 'dep' ? originOrDestination : null,
        stops,
        platform,
        message,
        information: extractInformation(information),
      };
      return journey;
    })
    .get();

  return journey;
};

const parseTrainType = (src: string): TrainType | null => {
  if (src.match(/ice/)) return 'ice';
  if (src.match(/ec_ic/)) return 'ic';
  if (src.match(/ir/)) return 'd';
  if (src.match(/re/)) return 'nv';
  if (src.match(/sbahn/)) return 's';
  if (src.match(/bus/)) return 'bus';
  // ToDo: 不明
  // if (src.match(/./)) return 'ferry';
  if (src.match(/ubahn/)) return 'u';
  if (src.match(/tram/)) return 'tram';
  // ToDo: 不明
  // if (src.match(/./)) return 'taxi';
  return null;
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

const extractInformation = (info: string[]): JourneyInformation => {
  return {
    canceled: info.includes('Fahrt fällt aus'),
    replaced: info.some((i) => i.match(/^Es verkehrt Ersatzfahrt\s/)),
    replacedTo:
      info.find((i) => i.match(/^Es verkehrt Ersatzfahrt\s/))?.replace(/^Es verkehrt Ersatzfahrt\s/, '') ?? null,
    changedPlatform: info.includes('Gleiswechsel'),
    changedRoute: info.includes('Änderung im Fahrtverlauf!'),
    changedOrigin: info.some((i) => i.match(/^Fährt heute erst ab\s/)),
    changedOriginTo: info.find((i) => i.match(/^Fährt heute erst ab\s/))?.replace(/^Fährt heute erst ab\s/, '') ?? null,
    changedDestination: info.some((i) => i.match(/^Fährt heute nur bis\s/)),
    changedDestinationTo:
      info.find((i) => i.match(/^Fährt heute nur bis\s/))?.replace(/^Fährt heute nur bis\s/, '') ?? null,
    specialTrain: info.includes('Sonderfahrt'),
    replacementTrain: info.some((i) => i.match(/^Ersatzfahrt für\s/)),
    replacementTrainFrom: info.find((i) => i.match(/^Ersatzfahrt für\s/))?.replace(/^Ersatzfahrt für\s/, '') ?? null,
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

const parseDetailHref = (href: string): string => {
  const url = new URL('https://example.com' + href);

  const pathname = url.pathname.replace(/^\/bin\/traininfo.exe\/dn\//, '');
  const [d, m, y] = url.searchParams.get('date')?.split('.') ?? ['', '', ''];

  const newUrl = new URL(`https://example.com/traininfo/routes/${pathname}`);
  newUrl.searchParams.set('date', `20${y}-${m}-${d}`);
  return newUrl.pathname + newUrl.search;
};

export const parseJourneyMessageText = (html: string): string => {
  const $ = cheerio.load(html);
  const text = $('span[class=""]').text().trim();
  return text;
};
