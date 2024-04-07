import { Contact } from "./contact.js";
import Manager from "../core/manager.js";
import { SearchingContacts } from "./contactSearch.js";
import chalk from "chalk";

type S = Contact[keyof Contact];

export interface ContactsManager extends Manager<Contact, S> {
    setSearchAlgorithm(searchAlgorithm: SearchingContacts): void;
    length: number;
}

export class ContactsManagerComponent implements ContactsManager {
    _contacts: Contact[];
    _searchAlgorithm: SearchingContacts;

    constructor(searchAlgotihm: SearchingContacts) {
        this._contacts = [];
        this._searchAlgorithm = searchAlgotihm;
    }

    setSearchAlgorithm(searchAlgorithm: SearchingContacts): void {
        this._searchAlgorithm = searchAlgorithm;
    }

    get length(): number {
        return this._contacts.length;
    }

    add(contact: Contact): void {
        this._contacts.push(contact);
    }

    remove(contact: Contact): void {
        this._contacts = this._contacts.filter(
            (c) =>
                c.name !== contact.name &&
                c.email !== contact.email &&
                c.phone !== contact.phone,
        );
    }

    list(): void {
        this._contacts.forEach((c) => {
            console.log(c.toString());
        });
        console.log();
    }

    search(searchTerm: S): Contact[] {
        return this._searchAlgorithm.search(this._contacts, searchTerm);
    }

    searchBy(): string {
        return this._searchAlgorithm.searchBy();
    }
}

export class ContactsManagerDecorator implements ContactsManager {
    protected _manager: ContactsManager;

    constructor(manager: ContactsManager) {
        this._manager = manager;
    }

    get length(): number {
        return this._manager.length;
    }

    add(contact: Contact): void {
        this._manager.add(contact);
    }

    remove(contact: Contact): void {
        this._manager.remove(contact);
    }

    list(): void {
        this._manager.list();
    }

    search(searchTerm: S): Contact[] {
        return this._manager.search(searchTerm);
    }

    setSearchAlgorithm(searchAlgorithm: SearchingContacts): void {
        return this._manager.setSearchAlgorithm(searchAlgorithm);
    }

    searchBy(): string {
        return this._manager.searchBy();
    }
}

export class ContactsManagerLog extends ContactsManagerDecorator {
    static _formatMsg(msg: string): string {
        return chalk.underline.bgBlueBright.red.bold(msg);
    }

    add(contact: Contact): void {
        console.log(
            `${ContactsManagerLog._formatMsg("Adding to list of contacts:")}\n${contact.toString()}`,
        );
        super.add(contact);
    }

    remove(contact: Contact): void {
        console.log(
            `${ContactsManagerLog._formatMsg("Removing of the list of contacts:")}\n${contact.toString()}`,
        );
        super.remove(contact);
    }

    list(): void {
        console.log(ContactsManagerLog._formatMsg("Contact list: "));
        super.list();
    }

    search(searchTerm: S): Contact[] {
        console.log(
            ContactsManagerLog._formatMsg(
                "Searching in the list by " +
                    this.searchBy() +
                    " with values equals to " +
                    searchTerm,
            ),
        );
        return super.search(searchTerm);
    }
}
