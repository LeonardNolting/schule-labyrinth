import * as cheerio from 'cheerio';

const $ = cheerio.load("<ul id=\"fruits\">\n" +
	"  <li class=\"apple\">Apple</li>\n" +
	"  <li class=\"orange\">Orange</li>\n" +
	"  <li class=\"pear\">Pear</li>\n" +
	"</ul>");

console.log($.html())