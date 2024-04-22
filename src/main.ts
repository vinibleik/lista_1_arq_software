import { select, input } from "@inquirer/prompts";
import chalk from "chalk";
import App from "./app/app.js";
import screen from "./app/screen.js";
import { getData } from "./data/data.js";
import {
    ContactsManagerComponent,
    ContactsManagerLog,
} from "./contacts/contactManager.js";
import {
    SearchContactsByEmail,
    SearchContactsByName,
    SearchContactsByPhone,
    SearchingContacts,
} from "./contacts/contactSearch.js";
import { Contact } from "./contacts/contact.js";

enum CHOICES {
    ADD,
    REMOVE,
    LIST,
    SEARCH,
    EXIT,
}

const MAIN_CHOICES = [
    {
        name: "Add new contact",
        value: CHOICES.ADD,
    },
    {
        name: "Remove a contact",
        value: CHOICES.REMOVE,
    },
    {
        name: "List contacts",
        value: CHOICES.LIST,
    },
    {
        name: "Search contacts",
        value: CHOICES.SEARCH,
        description: "Search contacts by some filter: (name, phone or email)",
    },
    {
        name: "Exit",
        value: CHOICES.EXIT,
    },
];

async function main() {
    let option: CHOICES;
    const baseManager = new ContactsManagerComponent(
        new SearchContactsByName(),
    );
    const managerLog = new ContactsManagerLog(baseManager);

    const newItemInputs: string[] = [
        "Enter the contatc's name: ",
        "Enter the contatc's email: ",
        "Enter the contatc's phone: ",
    ];

    function createNewItem(s: string[]): Contact {
        if (s.length !== 3) {
            throw new Error("Invalid Contact's arguments");
        }
        const name = s[0];
        const email = s[1];
        const phone = s[2];
        return new Contact(name, phone, email);
    }

    function createConfirmMessage(contact: Contact): string {
        return `${contact.toString()}\nAre you sure that you want this contact? `;
    }

    const SEARCH_MAP: { [k: string]: SearchingContacts } = {
        name: new SearchContactsByName(),
        email: new SearchContactsByEmail(),
        phone: new SearchContactsByPhone(),
    };

    const choices = Object.entries(SEARCH_MAP).map(([name, value]) => {
        return {
            name,
            value,
        };
    });

    const app = new App<Contact, string>(
        managerLog,
        newItemInputs,
        createNewItem,
        createConfirmMessage,
        choices,
    );

    if (process.argv.length > 2 && process.argv[2] == "--dummy") {
        getData().forEach((contact) => managerLog.add(contact));
    }

    loop: while (true) {
        screen.clearScreen();
        option = await select({
            message: "Choose a option: ",
            choices: MAIN_CHOICES,
            theme: {
                prefix: "",
            },
        });
        switch (option) {
            case CHOICES.ADD:
                await app.addItem();
                break;
            case CHOICES.REMOVE:
                await app.removeItem();
                break;
            case CHOICES.LIST:
                app.listItems();
                break;
            case CHOICES.SEARCH:
                const contacts = await app.searchItem();

                if (contacts.length === 0) {
                    console.log(
                        chalk.bgYellow.bold.black("No Contacts found!"),
                    );
                    break;
                }
                console.log(chalk.bgYellow.bold.black("Contacts found: "));
                contacts.forEach((c) => {
                    console.log(c.toString());
                });
                console.log();
                break;
            case CHOICES.EXIT:
                console.log(chalk.bgYellow.bold.black("Bye Bye"));
                break loop;
        }
        await input({
            message: "Press any key to continue...",
            theme: {
                prefix: "",
                style: {
                    message: (text: string) => chalk.white.bold(text),
                },
            },
        });
    }
}

main();
