const browserFilePath = "cdvfile://localhost/persistent/";

export default {

    writeToFile: function(filename, data, success, fail) {
        this._accessFileForWrite(filename, data, success, fail)
    },

    _accessFileForWrite: function(filename, content, onsuccess, onfail) {
        let instance = this;
        if (cordova.platformId == "browser") {
            window.resolveLocalFileSystemURL(browserFilePath, function(fs) {
                instance.__write(fs, filename, content, onsuccess);
            }, function() {
                var a = Array.prototype.slice.call(arguments);
                a.push(onfail);
                instance._fail.apply(this, a);
            });
        } else {
            window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function(fs) {
                instance.__write(fs, filename, content, onsuccess);
            }, function() {
                var a = Array.prototype.slice.call(arguments);
                a.push(onfail);
                instance._fail.apply(this, a);
            });
        }
    },


    __write: function(fs, fn, data, onsuccess, onfail) {
        let instance = this;
        fs.getFile(fn, { create: true }, function(fe) {
            fe.createWriter(function(writer) {
                writer.onwriteend = function(evt) {
                    if (window && window.f7) {
                        window.f7.addNotification({ message: "Saved" });
                    }
                    if (typeof onsuccess == "function")
                        onsuccess(evt);
                };
                writer.write(new Blob([data], { type: "text/plain" }));

            }, function() {
                var a = Array.prototype.slice.call(arguments);
                a.push(onfail);
                instance._fail.apply(this, a);
            });
        }, function() {
            var a = Array.prototype.slice.call(arguments);
            a.push(onfail);
            instance._fail.apply(this, a);
        });
    },


    readFile: function(filename, success, fail) {
        this._accessFileForRead(filename, success, fail);
    },

    _accessFileForRead: function(filename, onsuccess, onfail) {
        let instance = this;
        if (cordova.platformId == "browser") {
            window.resolveLocalFileSystemURL(browserFilePath, function(fs) {
                instance.__read(fs, filename, onsuccess);
            }, function() {
                var a = Array.prototype.slice.call(arguments);
                a.push(onfail);
                instance._fail.apply(this, a);
            });
        } else {
            window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function(fs) {
                instance.__read(fs, filename, onsuccess);
            }, function() {
                var a = Array.prototype.slice.call(arguments);
                a.push(onfail);
                instance._fail.apply(this, a);
            });
        }
    },

    __read: function(fs, fn, onsuccess, onfail) {
        let instance = this;
        fs.getFile(fn, { create: false }, function(fe) {
            fe.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    // if (window.f7 && window.f7.addNotification)
                    // window.f7.addNotification({ message: evt.target.result });
                    if (typeof onsuccess == 'function')
                        onsuccess(evt);
                };

                reader.readAsText(file);
            }, function() {
                var a = Array.prototype.slice.call(arguments);
                a.push(onfail);
                instance._fail.apply(this, a);
            });
        }, function() {
            var a = Array.prototype.slice.call(arguments);
            a.push(onfail);
            instance._fail.apply(this, a);
        });
    },



    _fail: function() {
        if (window.f7 && window.f7.addNotification) {
            window.f7.addNotification({ message: "Cannot read file " + arguments.message });
        } else
            console.log("Cannot read file: " + arguments);
    },


    deleteLocalFiles: function() {
        this._accessFileForRead(null, function(fileSystem) {
            if (fileSystem.createReader) {
                var reader = fileSystem.createReader();
                reader.readEntries(
                    function(entries) {
                        for (var x = 0; x < entries.length; x++) {
                            if (entries[x].remove) {
                                entries[x].remove(
                                    function() {
                                        // The file has been removed succesfully
                                        console.log("remove bro");
                                    },
                                    function(error) {
                                        // Error deleting the file
                                    },
                                    function() {
                                        // The file doesn't exist
                                    }
                                );
                            }
                        }
                    },
                    function(err) {
                        console.log(err);
                    }
                );
            }
        }, function() {});
    },

    readLocalFiles: function() {
        this._accessFileForList(function(fileSystem) {
            if (fileSystem.createReader) {
                var reader = fileSystem.createReader();
                reader.readEntries(
                    function(entries) {
                        console.log(entries);
                    },
                    function(err) {
                        console.log(err);
                    }
                );
            }
        }, function(e) { console.log('Failed to read directory:', e) });
    },

    _accessFileForList: function(onsuccess, onfail) {
        let instance = this;
        if (cordova.platformId == "browser") {
            window.resolveLocalFileSystemURL(browserFilePath, function(fs) {
                if (typeof onsuccess == "function") onsuccess(fs);
            }, function() {
                var a = Array.prototype.slice.call(arguments);
                a.push(onfail);
                instance._fail.apply(this, a);
            });
        } else {
            window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function(fs) {
                if (typeof onsuccess == "function") onsuccess(fs);
            }, function() {
                var a = Array.prototype.slice.call(arguments);
                a.push(onfail);
                instance._fail.apply(this, a);
            });
        }
    },

};