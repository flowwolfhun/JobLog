Date.prototype.formattedDate = function (pattern) {

    formattedDate = pattern.replace('yyyy', this.getFullYear().toString());

    var MM = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    MM = MM.length > 1 ? MM : '0' + MM;
    formattedDate = formattedDate.replace('MM', MM);

    var dd = this.getDate().toString();
    dd = dd.length > 1 ? dd : '0' + dd;
    formattedDate = formattedDate.replace('dd', dd);

    var hh = this.getHours().toString();
    hh = hh.length > 1 ? hh : '0'+hh;
    formattedDate = formattedDate.replace('hh', hh);

    var mm = this.getMinutes().toString();
    mm = mm.length > 1 ? mm : '0' + mm;
    formattedDate = formattedDate.replace('mm', mm);

    var ss = this.getSeconds().toString();
    ss = ss.length > 1 ? ss : '0' + ss;
    formattedDate = formattedDate.replace('ss', ss);

    return formattedDate;
};

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

Date.prototype.addMonths = function (months) {
    var dat = new Date(this.valueOf());
    dat.setMonth(dat.getMonth() + months);
    return dat;
};

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

Number.prototype.SecondToString = function () {
    var minutes = Math.floor(this / 60); // 7
    var seconds = this % 60; // 30
    
    return minutes+':'+(seconds<10?'0':'')+seconds
};
String.prototype.DateParseFromJson = function () {
    return new Date(parseInt(this.replace("/Date(", "").replace(")/", ""), 10));
};
String.prototype.DateFromJson = function () {
    return new Date(parseInt(this.replace("/Date(", "").replace(")/", ""), 10)).formattedDate('yyyy.MM.dd. hh:mm');
};
String.prototype.DateFromJsonShort = function () {
    return new Date(parseInt(this.replace("/Date(", "").replace(")/", ""), 10)).formattedDate('yyyy.MM.dd.');
};
Number.prototype.ToMoney = function (postfix) {
    postfix = postfix || '';
    var thenum = Math.round(this);
    
    var r1 = thenum.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1 ');
    r1 = r1.substring(0, r1.indexOf('.'));
    return  r1+ ' '+postfix;
};

function NewGuid() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
