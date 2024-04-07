import { readFileSync } from "fs";
import { Contact } from "../contacts/contact.js";

type DATA = {
    name: string;
    email: string;
    phone: string;
};

export function getData(): Contact[] {
    const data = readFileSync("src/data/data.json", "utf8");
    const contacts = JSON.parse(data) as DATA[];
    return contacts.map(
        ({ name, email, phone }) => new Contact(name, phone, email),
    );
}
