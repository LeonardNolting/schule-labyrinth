import {JSDOM}       from 'jsdom'
import {readdirSync, statSync} from 'fs'
import * as path          from "path"

interface Struktur {
	dateien: string[]
	stylesheets: string[]
	ordner: {[name: string]: Struktur}
}

const ladeStruktur = ordner => readdirSync(ordner).reduce<Struktur>((struktur, item) => {
	const stats = statSync(path.resolve(ordner, item))
	if (stats.isDirectory()) struktur.ordner[item] = ladeStruktur(path.resolve(ordner, item))
	else if (stats.isFile()) {
		const dateiEndung = path.extname(item).toLowerCase()
		if (dateiEndung === "css") struktur.stylesheets.push(item)
		else if (dateiEndung === "html") struktur.dateien.push(item)
	}
	return struktur
}, {dateien: [], stylesheets: [], ordner: {}});

function verarbeiteStruktur(struktur: Struktur) {

}

// function erstelleDatei(pfad, stylesheets)

function leseDatei (ordner, datei) {
	JSDOM.fromFile(ordner + "/" + datei).then((dom) => {
		dom.window.document.head.innerHTML += "<style>body { background: red; }</style>"
		console.log(dom.serialize());
	})
}

ladeStruktur("./input")