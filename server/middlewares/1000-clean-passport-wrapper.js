export default function* cleanEmptySessionPassport(next) {
    yield* next;
    if (this.session && this.session.passport && Object.keys(this.session.passport).length === 0) {
        delete this.session.passport;
    }
};
