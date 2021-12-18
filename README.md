# Schnellstart

[![Bauen](https://github.com/LeonardNolting/schule-labyrinth/actions/workflows/bauen.yaml/badge.svg)](https://github.com/LeonardNolting/schule-labyrinth/actions/workflows/bauen.yaml)

[Input](input)

[Editor](https://github.dev/LeonardNolting/schule-labyrinth/tree/main/input)

[Output](https://github.com/LeonardNolting/schule-labyrinth/releases/download/latest/output.zip)

# Erklärung
Im Schulunterricht benutzen wir Filius und wollen für das Netzwerk unserer Klasse Spiele bereitstellen.
Aufgrund der Einschränkungen hinsichtlich JS und CSS, entschieden wir uns für ein "HTML-only"-Labyrinth durch die Schule.
Man kann sich dabei durch verschiedene HTML-Dateien klicken, die miteinander verlinkt sind und jeweils das aktuelle Szenario beschreiben.

Mit zunehmender Größe des Spiels wird die Verwaltung der HTML-Dateien stark aufwändiger, außerdem können Stylesheets nicht ausgelagert werden (sondern müssen in jedem einzelnen Dokument inline vorhanden sein), was das einheitliche Verändern des Designs erschwert.

Um diesen Problemen vorzubeugen, gibt es diesen "compiler", welcher Dateien im `input`-Ordner nimmt und transformiert in den `output`-Ordner legt.
Dadurch ist das HTML-Overhead überflüssig (aber trotzdem erlaubt) und es werden Stylesheets automatisch auf alle Geschwister- und Kind-Dateien angewendet. Restliche Dateien, wie z.B. Bilder, werden ohne Veränderungen nach `output` kopiert.
Bei pushes zu main wird [automatisch](.github/workflows/bauen.yaml) das Tag `latest` ersetzt und der gezippte Ordner `output` daran angehängt.

Weitere Funktionen, wie z.B. das Auslagern und Einbinden an verschiedenen Stellen von HTML, können noch hinzugefügt werden.

# Benutzung
## Geschichte bearbeiten
Melde dich mit deinem GitHub-Account an und bearbeite eine Datei in [./input](input).

Lege eine kurze Nachricht, die deine Veränderungen beschreibt, fest (optional) und bestätige die Veränderung.

Der Workflow wird ausgeführt was sich durch ein gelbes Licht unten zeigt.

[![Bauen](https://github.com/LeonardNolting/schule-labyrinth/actions/workflows/bauen.yaml/badge.svg)](https://github.com/LeonardNolting/schule-labyrinth/actions/workflows/bauen.yaml)

Sobald das Licht grün ist, kannst du [hier](https://github.com/LeonardNolting/schule-labyrinth/releases/download/latest/output.zip) die neue Zip-Datei herunterladen und in Filius einfügen. 
Das sollte innerhalb höchstens einer Minute passieren.

Falls etwas nicht funktioniert hat, wird die Anzeige rot und mir wird eine E-Mail geschickt. Du kannst dann evtl. die Schritte unter "Lokal bauen" befolgen, was aber etwas technisches Verständnis voraussetzt.

### Editor
Möchtest du mehrere Dateien bearbeiten, kann es einfacher sein, einen Editor dafür zu benutzen. Drücke dazu einfach nur die "." (Punkt)-Taste auf der Tastatur, oder folge [diesem Link](https://github.dev/LeonardNolting/schule-labyrinth/tree/main/input).

Dadurch wird VSCode geöffnet, was dir z.B. Autovervollständigung, Syntax highlighting und andere Vorteile bietet.

## Lokal bauen
`npm i && npm run run`

Das output befindet sich jetzt in einem Ordner `output`.
