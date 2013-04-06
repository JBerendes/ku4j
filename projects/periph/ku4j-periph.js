(function($){
if(!$) $ = {};
var keyboard_Map = $.hash({
    1: "MOUSE_LEFT",
    2: "",
    3: "MOUSE_RIGHT",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "BACKSPACE",
    9: "TAB",
    10: "",
    11: "",
    12: "",
    13: "ENTER",
    14: "",
    15: "",
    16: "SHIFT",
    17: "CTRL",
    18: "ALT",
    19: "",
    20: "CAPS",
    21: "",
    22: "",
    23: "",
    24: "",
    25: "",
    26: "",
    27: "ESC",
    28: "",
    29: "",
    30: "",
    31: "",
    32: "SPACE",
    33: "PAGEUP", 
    34: "PAGEDOWN",
    35: "END",
    36: "HOME",
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
    41: ")",
    42: "*",
    43: "+",
    44: ",",
    45: "-",
    46: ".",
    47: "/",
    48: "0", 
    49: "1", 
    50: "2", 
    51: "3", 
    52: "4", 
    53: "5", 
    54: "6", 
    55: "7", 
    56: "8", 
    57: "9", 
    58: ":",
    59: ";", 
    60: "<",
    61: "=", 
    62: ">",
    63: "?",
    64: "@",
    65: "a", 
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    91: "[",
    92: "\\",
    93: "]",
    94: "^",
    95: "_",
    96: "0", 
    97: "1", 
    98: "2",
    99: "3",
    100: "4",
    101: "5", 
    102: "6",
    103: "7", 
    104: "8", 
    105: "9", 
    106: "*", 
    107: "=", 
    108: "l", 
    109: "-",
    110: "n", 
    111: "o", 
    112: "p",
    113: "F2", 
    114: "F3", 
    115: "F4", 
    116: "F5", 
    117: "F6", 
    118: "F7",
    119: "F8", 
    120: "F9", 
    121: "F10", 
    122: "F11",  
    123: "F12",
    124: "|",
    125: "}",
    126: "~",
    127: "",
    128: "",
    129: "",
    130: "",
    131: "",
    132: "",
    133: "",
    134: "",
    135: "",
    136: "",
    137: "",
    138: "",
    139: "",
    140: "",
    141: "",
    142: "",
    143: "",
    144: "",
    145: "",
    146: "",
    147: "",
    148: "",
    149: "",
    150: "",
    151: "",
    152: "",
    153: "",
    154: "",
    155: "",
    156: "",
    157: "",
    158: "",
    159: "",
    160: "",
    161: "",
    162: "",
    163: "",
    164: "",
    165: "",
    166: "",
    167: "",
    168: "",
    169: "",
    170: "",
    171: "",
    172: "",
    173: "",
    174: "",
    175: "",
    176: "",
    177: "",
    178: "",
    179: "",
    180: "",
    181: "",
    182: "",
    183: "",
    184: "",
    185: "",
    186: "",
    187: "",
    188: ",",
    189: "",
    190: ".",
    191: "/",
    192: "`",
    193: "",
    194: "",
    195: "",
    196: "",
    197: "",
    198: "",
    199: "",
    200: "",
    201: "",
    202: "",
    203: "",
    204: "",
    205: "",
    206: "",
    207: "",
    208: "",
    209: "",
    210: "",
    211: "",
    212: "",
    213: "",
    214: "",
    215: "",
    216: "",
    217: "",
    218: "",
    219: "[", 
    220: "\\", 
    221: "]",
    222: "",
    223: "",
    224: "",
    225: "",
    226: "",
    227: "",
    228: "",
    229: "",
    230: "",
    231: "",
    232: "",
    233: "",
    234: "",
    235: "",
    236: "",
    237: "",
    238: "",
    239: "",
    240: "",
    241: "",
    242: "",
    243: "",
    244: "",
    245: "",
    246: "",
    247: "",
    248: "",
    249: "",
    250: "",
    251: "",
    252: "",
    253: "",
    254: "",
    255: ""
});

function keyboard(){
    this._hotKeys = $.hash();
    this._map = $.hash(keyboard_Map);
}
keyboard.prototype = {
    map: function(map){ return this.set("map", map);s },
    findCode: function(symbol){
        var key = this._map.findKey(symbol),
            code = parseInt(key);

        return isNaN(code) ? null : code;
    },
    findKey: function(code) { return this._map.findValue(code); }
}
$.ext(keyboard, $.Class);
var keyboard_instance = new keyboard();
$.keyboard = function(){ return keyboard_instance; }

function mouse(){ }
mouse.prototype = {
    from: function(e){
        return ($.exists(e.relatedTarget)) ? e.relatedTarget : e.fromElement;
    },
    target: function(e) {
        return (e.srcElement) ? e.srcElement : e.target;
    },
    clientCoord: function(e) {
        if (!$.exists(e.clientX)) return null;
        return new $.coord(e.clientX, e.clientY);
    },
    documentCoord: function(e) {
        if ($.exists(this.pageCoord(e))) return this.pageCoord(e);
        var d = document.documentElement;
        return new $.coord(e.clientX + d.scrollLeft, e.clientY + d.scrollTop);
    },
    pageCoord: function(e) {
        if (!$.exists(e.pageX)) return null;
        return new $.coord(e.pageX, e.pageY);
    },
    screenCoord: function(e) {
        return new $.coord(e.screenX, e.screenY);
    },
    selection: function(){
        if ($.exists(window.getSelection)) return window.getSelection();
        if ($.exists(document.getSelection)) return document.getSelection();
        if ($.exists(document.selection) &&
            $.exists(document.selection.createRange))
                return document.selection.createRange().text;

        if ($.exists(document.activeElement) &&
            $.exists(document.activeElement.selectionStart)) {

            var start = document.activeElement.selectionStart,
                end = document.activeElement.selectionEnd;

            return document.activeElement.value.substring(start, end);
        }
        return null;
    },
    clearSelection: function(){
        var selection = this.selection();
        try{ selection.removeAllRanges(); }
        catch(e){ selection.empty(); }
        return this;
    }
}
$.ext(mouse, $.Class);
var mouse_instance = new mouse();
$.mouse = function(){ return mouse_instance; }

function touch(){ }
touch.prototype = {
    canRead: function(e){ return $.exists(e.touches); },
    from: function(e){
        var t = e.touches[0];
        return ($.exists(t.relatedTarget)) ? t.relatedTarget : t.fromElement;
    },
    target: function(e) {
        var t = e.touches[0];
        return (t.srcElement) ? t.srcElement : t.target;
    },
    clientCoord: function(e) {
        var t = e.touches[0];
        if (!$.exists(t.clientX)) return null;
        return new $.coord(t.clientX, t.clientY);
    },
    documentCoord: function(e) {
        var t = e.touches[0];
        if ($.exists(this.pageCoord(e))) return this.pageCoord(e);
        var d = document.documentElement;
        return new $.coord(t.clientX + d.scrollLeft, t.clientY + d.scrollTop);
    },
    pageCoord: function(e) {
        var t = e.touches[0];
        if (!$.exists(t.pageX)) return null;
        return new $.coord(t.pageX, t.pageY);
    },
    screenCoord: function(e) {
        var t = e.touches[0];
        return new $.coord(t.screenX, t.screenY);
    },
    selection: function(){
        if ($.exists(window.getSelection)) return window.getSelection();
        if ($.exists(document.getSelection)) return document.getSelection();
        if ($.exists(document.selection) &&
            $.exists(document.selection.createRange))
                return document.selection.createRange().text;

        if ($.exists(document.activeElement) &&
            $.exists(document.activeElement.selectionStart)) {

            var start = document.activeElement.selectionStart,
                end = document.activeElement.selectionEnd;

            return document.activeElement.value.substring(start, end);
        }
        return null;
    },
    clearSelection: function(){
        var selection = this.selection();
        try{ selection.removeAllRanges(); }
        catch(e){ selection.empty(); }
        return this;
    }
}
$.ext(touch, $.Class);
var touch_instance = new touch();
$.touch = function(){ return touch_instance; }

})($);
