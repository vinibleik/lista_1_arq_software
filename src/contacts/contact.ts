import chalk from "chalk";

export class Contact {
    public name: string;
    public phone: string;
    public email: string;

    constructor(name: string, phone: string, email: string) {
        this.name = name;
        this.phone = phone;
        this.email = email;
    }

    toString() {
        const c = chalk.bgYellow.black.bold("Contact:");
        const n = chalk.bgYellow.black.bold("name:");
        const p = chalk.bgYellow.black.bold("phone:");
        const e = chalk.bgYellow.black.bold("email:");
        return `${c}
    ${n} ${chalk.bgBlack.yellow.bold(this.name)}
    ${p} ${chalk.bgBlack.yellow.bold(this.phone)}
    ${e} ${chalk.bgBlack.yellow.bold(this.email)}`;
    }
}
