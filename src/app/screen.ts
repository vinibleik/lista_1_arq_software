export default {
    moveCursorTo(x: number, y: number) {
        process.stdout.write(`\u001b[${x};${y}H`);
    },

    moveCursorHome() {
        process.stdout.write(`\u001b[H`);
    },

    clearUntilEnd() {
        process.stdout.write(`\x1B[0J`);
    },

    clearAllFromCursor(x: number, y: number) {
        this.moveCursorTo(x, y);
        this.clearUntilEnd();
    },

    clearScreen() {
        this.moveCursorHome();
        this.clearUntilEnd();
    },
};
