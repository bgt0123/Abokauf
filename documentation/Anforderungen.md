## Funktionale Anforderungen

### Landing Page / Werbung
- Die App startet auf einer Landing Page, die Abonnementinformationen und Werbetext anzeigt
- Verfügbare Abo-Typen werden aufgelistet (Gedruckte Zeitung, E-Paper, Web-Zugang)
- Ein "Jetzt abonnieren"-Button führt in den Konfigurator (bei nicht eingeloggtem User zunächst zum Login)
- Von der Goodbye-Seite kann der User per Link zur externen Homepage des Verlags (z. B. tagesschau.de) zurückkehren

### Annahmen / Rahmenbedingungen
- Lieferung nur innerhalb Deutschlands – die API kennt ausschließlich deutsche PLZs
- Alle Daten werden nur im Arbeitsspeicher gehalten; nach Neustart der App sind neu registrierte User nicht mehr vorhanden
- Am Appstart wird ein fixer Firmenort (PLZ der Redaktion) definiert – dieser bestimmt, ob Austräger-Zustellung möglich ist

### Login
- Formular mit Eingabefeld für Benutzername und Passwort sowie Login-Button
- Benutzername-Validierung: mindestens 5 Zeichen, Fehlermeldung bei Verstoß
- Bei bekanntem Benutzernamen + korrektem Passwort: Login erfolgreich, Weiterleitung zum Konfigurator
- Bei Fehler (unbekannter User / falsches Passwort): sichtbare Fehlermeldung, kein Seitenwechsel
- Link zur Registrierungsseite vorhanden

### Registrierung
- Formular mit Pflichtfeldern: Benutzername (min. 5 Zeichen), Passwort, Vorname, Nachname, E-Mail, Straße, Hausnummer, PLZ, Stadt
- PLZ wird gegen die API validiert (nur gültige deutsche PLZs erlaubt), Fehlermeldung bei ungültiger PLZ
- Nach erfolgreicher Registrierung: User ist automatisch eingeloggt, Weiterleitung zum Konfigurator
- Link zur Login-Seite vorhanden

### API-Anbindung (simuliert)
- `GET /lokalausgaben?plz={plz}` – gibt verfügbare Lokalausgaben und die empfohlene Ausgabe für eine PLZ zurück
- `POST /kunden` – legt einen neuen Kunden an (Registrierung)
- `GET /kunden/{id}` – lädt Kundendaten nach Login
- `GET /preis?plz={plz}&zustellungsTyp={typ}&intervall={intervall}&zahlungsIntervall={zi}` – berechnet den Abopreis
- `POST /abos` – legt ein neues Abo mit den Kundendaten an

### Abo-Konfigurator
- Lieferadresse (PLZ + Stadt) eingeben → API-Aufruf ermittelt verfügbare Lokalausgaben
- Lokalausgabe aus Dropdown auswählen; von der API empfohlene Ausgabe ist vorausgewählt
- Zustellungstyp auswählen: `Austräger` (nur wenn Lieferadresse im Verbreitungsgebiet) oder `Post`
- Belieferungsintervall auswählen: `Täglich` oder `Wochenende (Fr+Sa)` – beeinflusst den Preis
- Zahlungsintervall auswählen: `Monatlich` oder `Jährlich` (jährlich = Rabatt) – beeinflusst den Preis
- Zahlungsart auswählen: `Lastschrift` oder `Rechnung`
- Startdatum auswählen (Datumsfeld; muss in der Zukunft liegen)
- Hinweisfeld für den Austräger (z. B. Standort des Zeitungsrohrs) – nur sichtbar wenn Zustellungstyp = `Austräger`
- Preis wird nach jeder Parameteränderung per API-Aufruf neu berechnet und live angezeigt

### Check-out (3 Schritte)
- **Schritt 1 – Rechnungsadresse:** Rechnungsadresse aus Profil ist vorausgefüllt; abweichende Adresse kann eingegeben werden (Vorname, Nachname, Straße, Nr., PLZ, Stadt)
- **Schritt 2 – Zahlungsart:** Zahlungsart-spezifische Daten eingeben (z. B. IBAN bei Lastschrift)
- **Schritt 3 – Bestellübersicht:** Alle Abo-Details und Gesamtpreis anzeigen; Datenschutzerklärung per Checkbox bestätigen (Pflicht); "Jetzt bestellen"-Button schickt Bestellung ab (API `POST /abos`)

### Goodbye-Seite
- Dankes-Text des Verlags wird angezeigt
- Startdatum der ersten Lieferung ist sichtbar
- Button/Link führt zur externen Homepage (z. B. tagesschau.de)

### Bonus
- Eingeloggter User sieht eine Übersicht aller seiner aktiven Abos
- Bei Umzug: Rechnungsadresse eines bestehenden Abos anpassbar
- Lieferung ins Ausland ermöglichen (Preisaufschlag je nach Land)
- Doppelregistrierung mit derselben E-Mail-Adresse verhindern

## Objekte & Typen

### Enums / Union Types

