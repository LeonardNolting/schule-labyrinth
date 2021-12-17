import * as cheerio from 'cheerio'
import fs from 'fs'

function leseOrdner(ordner) {
	fs.readdir(ordner, (fehler, dateiNamen) => {
		if (fehler) throw fehler
		dateiNamen.forEach(dateiName => leseDatei(`${ordner}/${dateiName}`))
	})
}

function leseDatei(name) {
	fs.readFile(name, (fehler, inhalt) => {
		if (fehler) throw fehler
		const dom = cheerio.load(inhalt)
		console.log(dom.html())
	})
}

leseOrdner("./input")