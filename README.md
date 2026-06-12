# Abokauf – Frontend

Dies ist das Repository für die Abokauf-React-Frontend-Prüfung. Die Applikation wurde in Google Chrome entwickelt; eine Browserübergreifende Prüfung ist nicht Teil der Arbeit.

Aufgabe und weitere nützliche Dokumente befinden sich in `./documentation`. Das Backend liegt im `/api`-Ordner, ist aber nicht Teil dieser Arbeit.

---

## Tech-Stack

| Kategorie | Technologie |
|---|---|
| Framework | React 19 |
| Sprache | TypeScript ~6.0 |
| State Management | Redux Toolkit 2 + React-Redux 9 |
| Routing | React Router DOM 7 |
| Build-Tool | Vite 8 |
| Styling | Tailwind CSS 4 (Vite-Plugin) + komponentenlokales CSS |
| Icons | Lucide React |

---

## App starten

```bash
npm install
npm run dev
```

---

## Architektur & strukturelle Entscheidungen

### Ordnerstruktur

```
src/
├── app/           # Store, typisierte Hooks, useTheme
├── components/    # Globale UI-Komponenten (Header, Footer, Toaster)
├── features/      # Redux-Slices geordnet nach Domäne
│   ├── auth/
│   ├── konfigurator/
│   └── notifications/
├── pages/         # Seitenkomponenten
│   ├── Auth/
│   ├── Bestellung/
│   ├── Home/
│   └── Konfigurator/
│       └── components/   # Schrittkomponenten des Konfigurators
├── types/         # Zentraler Re-Export aller Domain-Typen
└── utils/         # Hilfsfunktionen (Preisberechnung)
```

Die Aufteilung folgt dem Prinzip **"feature first, page second"**: domänenübergreifender State lebt in `features/`, seitenspezifische UI-Teile liegen direkt bei der Seite. Komponenten, die nur innerhalb einer Seite gebraucht werden (z. B. `StepIndicator`, `OptionCard`), sind nicht in `components/` gewandert — das hätte `components/` zu einem Sammelbecken ohne Kohärenz gemacht.

---

#### Warum Redux für dieses Projekt?

Der Konfigurator-Wizard hat einen State, der über fünf Schritte hinweg aufgebaut wird und am Ende als einzelnes Abo-Objekt submitted wird. Dieser State muss beim Seitenwechsel innerhalb des Wizards erhalten bleiben und von mehreren Unterkomponenten (z. B. `PaymentForm`, `OrderSummary`) lesend verwendet werden, ohne dass Props durch mehrere Ebenen durchgereicht werden müssen.

`useState` in `KonfiguratorPage` hätte das technisch auch ermöglicht, würde aber:
- entweder alle Unterkomponenten stark an die Seite koppeln (viele Props)
- oder Context erfordern, was denselben Boilerplate wie Redux bringt, aber schlechtere DevTools-Unterstützung

Zusätzlich teilen `auth`-State (eingeloggter Nutzer) und der Konfigurator denselben Store, da der Konfigurator beim Submit die `currentUser.id` benötigt. Das wäre mit lokalem State nicht ohne Prop-Drilling umsetzbar.

#### Drei Slices, klare Grenzen

| Slice | Zuständigkeit |
|---|---|
| `auth` | Eingeloggter Kunde, Login/Register/Update-Thunks, Fehlerstate |
| `konfigurator` | Gesamter Wizard-State, PLZ-/Distanzabfragen, Abo-Submit |
| `notifications` | Toast-Queue für globale Rückmeldungen |

Die Slices haben absichtlich keine gegenseitigen Abhängigkeiten. `konfigurator` greift auf `currentUser.id` nicht via Selector zu, sondern bekommt sie aus der Page übergeben. Das hält die Thunks unabhängig testbar.

#### Generische `setField`-Action statt vieler einzelner Actions
Der Konfigurator-State hat 15 Felder. Die Alternative für jedes Feld eine eigene Action (`setAboTyp`, `setLieferPlz`, …) hätte 15 Reducer-Fälle erzeugt, die alle dasselbe machen: ein Feld schreiben. Stattdessen gibt es eine einzige generische Action.

---

### Redux vs. lokalem State: die Abwägung
Nicht alles wandert in den Store.**State, den mehrere Komponenten lesen oder der eine Seite überleben muss → Redux. State, der nur lokal für UI-Interaktion gebraucht wird → `useState`.**

| State | Wo | Begründung |
|---|---|---|
| `aboTyp`, `lieferPlz`, etc. | Redux | Wird über 5 Schritte aufgebaut, bei Submit gebraucht |
| `distanceKm`, `localVersions` | Redux | Ergebnis eines async API-Calls, mehrere Komponenten lesen es |
| `plzSearchDone` | `useState` in KonfiguratorPage | Reine UI-Flag, kein anderer Teil der App interessiert sich dafür |
| `dataprivacy`, `touched` in OrderSummary | `useState` | Kurzlebiger Form-State, der nach Submit wertlos ist |
| `touched` in DeliveryAddressForm | `useState` | Lokale Validierungsanzeige, kein globaler Effekt |
| `dark` (Theme) | `useState` + localStorage | Kein anderer Slice braucht das Theme; localStorage reicht zur Persistenz |

