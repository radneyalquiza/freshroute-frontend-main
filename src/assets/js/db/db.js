// import JOB from 'job.db.js'
// import CLIENT from 'client.db.js'
// import ADDRESS from 'address.db.js'
// import USER from 'user.db.js'

const testdb = "test";
const dbname = "FreshRouteDB";

const TXN = {
    RW: "readwrite"
}
const TBL = {
    ROUTE: "Route"
}

class DB {


    constructor(success) {

        this.context = null;
        this.db = null;
        var idbSupported = false;

        if ("indexedDB" in window) {
            idbSupported = true;
        }
        if (idbSupported)
            this.initialize(success);
    }

    initialize(success) {
        let instance = this;
        instance.context = indexedDB.open(testdb, 1);

        instance.context.onupgradeneeded = function(e) {
            console.log("running onupgradeneeded");
            var thisDB = e.target.result;

            if (!thisDB.objectStoreNames.contains(TBL.ROUTE)) {
                thisDB.createObjectStore(TBL.ROUTE);
            }

        }
        instance.context.onsuccess = function(e) {
            instance.db = e.target.result;

            console.log("Success!", instance.db);

            success(instance.db);
        }

        this.context.onerror = function(e) {
            console.log("Error");
            console.dir(e);
        }
    }

    addRoute(t) {
        let instance = this;
        let trans = instance.db.transaction([TBL.ROUTE], TXN.RW);
        let store = trans.objectStore(TBL.ROUTE);

        let r = store.add(t, 1);
        r.onsuccess = function(e) {
            console.log('bbbbb', e);
        };
        r.onerror = function(e) {
            console.log('ccccc', e);
        }
    }

}

export { DB as default }