```ts
type ZustellungsTyp = "Austräger" | "Post";

type BelieferungsIntervall = "Täglich" | "Wochenende";

type ZahlungsIntervall = "Monatlich" | "Jährlich";

type Zahlungsart = "Lastschrift" | "Rechnung";
```

### Adresse

```ts
type Adresse = {
  strasse: string;
  hausnummer: string;
  plz: string;        // nur deutsche PLZs
  stadt: string;
};
```

### User (Kunde)

```ts
type User = {
  username: string;   // min. 5 Zeichen
  password: string;
  vorname: string;
  nachname: string;
  email: string;
  adresse: Adresse;   // Rechnungsadresse
  abos: Abo[];
};
```

### Lokalausgabe

```ts
type Lokalausgabe = {
  id: string;
  name: string;
  region: string;     // Stadtteil oder Umlandgemeinde
};
```

### Lieferung

```ts
type Lieferung = {
  adresse: Adresse;
  zustellungsTyp: ZustellungsTyp;
  intervall: BelieferungsIntervall;
  austraegerHinweis?: string;  // optional, nur bei ZustellungsTyp "Austräger"
};
```

### Abo (Subscription)

```ts
type Abo = {
  id: string;
  lokalausgabe: Lokalausgabe;
  lieferung: Lieferung;
  rechnungsadresse: Adresse;
  zahlungsIntervall: ZahlungsIntervall;
  zahlungsart: Zahlungsart;
  startDatum: Date;
  preis: number;
};
```

### Bestellung (Order)

```ts
type Bestellung = {
  abo: Abo;
  user: User;
  datenschutzAkzeptiert: boolean;
  bestellDatum: Date;
};
```


## Pages

| Route | Komponente | Beschreibung |
|---|---|---|
| `/` | `LandingPage` | Werbeseite mit Abo-Übersicht und "Jetzt abonnieren"-Button |
| `/login` | `LoginPage` | Login-Formular; Weiterleitung zum Konfigurator bei Erfolg |
| `/registrierung` | `RegistrierungPage` | Registrierungsformular; nach Abschluss direkt eingeloggt |
| `/konfigurator` | `KonfiguratorPage` | Abo-Auswahl und Konfiguration (geschützt – nur eingeloggt) |
| `/checkout` | `CheckoutPage` | 3-Schritt-Checkout (Adresse → Zahlung → Übersicht) |
| `/goodbye` | `GoodbyePage` | Abschlussseite nach verbindlicher Bestellung |

## Components

### Landing Page
| Komponente | Beschreibung |
|---|---|
| `AboUebersicht` | Listet verfügbare Abo-Typen (Gedruckte Zeitung, E-Paper, Web-Zugang) mit Kurzbeschreibung |
| `BestellButton` | "Jetzt abonnieren"-Button; leitet zum Konfigurator oder zuerst zum Login weiter |

### Shared
| Komponente | Beschreibung |
|---|---|
| `AdresseForm` | Wiederverwendbares Adresseingabe-Formular (Straße, Nr., PLZ, Stadt) |
| `Header` | Navigationsleiste mit Login-Status und Link zur Landing Page |

### Login
| Komponente | Beschreibung |
|---|---|
| `LoginForm` | Eingabefelder für Benutzername + Passwort, Validierung, Fehlermeldung |

### Registrierung
| Komponente | Beschreibung |
|---|---|
| `RegistrierungForm` | Alle Pflichtfelder inkl. `AdresseForm`; PLZ-Validierung über API |

### Konfigurator
| Komponente | Beschreibung |
|---|---|
| `LieferadresseForm` | PLZ + Stadt eingeben; löst API-Aufruf für Lokalausgaben aus |
| `LokausgabeSelector` | Dropdown zur Auswahl der Lokalausgabe (empfohlene ist vorausgewählt) |
| `ZustellungsTypSelector` | Auswahl Austräger / Post (Austräger nur wenn PLZ im Verbreitungsgebiet) |
| `BelieferungsIntervallSelector` | Auswahl Täglich / Wochenende |
| `ZahlungsIntervallSelector` | Auswahl Monatlich / Jährlich |
| `ZahlungsartSelector` | Auswahl Lastschrift / Rechnung |
| `StartdatumPicker` | Datumsfeld; nur zukünftige Daten erlaubt |
| `AustraegerHinweisField` | Textfeld für Austräger-Hinweis; nur sichtbar wenn ZustellungsTyp = Austräger |
| `PreisAnzeige` | Zeigt den aktuell berechneten Preis (live nach jeder Parameteränderung) |

### Checkout
| Komponente | Beschreibung |
|---|---|
| `CheckoutStepper` | 3-Schritt-Navigation (Tabs / Stepper) |
| `RechnungsadresseTab` | Schritt 1: Rechnungsadresse bestätigen oder abweichend eingeben |
| `ZahlungsartTab` | Schritt 2: Zahlungsart-spezifische Daten eingeben (z. B. IBAN) |
| `BestelluebersichtTab` | Schritt 3: Abo-Details + Preis; Datenschutz-Checkbox; "Jetzt bestellen"-Button |