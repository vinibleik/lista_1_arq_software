import { select, input } from "@inquirer/prompts";
import chalk from "chalk";
import app from "./app/app.js";
import screen from "./app/screen.js";
import { getData } from "./data/data.js";
import {
    ContactsManagerComponent,
    ContactsManagerLog,
} from "./contacts/contactManager.js";
import { SearchContactsByName } from "./contacts/contactSearch.js";

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

    if (process.argv.length > 2 && process.argv[2] == "--dummy") {
        getData().forEach((contact) => app.addContact(baseManager, contact));
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
                app.addContact(managerLog, await app.getNewContact());
                break;
            case CHOICES.REMOVE:
                app.removeContact(managerLog, await app.getNewContact());
                break;
            case CHOICES.LIST:
                app.listContacts(managerLog);
                break;
            case CHOICES.SEARCH:
                let searchAlgorithm = await app.getNewSearchAlgorithm();
                let searchTerm = await app.getNewSearchTerm(
                    searchAlgorithm.searchBy(),
                );
                const contacts = app.searchContacts(
                    managerLog,
                    searchAlgorithm,
                    searchTerm,
                );

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
