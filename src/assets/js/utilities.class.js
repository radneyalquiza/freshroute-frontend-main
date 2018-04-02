export default class Utilities {

    parseResponseText(rt) {
        let resultjson = null;
        try {
            resultjson = JSON.parse(rt);
        } catch (e) {}

        return resultjson;
    }

}