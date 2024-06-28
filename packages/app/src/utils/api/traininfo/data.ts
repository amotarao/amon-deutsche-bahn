import * as cheerio from "cheerio";
import type { TrainInfoData } from "./types";

export const parseData = (html: string): Omit<TrainInfoData, "route"> => {
  const $ = cheerio.load(html);

  const train =
    $("h1")
      .text()
      .replace(/^Fahrtinformationen zu /, "")
      .replace(/\s+/g, " ") || "";
  const validFrom = $("h3.trainroute")
    .text()
    .replace(/Wagenreihung/, "")
    .trim();
  const information = $(".tqRemarks")
    .text()
    .split("\n\n")
    .map((t) => t.trim())
    .filter((t) => t !== "" && t !== "Hinweise");
  const remark = $(".himMessagesMiddle div, .himMessagesHigh div")
    .map((index, el) => {
      const $el = $(el);
      const title = $el.find("span.bold").text().trim();
      const text = $el.find('span[class=""]').text().trim();
      return {
        title,
        text,
      };
    })
    .get();

  return {
    train,
    validFrom,
    information,
    remark,
  };
};
