"use server";

import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeExample = async () => {
  try {
    const { data } = await axios.get("https://books.toscrape.com/", {
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    const items: any[] = [];

    $(".product_pod").each((_, el) => {
      const name = $(el).find("h3 a").attr("title");
      const price = $(el).find(".price_color").text();

      items.push({
        name,
        tesco: parseFloat(price.replace("£", "")) || 0,
        sainsburys: parseFloat(price.replace("£", "")) || 0,
      });
    });

    return items;
  } catch (error) {
    console.log("SCRAPER ERROR:", error);

    return [
      {
        name: "Scraper failed (network blocked)",
        price: "0",
      },
    ];
  }
};