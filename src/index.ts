import {JSDOM} from 'jsdom'
import {copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync} from 'fs'
import * as path from "path"
import {Converter} from "showdown";

const baueOrdner = (ordner: string): { htmlDateien: string[], mdDateien: string[], assets: string[], stylesheets: string[], ordner: string[] } => {
	const struktur = {htmlDateien: [], mdDateien: [], assets: [], stylesheets: [], ordner: []}
	readdirSync(ordner).forEach(item => {
		const pfad = path.join(ordner, item)
		const stats = statSync(pfad)
		if (stats.isDirectory()) struktur.ordner.push(item)
		else if (stats.isFile()) {
			const dateiEndung = path.extname(item).toLowerCase().slice(1)
			if (dateiEndung === "css") struktur.stylesheets.push(item)
			else if (dateiEndung === "md") struktur.mdDateien.push(item)
			else if (dateiEndung === "html") struktur.htmlDateien.push(item)
			else struktur.assets.push(item)
		}
	})
	return struktur
}

function baueDOM(html: string, stylesheets: string[]): string {
	const dom = new JSDOM(html)
	dom.window.document.head.innerHTML += '<meta charset="utf-8"/>'
	stylesheets.forEach(stylesheet => dom.window.document.head.innerHTML += `<style>${stylesheet}</style>`)
	return dom.serialize()
}

const baueHTML = (pfad: string, stylesheets: string[]) => baueDOM(readFileSync(pfad).toString(), stylesheets)

const baueCSS = (pfad: string) => readFileSync(pfad).toString();

const converter = new Converter()

function baueMD(pfad: string, stylesheets: string[]): string {
	const md = readFileSync(pfad).toString()
	const html = converter.makeHtml(md)
	return baueDOM(html, stylesheets)
}

const anleitung = (ordner: string, stylesheets: string[]): { dateien: { [pfad: string]: string }, assets: string[] } => {
	const ordnerAnalyse = baueOrdner(ordner)
	const dateien = {}
	const assets = ordnerAnalyse.assets.map(asset => path.join(ordner, asset))
	stylesheets.push(...ordnerAnalyse.stylesheets.map(stylesheet => baueCSS(path.join(ordner, stylesheet))))
	for (const datei of ordnerAnalyse.htmlDateien) {
		const pfad = path.join(ordner, datei)
		dateien[pfad] = baueHTML(pfad, stylesheets);
	}
	for (const datei of ordnerAnalyse.mdDateien) {
		const pfad = path.join(ordner, datei)
		dateien[pfad.slice(0, -path.extname(pfad).length) + ".html"] = baueMD(pfad, stylesheets)
	}
	for (const name of ordnerAnalyse.ordner) {
		const kindGeneriert = anleitung(path.join(ordner, name), stylesheets)
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
	const dateien = anleitung(input, [])
	Object.entries(dateien.dateien).forEach(([pfad, inhalt]) => {
		const outputPfad = pfadVonInputZuOutput(pfad, input, output)
		mkdirSync(path.dirname(outputPfad), {recursive: true})
		writeFileSync(outputPfad, inhalt, {encoding: "utf-8"})
	})
	dateien.assets.forEach(asset => copyFileSync(asset, pfadVonInputZuOutput(asset, input, output)))
}

bauen("input", "output")