import * as cheerio from 'cheerio';
import { JourneyMeta } from './types';

export const parseMeta = (html: string): JourneyMeta => {
  const $ = cheerio.load(html);
  const $form = $('#sqQueryForm');

  const station = $form.find('[name="input"]').attr('value') || '';
  const stationId = ($form.find('[name="inputRef"]').attr('value') || '').split(/#0*/)[1];
  const date = $form.find('[name="date"]').attr('value') || '';
  const time = $form.find('[name="time"]').attr('value') || '';
  const type = $form.find('[name="boardType"]:checked').attr('value') || '';

  return {
    station,
    stationId,
    date,
    time,
    type,
  };
};
