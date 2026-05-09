
/ Version 1.0 - 08.05.2026 - MG

/****************************************************************************/
//Übrersicht:
/****************************************************************************/
    1. Berechne die Strecke von der Firma bis zum Kunden für die Preisberechnung
    2. Kundendaten
    3. Abo/Abonnement
    4. Prüfe die Verfügbarkeit der lokalen Ausgaben


/****************************************************************************/
/ 1. Berechne die Strecke von der Firma bis zum Kunden für die Preisberechnung
/****************************************************************************/

[Info]
Die Entfernung wird Luftlinie berechnet.
Die Firmendaten können in der _Database.js geändert werden.

[Methode]
Methode die in der API verwendet werden kann:
    getDistanceFromCompanyToDestinationPlz("72762")


---------------------------------------------------------------------
Anwendung:
---------------------------------------------------------------------

1. Importieren
    import { getDistanceFromCompanyToDestinationPlz } from '../api/Api'

2. Aufruf / Promise
    getDistanceFromCompanyToDestinationPlz("70173").then((erg)=>{
        let resultObj = erg.distanceCalcObj[0];
        let distance = resultObj.distance.toFixed(2);
    },()=>{
        console.log("OnError")
    })

/******************************************/

/****************************************************************************/
/ 2. Kundendaten
/****************************************************************************/

[Info]
Kundendaten können in der Datenbank abgelegt werden.

[CRUD]
1. Kunde anlegen
    function saveCustomer(newCustomer) {
        return Promise.all([
            _saveCustomer(newCustomer),
        ]).then((success) => ({
            success,
        }))
    }

    Rückgabe => true wenn erfolgreich

    [Example - New Customer Obj]
    let newCustomer = {
        id:0,
        firstname:'',
        lastname:'',
        companyname:'',
        email:'',
        password:'',
        phone:'',
        deliveryAddress:{
            city:'',
            plz:'',
            street1:'',
            street2:'',
        },
        billingAddress:{
            city:'',
            plz:'',
            street1:'',
            street2:'',
        },
    }

2. Kunde auslesen
    function readCustomer (customerEmail) {
        return Promise.all([
            _readCustomer(customerEmail),
        ]).then((customer) => ({
            customer,
        }))
    }

    Rückgabe => Kunde, wenn erfolgreich

3. Kunde updaten
    function updateCustomer(customer) {
        return Promise.all([
            _updateCustomer(customer),
        ]).then((success) => ({
            success,
        }))
    }
    Rückgabe => true wenn erfolgreich

4. Kunde löschen
    function _deleteCustomer(customerId){    
        return new Promise((res, rej) => {
            delete customers[customerId]
            res(true)
        })
    }

    Rückgabe => true wenn erfolgreich

5. Alle Kunden auslesen
    function getAllCustomers() {
        return Promise.all([
            _getAllCustomer(),
        ]).then(([allCustomers]) => ({
            allCustomers,
        }))
    }

    Rückgabe => Alle Kunde, wenn erfolgreich


/****************************************************************************/
/ 3. Abo/Abonnement
/****************************************************************************/

[Info]
Die Abodaten können hier gespeichert und verwaltet werden.

[CRUD]
1. Abo anlegen
    function saveAboForCustomer(newAbo) {
        return Promise.all([
            _saveAbo(newAbo),
        ]).then((success) => ({
            success,
        }))
    }
    
    Rückgabe => true wenn erfolgreich

    [Example - New Abo Obj]
    let newAbo = {
        id: 0,
        cid:2,
        created:'18.05.2021',
        startabodate:'01.07.2021',
        endabodate:'01.07.2022',
        dataprivacyaccepted:true,
        abotype:'Printed',              //Printed or E-paper or Website
        deliverymethod:'Post',          //Post or Delivery man
        paymenttype:'Credit Card',      //Credit Card or Direct debit
        payment:'Annual',               //Monthly or Annual
        subscriptiontype:'Daily',       //Daily or Weekend     
        calculatedprice:12.99,          //Each paper
        calculatedyearprice:130.0,      //Pay Yearly
        localpaperversions:1,           //Id from localpaperversions
    }

2. Abo auslesen

    function readAbo(aboId) {
        return Promise.all([
            _readAbo(aboId),
        ]).then((abo) => ({
            abo,
        }))
    }

    Rückgabe => Abo, wenn erfolgreich

3. Abo updaten

    function updateAboForCustomer(abo) {
        return Promise.all([
            _updateAbo(abo),
        ]).then((success) => ({
            success,
        }))
    }

    Rückgabe => true wenn erfolgreich

4. Abo löschen
    function deleteAboForCustomer(aboId) {
        return Promise.all([
            _deleteAbo(aboId),
        ]).then((success) => ({
            success,
        }))
    }

    Rückgabe => true wenn erfolgreich

5. Abos von Kunde abfragen
    function readAllAbosForCustomer(customerId) {
        return Promise.all([
            _getAllAbosForCustomer(customerId),
        ]).then(([allAbos]) => ({
            allAbos,
        }))
    }

    Rückgabe => alle Abos vom Kunden

6. Alle Abos auslesen
    function readAllAbos() {
        return Promise.all([
            _readAllAbos(),
        ]).then(([allAbos]) => ({
            allAbos,
        }))
    }

    Rückgabe => alle Abos in der Datenbank


/****************************************************************************/
/ 4. Prüfe die Verfügbarkeit der lokalen Ausgaben
/****************************************************************************/

[Info]
Mit der Angabe der Postleihzahl kann man sich die aktuellen Zeitungsausgaben 
anzeigen lassen.

[Methode]
function getLocalVersionsForPlz(plz) {
  return Promise.all([
    _getLocalVersionsForPlz(plz),
  ]).then(([localversions]) => ({
    localversions,
  }))
}

Rückgabe => alle Lokalversionen die in dem Plz Gebiet verfügbar sind