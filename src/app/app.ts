import { confirm, input, select } from "@inquirer/prompts";
import { Contact } from "../contacts/contact.js";
import { ContactsManager } from "../contacts/contactManager.js";
import {
    SearchContactsByName,
    SearchContactsByEmail,
    SearchContactsByPhone,
    SearchingContacts,
} from "../contacts/contactSearch.js";
import screen from "./screen.js";

const SEARCH_MAP: { [k: string]: SearchingContacts } = {
    name: new SearchContactsByName(),
    email: new SearchContactsByEmail(),
    phone: new SearchContactsByPhone(),
};

export async function getNewSearchTerm(by: string): Promise<string> {
    return await input({
        message: `Enter the contact's ${by}: `,
        theme: { prefix: "" },
    });
}

export async function getNewSearchAlgorithm(): Promise<SearchingContacts> {
    const choices = Object.entries(SEARCH_MAP).map(([name, value]) => {
        return {
            name,
            value,
        };
    });
    return await select({
        message: "Search contacts by: ",
        choices,
        theme: { prefix: "" },
    });
}

export async function getNewContact(): Promise<Contact> {
    let c = false;
    let contact: Contact;
    while (true) {
        const name = await input({
            message: "Enter the contatc's name: ",
            theme: { prefix: "" },
        });
        const email = await input({
            message: "Enter the contatc's email: ",
            theme: { prefix: "" },
        });
        const phone = await input({
            message: "Enter the contatc's phone: ",
            theme: { prefix: "" },
        });

        contact = new Contact(name, phone, email);

        const confirmMessage = `${contact.toString()}\nAre you sure that you want this contact? `;

        c = await confirm({ message: confirmMessage, theme: { prefix: "" } });
        if (!c) {
            screen.clearAllFromCursor(2, 0);
            continue;
        }
        break;
    }

    return contact!;
}

export function addContact(manager: ContactsManager, contact: Contact) {
    manager.add(contact);
}

export function removeContact(manager: ContactsManager, contact: Contact) {
    manager.remove(contact);
}

export function listContacts(manager: ContactsManager) {
    manager.list();
}

export function searchContacts(
    manager: ContactsManager,
    searchAlgorithm: SearchingContacts,
    searchTerm: string,
) {
    manager.setSearchAlgorithm(searchAlgorithm);
    return manager.search(searchTerm);
}

export default {
    getNewSearchTerm,
    getNewSearchAlgorithm,
    getNewContact,
    addContact,
    removeContact,
    searchContacts,
    listContacts,
};
