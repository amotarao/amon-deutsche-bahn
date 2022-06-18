import * as cheerio from 'cheerio';

export const parseIdSelect = (html: string): string[] => {
  const $ = cheerio.load(html);
  const $errormsg = $('.errormsg');

  if ($errormsg.text().trim() !== 'Ihre Eingabe ist nicht eindeutig. Bitte wählen Sie oben aus der Liste.') {
    return [];
  }

  const ids = $('select.error option')
    .map((index, el) => {
      return $(el).attr('value');
    })
    .get();
  return ids;
};
