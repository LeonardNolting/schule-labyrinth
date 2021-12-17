import {JSDOM} from 'jsdom'
import fs      from 'fs'

function leseOrdner (ordner) {
	fs.readdir(ordner, (fehler, datei) => {
		if (fehler) throw fehler
		if (datei )
		datei.forEach(datei => leseDatei(ordner, datei))
	})
}

function leseDatei (ordner, datei) {
	JSDOM.fromFile(ordner + "/" + datei).then((dom) => {
		dom.window.document.head.innerHTML += "<style>body { background: red; }</style>"
		console.log(dom.serialize());
	})
}

leseOrdner("./input")