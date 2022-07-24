class TalentTreeCommon {
    getParamsFromString(paramString) {
        var stringSplit = paramString.split('?');
        paramString = (stringSplit.length >= 2) ? stringSplit[1] : stringSplit[0];
        var paramStringSplit = paramString.split('&');

        var params = {};

        for (var i = 0; i < paramStringSplit.length; i++) {
            var paramPair = paramStringSplit[i].split('=');
            if (paramPair.length != 2) throw 'Invalid parameter string format';
            params[paramPair[0]] = paramPair[1];
        }

        return params;
    }
}