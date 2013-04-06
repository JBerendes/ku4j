function clickableSheetFactory() { }
clickableSheetFactory.prototype = {
    createDatesheet: function(dayPoint, localization) {
        return $.datesheet(dayPoint, localization, $.table($.clickableDateSheetTableFactory(dayPoint, localization)));
    },
    createMonthsheet: function(dayPoint, localization) {
        return $.monthsheet(dayPoint, localization, $.table($.clickableMonthSheetTableFactory(dayPoint, localization)));
    },
    createYearsheet: function(dayPoint, localization) {
        return $.yearsheet(dayPoint, localization, $.table($.clickableYearSheetTableFactory(dayPoint, localization)));
    }
}
$.clickableSheetFactory = function(){ return new clickableSheetFactory(); }