`berechneterPreis` ist ein Sonderfall: Der Preis ist **während des Wizards** abgeleiteter State (wird live aus `calcMonthlyPrice()` berechnet) und wird **erst unmittelbar vor dem letzten Schritt** via `set('berechneterPreis', calcFinalPrice(…))` in den Store geschrieben. Das ist notwendig, weil `navigate()` zur Bestätigungsseite nur einfache Serialisierungsdaten übergeben kann – der Wert muss zum Übergabezeitpunkt feststehen.

---

### React-Komponentenarchitektur

#### Smart/Dumb-Trennung im Konfigurator

`KonfiguratorPage` liest aus dem Store, dispatcht Actions, kennt den Flow und enthält die Schrittlogik. Alle Unterkomponenten (`OptionCard`, `DeliveryAddressForm`, `PaymentForm`, `OrderSummary`, `StepIndicator`) sind **dumb** – sie bekommen Props, geben Events zurück, kennen weder Redux noch den Wizard-State.

Das erlaubt es, eine Unterkomponente isoliert zu betrachten und zu testen, ohne den Store aufzusetzen.

#### Ausnahme: Toaster

`Toaster` ist eine globale Komponente und liest selbst aus dem Store (`selectToasts`). Das ist bewusst: Der Toaster ist kein Teil einer Seite, sondern ein immer präsentes UI-Element, das von überall aus befeuert werden kann. Ihn als "dumb" zu bauen würde bedeuten, Toast-State durch die gesamte Komponenten-Hierarchie durchzureichen, was den Vorteil des Notification-Slices zunichte machen würde.

#### Kontrollierte Inputs durchgängig

Alle Formularfelder sind **controlled** (`value` + `onChange`). Der State liegt damit immer entweder im Redux-Store (Wizard-Felder) oder in einem lokalen `useState` (reine Validierungs-Flags). Es gibt keine uncontrolled Inputs (`ref`-basiert), weil der Wizard-State beim Schrittwechsel erhalten bleiben muss – das geht nur, wenn React die Werte hält.

#### Zentralisierte Schrittvalidierung

`canProceed()` ist eine einzige Funktion in der Page, die für jeden Schritt prüft, ob die Pflichtfelder gesetzt sind.```

Der "Weiter"-Button ist disabled, solange `canProceed()` falsch ist. Die Funktion ist nicht in einer Unterkomponente – weil die Validierungsregeln den gesamten Wizard-State kennen müssen und sonst als Props weitergereicht werden müssten.

---

### Adressvorausfüllung via `useEffect`

Wenn der Nutzer den Region-Schritt betritt, wird seine registrierte Adresse automatisch vorausgefüllt:

Das ist ein gezielter Einsatz von `useEffect` als Reaktion auf eine Zustandsänderung (Schrittwechsel), nicht als Lifecycle-Ersatz. Die Dependency-Array enthält bewusst nicht den gesamten `currentUser`, sondern nur `step` und `useAltPlz` – die Adresse ändert sich während der Wizard-Session nicht, und ein Re-Trigger beim Nutzer-Update wäre falsch.

---

### Styling-Strategie

Tailwind CSS 4 übernimmt globale Utilities (Farben, Spacing, Typographie über Design-Tokens). Für strukturell komplexere Layouts – das mehrspaltige Wizard-Grid, den StepIndicator mit verbindenden Linien, die Preis-Aufschlüsselungs-Popover – existieren `.css`-Dateien direkt neben der TSX-Datei.

Diese Aufteilung vermeidet das bei reinem Tailwind entstehende Problem langer, schwer lesbarer `className`-Strings für strukturell anspruchsvolle Layouts, behält aber die Token-Konsistenz von Tailwind für atomare Werte.

---

### Dark Mode ohne Redux

Der Dark Mode wird über `useTheme()` (`src/app/useTheme.ts`) verwaltet – ein einfaches `useState` + `useEffect`, das `data-theme` am `<html>`-Element setzt und den Wert in `localStorage` speichert.

Die Entscheidung dagegen, Dark Mode in den Redux-Store zu legen: Kein anderer Slice braucht das Theme. Es gibt keine Action, die auf eine Theme-Änderung reagieren müsste. `localStorage` reicht für die Persistenz. Redux einzubringen hätte Boilerplate erzeugt, ohne Mehrwert zu liefern.

---

## Preismodell

Das Preismodell ist selbst definiert und berechnet sich aus folgenden Parametern:

### Grundpreise (monatlich)

| Abo-Typ | Preis/Monat |
|---|---|
| Gedruckte Zeitung – täglich (Mo–Sa) | **34,90 €** |
| Gedruckte Zeitung – Wochenende (Fr+Sa) | **19,90 €** |
| E-Paper (alle Geräte) | **12,90 €** |
| Website-Zugang (Onlineartikel) | **7,90 €** |

### Zuschläge (nur Gedruckte Zeitung)

| Bedingung | Aufpreis |
|---|---|
| Zustellung per Deutsche Post | **+3,00 €/Monat** |
| Austräger, Lieferadresse > 20 km entfernt | **+0,01 € je km** über 20 km, max. **+5,00 €/Monat** |

Der Entfernungszuschlag gilt ausschließlich bei Austräger-Zustellung. Die Distanz wird anhand der PLZ aus der Datenbank abgefragt (`getDistanceFromCompanyToDestinationPlz`).

### Zahlungsintervall

| Intervall | Berechnung |
|---|---|
| Monatlich | Monatspreis × 1 |
| Jährlich | Monatspreis × 12 × **0,9** (10 % Jahresrabatt) |

**Hinweis:** Der Preis wird im Konfigurator live berechnet und erst unmittelbar vor dem letzten Schritt in den Redux-Store geschrieben.
