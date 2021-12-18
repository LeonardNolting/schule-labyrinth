import {JSDOM} from 'jsdom'
import {readdirSync, readFileSync, statSync} from 'fs'
import * as path from "path"

const baueOrdner = (ordner: string): { dateien: string[], stylesheets: string[], ordner: string[] } => {
	const struktur = {dateien: [], stylesheets: [], ordner: []}
	readdirSync(ordner).forEach(item => {
		const pfad = path.join(ordner, item)
		const stats = statSync(pfad)
		if (stats.isDirectory()) struktur.ordner.push(item)
		else if (stats.isFile()) {
			const dateiEndung = path.extname(item).toLowerCase().slice(1)
			if (dateiEndung === "css") struktur.stylesheets.push(item)
			else if (dateiEndung === "html") struktur.dateien.push(item)
		}
	})
	return struktur
};

async function baueDatei(pfad: string, stylesheets: string[]): Promise<string> {
	const dom = await JSDOM.fromFile(pfad)
	stylesheets.forEach(stylesheet => dom.window.document.head.innerHTML += `<style>${stylesheet}</style>`)
	return dom.serialize()
}

const baueStylesheet = (pfad: string) => readFileSync(pfad).toString();

const dateien = async (ordner: string, stylesheets: string[]): Promise<{ [pfad: string]: string }> => {
	const ordnerAnalyse = baueOrdner(ordner)
	const generiert = {}
	stylesheets.push(...ordnerAnalyse.stylesheets.map(stylesheet => baueStylesheet(path.join(ordner, stylesheet))))
	for (const datei of ordnerAnalyse.dateien) {
		const pfad = path.join(ordner, datei)
		generiert[pfad] = await baueDatei(pfad, stylesheets);
	}
	for (const name of ordnerAnalyse.ordner)
		Object.assign(generiert, await dateien(path.join(ordner, name), stylesheets))
	return generiert
}

async function bauen(input: string, output: string) {
	Object.entries(await dateien(input, [])).forEach(([pfad, inhalt]) => {
		console.log()
		console.log(pfad, inhalt)
	})
}

bauen("./input", "./output").then(() => {
})