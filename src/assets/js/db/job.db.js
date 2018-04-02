class Job {
    constructor(dbname) {
        this._db = indexedDB.open(dbname);
    }
}


export { Job as default }