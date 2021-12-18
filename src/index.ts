import {JSDOM} from 'jsdom'
import {mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync} from 'fs'
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
	rmSync('./dir', {force: true, recursive: true})
	Object.entries(await dateien(input, [])).forEach(([pfad, inhalt]) => {
		if (pfad.slice(0, input.length) !== input) throw new Error("Kann Pfad zu output nicht auflösen.")

		const outputPfad = path.resolve(path.join(output, pfad.slice(input.length)));
		mkdirSync(path.dirname(outputPfad), {recursive: true})
		writeFileSync(outputPfad, inhalt)
	})
}

bauen("input", "output").then(() => {
})