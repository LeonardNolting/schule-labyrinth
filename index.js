import {JSDOM} from 'jsdom'
import fs      from 'fs'

function leseOrdner (ordner) {
	fs.readdir(ordner, (fehler, dateiNamen) => {
		if (fehler) throw fehler
		dateiNamen.forEach(dateiName => leseDatei(`${ordner}/${dateiName}`))
	})
}

function leseDatei (name) {
	JSDOM.fromFile(name).then((jsdom) => console.log(jsdom.serialize()))
}

leseOrdner("./input")