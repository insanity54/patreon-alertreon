// deps
var Readable = require('stream').Readable;


// other parts
var detectEnd = require('./detectEnd');
var scrollDown = require('./scrollDown');
var getVisiblePatrons = require('./getVisiblePatrons');
var waitForLoadStart = require('./waitForLoadStart');
var waitForLoadEnd = require('./waitForLoadEnd');
var getPatronCount = require('./getPatronCount');
var getCreatorPage = require('./getCreatorPage');





var rs = new Readable;



// rs._read = function () {
//     if (c >= 'z'.charCodeAt(0)) return rs.push(null);

//     setTimeout(function () {
//         rs.push(String.fromCharCode(++c));
//     }, 100);
// };

rs._read = function() {
    rs.push();
    
    
};

rs.push('beep ');
rs.push('boop\n');
rs.push(null);

rs.pipe(process.stdout);