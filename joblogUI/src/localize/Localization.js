var LocalizedStrings  = require('react-localization');
var Translations = require('./Translations')

var loc = new LocalizedStrings.default(Translations.Translations);
exports.Localize = loc;
//loc.setLanguage('en');