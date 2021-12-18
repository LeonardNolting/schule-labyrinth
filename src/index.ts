import {JSDOM} from 'jsdom'
import {copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync} from 'fs'
import * as path from "path"

const baueOrdner = (ordner: string): { dateien: string[], assets: string[], stylesheets: string[], ordner: string[] } => {
	const struktur = {dateien: [], assets: [], stylesheets: [], ordner: []}
	readdirSync(ordner).forEach(item => {
		const pfad = path.join(ordner, item)
		const stats = statSync(pfad)
		if (stats.isDirectory()) struktur.ordner.push(item)
		else if (stats.isFile()) {
			const dateiEndung = path.extname(item).toLowerCase().slice(1)
			if (dateiEndung === "css") struktur.stylesheets.push(item)
			else if (dateiEndung === "html") struktur.dateien.push(item)
			else struktur.assets.push(item)
		}
	})
	return struktur
};

async function baueDatei(pfad: string, stylesheets: string[]): Promise<string> {
	const dom = await JSDOM.fromFile(pfad, {contentType: "text/html; charset=utf-8"})
	dom.window.document.head.innerHTML += '<meta charset="utf-8"/>'
	stylesheets.forEach(stylesheet => dom.window.document.head.innerHTML += `<style>${stylesheet}</style>`)
	return dom.serialize()
}

const baueStylesheet = (pfad: string) => readFileSync(pfad).toString();

const anleitung = async (ordner: string, stylesheets: string[]): Promise<{ dateien: { [pfad: string]: string }, assets: string[] }> => {
	const ordnerAnalyse = baueOrdner(ordner)
	const dateien = {}
	const assets = ordnerAnalyse.assets.map(asset => path.join(ordner, asset))
	stylesheets.push(...ordnerAnalyse.stylesheets.map(stylesheet => baueStylesheet(path.join(ordner, stylesheet))))
	for (const datei of ordnerAnalyse.dateien) {
		const pfad = path.join(ordner, datei)
		dateien[pfad] = await baueDatei(pfad, stylesheets);
	}
	for (const name of ordnerAnalyse.ordner) {
		const kindGeneriert = await anleitung(path.join(ordner, name), stylesheets)
		Object.assign(dateien, kindGeneriert.dateien)
		assets.push(...kindGeneriert.assets)
	}
	return {dateien, assets}
}

const pfadVonInputZuOutput = (pfad: string, input: string, output: string): string => {
	if (pfad.slice(0, input.length) !== input) throw new Error("Kann Pfad zu output nicht auflösen.")
	return path.join(output, pfad.slice(input.length))
}

function bauen(input: string, output: string) {
	rmSync(output, {force: true, recursive: true})
	anleitung(input, []).then(dateien => {
		Object.entries(dateien.dateien).forEach(([pfad, inhalt]) => {
			const outputPfad = pfadVonInputZuOutput(pfad, input, output)
			mkdirSync(path.dirname(outputPfad), {recursive: true})
			writeFileSync(outputPfad, inhalt, {encoding: "utf-8"})
		})
		dateien.assets.forEach(asset => copyFileSync(asset, pfadVonInputZuOutput(asset, input, output)))
	})
}

bauen("input", "output")