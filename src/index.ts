import {JSDOM} from 'jsdom'
import {readdirSync, readFileSync, statSync} from 'fs'
import * as path from "path"

interface Struktur {
	dateien: string[]
	stylesheets: string[]
	ordner: {[name: string]: Struktur}
}

interface StrukturFertig {
	[pfad: string]: string | StrukturFertig
}

const ladeStruktur = (ordner: string) => readdirSync(ordner).reduce<Struktur>((struktur, item) => {
	const stats = statSync(path.resolve(ordner, item))
	if (stats.isDirectory()) struktur.ordner[item] = ladeStruktur(path.resolve(ordner, item))
	else if (stats.isFile()) {
		const dateiEndung = path.extname(item).toLowerCase()
		if (dateiEndung === "css") struktur.stylesheets.push(item)
		else if (dateiEndung === "html") struktur.dateien.push(item)
	}
	return struktur
}, {dateien: [], stylesheets: [], ordner: {}});

function baueDatei(pfad: string, stylesheets: string[]): string {
	/*JSDOM.fromFile(ordner + "/" + datei).then((dom) => {
		dom.window.document.head.innerHTML += "<style>body { background: red; }</style>"
		console.log(dom.serialize());
	})*/
	return ""
}

 function baueStylesheet(pfad: string): string {
	return readFileSync(pfad).toString()
 }

function baueStrukturFertig(ordner: string, struktur: Struktur, stylesheets: string[] = []): StrukturFertig {
	const generiert: StrukturFertig = {}
	stylesheets.push(...struktur.stylesheets.map(stylesheet => baueStylesheet(path.resolve(ordner, stylesheet))))
	struktur.dateien.forEach(datei => {
		generiert[datei] = baueDatei(path.resolve(ordner, datei), stylesheets);
	});
	Object.entries(struktur.ordner).forEach(([kindOrdner, kindStruktur]) => {
		generiert[kindOrdner] = baueStrukturFertig(path.resolve(ordner, kindOrdner), kindStruktur, [...stylesheets])
	})
	return generiert
}

function bauen(input: string, output: string) {
	const struktur = ladeStruktur(input)
	baueStrukturFertig(".", struktur)
}

bauen("./input", "./output")