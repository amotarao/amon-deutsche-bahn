import * as cheerio from 'cheerio';
import { TimetableData } from './types';

export const parseData = (html: string): Omit<TimetableData, 'journeyItems' | 'ids'> => {
  const $ = cheerio.load(html);
  const $form = $('#sqQueryForm');

  const name = $form.find('[name="input"]').attr('value') || '';
  const id = $form.find('[name="inputRef"]').attr('value') || '';
  const date = $form.find('[name="date"]').attr('value') || '';
  const time = $form.find('[name="time"]').attr('value') || '';
  const type = $form.find('[name="boardType"]:checked').attr('value') || '';

  return {
    name,
    id,
    date,
    time,
    type,
  };
};
