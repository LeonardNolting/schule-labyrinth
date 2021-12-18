import {JSDOM}       from 'jsdom'
import {readdirSync} from 'fs'
import path          from "path"

const ladeStruktur = ordner => readdirSync(ordner).reduce((struktur, item) => {
	if (item.isDirectory()) struktur.ordner.push(item)
	else {
		const dateiEndung = path.extname(item).toLowerCase()
		if (dateiEndung === "css") struktur.stylesheets.push(item)
		else if (dateiEndung === "html") struktur.dateien.push(ladeStruktur(path.resolve(ordner, item)))
	}
}, {dateien: [], stylesheets: [], ordner: []});

function verarbeiteStruktur(struktur) {

}

// function erstelleDatei(pfad, stylesheets)

function leseDatei (ordner, datei) {
	JSDOM.fromFile(ordner + "/" + datei).then((dom) => {
		dom.window.document.head.innerHTML += "<style>body { background: red; }</style>"
		console.log(dom.serialize());
	})
}

ladeStruktur("./input")