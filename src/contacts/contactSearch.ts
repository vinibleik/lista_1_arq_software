import { Contact } from "./contact.js";
import Searching from "../core/search.js";

type P = keyof Contact;
type S = Contact[P];

export interface SearchingContacts extends Searching<Contact, S> {}

abstract class BaseSearchContact implements SearchingContacts {
    protected property!: keyof Contact;

    search(list: Contact[], searchTerm: S): Contact[] {
        return list.filter((c) => c[this.property] === searchTerm);
    }

    searchBy(): string {
        return String(this.property);
    }
}

export class SearchContactsByName extends BaseSearchContact {
    property: keyof Contact = "name";
}

export class SearchContactsByPhone extends BaseSearchContact {
    property: keyof Contact = "phone";
}

export class SearchContactsByEmail extends BaseSearchContact {
    property: keyof Contact = "email";
}
