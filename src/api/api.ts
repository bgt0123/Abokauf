import {
    _chechDatabaseDistance,
    _saveCustomer,
    _updateCustomer,
    _deleteCustomer,
    _readCustomer,
    _getAllCustomer,
    _saveAbo,
    _updateAbo,
    _deleteAbo,
    _readAbo,
    _getAllAbosForCustomer,
    _readAllAbos,
    _getLocalVersionsForPlz,
    type Abo,
    type Customer,
    type DistanceResult,
    type LocalVersionsResult,
    type NewAbo,
    type NewCustomer,
} from './_Database';

export type { Abo, Customer, NewCustomer, Address, DistanceResult, LocalPaperVersion, LocalVersionsResult, NewAbo } from './_Database';

//****************************************/
// 1. Berechne die Strecke von der Firma bis zum Kunden für die Preisberechnung
//****************************************/
export function getDistanceFromCompanyToDestinationPlz(plzDestination: string): Promise<{ distanceCalcObj: DistanceResult[] }> {
    return Promise.all([
        _chechDatabaseDistance(plzDestination),
    ]).then((distanceCalcObj) => ({
        distanceCalcObj,
    }));
}

//****************************************/
// 2. Kundendaten
//****************************************/
export function saveCustomer(newCustomer: NewCustomer): Promise<{ success: boolean[] }> {
    return Promise.all([
        _saveCustomer(newCustomer),
    ]).then((success) => ({
        success,
    }));
}

export function updateCustomer(customer: Customer): Promise<{ success: boolean[] }> {
    return Promise.all([
        _updateCustomer(customer),
    ]).then((success) => ({
        success,
    }));
}

export function deleteCustomer(customerId: number): Promise<{ success: boolean[] }> {
    return Promise.all([
        _deleteCustomer(customerId),
    ]).then((success) => ({
        success,
    }));
}

export function readCustomer(customerEmail: string): Promise<{ customer: Array<Customer | undefined> }> {
    return Promise.all([
        _readCustomer(customerEmail),
    ]).then((customer) => ({
        customer,
    }));
}

export function getAllCustomers(): Promise<{ allCustomers: Record<number, Customer> }> {
    return Promise.all([
        _getAllCustomer(),
    ]).then(([allCustomers]) => ({
        allCustomers,
    }));
}

//****************************************/
// 3. Abo/Abonnement
//****************************************/
export function saveAboForCustomer(newAbo: NewAbo): Promise<{ success: boolean[] }> {
    return Promise.all([
        _saveAbo(newAbo),
    ]).then((success) => ({
        success,
    }));
}

export function updateAboForCustomer(abo: Abo): Promise<{ success: boolean[] }> {
    return Promise.all([
        _updateAbo(abo),
    ]).then((success) => ({
        success,
    }));
}

export function deleteAboForCustomer(aboId: number): Promise<{ success: boolean[] }> {
    return Promise.all([
        _deleteAbo(aboId),
    ]).then((success) => ({
        success,
    }));
}

export function readAbo(aboId: number): Promise<{ abo: Array<Abo | undefined> }> {
    return Promise.all([
        _readAbo(aboId),
    ]).then((abo) => ({
        abo,
    }));
}

export function readAllAbosForCustomer(customerId: number): Promise<{ allAbos: Abo[] }> {
    return Promise.all([
        _getAllAbosForCustomer(customerId),
    ]).then(([allAbos]) => ({
        allAbos,
    }));
}

export function readAllAbos(): Promise<{ allAbos: Record<number, Abo> }> {
    return Promise.all([
        _readAllAbos(),
    ]).then(([allAbos]) => ({
        allAbos,
    }));
}

//****************************************/
// 4. Lokalausgabe
//****************************************/
export function getLocalVersionsForPlz(plz?: string | number): Promise<{ localversions: LocalVersionsResult }> {
    return Promise.all([
        _getLocalVersionsForPlz(plz),
    ]).then(([localversions]) => ({
        localversions,
    }));
}
