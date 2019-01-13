const SerialPort = require("serialport");
const Readline = require('@serialport/parser-readline');
const gpio = require("gpio");
var Lcd = require('lcd'),
    lcd = new Lcd({
        rs: 12,
        e: 21,
        data: [5, 6, 17, 18],
        cols: 8,
        rows: 2
    });
var fs = require("fs");
var Client = require('ftp');
process.stdin.resume();
var c = new Client();
c.connect({
    user: '',
    password: '',
    host: '',
    port: 21
});

var alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");

var letter = 0;
var message = "";

var liner = gpio.export(27, {
    direction: gpio.DIRECTION.IN,
    ready: function () {}
});

var sender = gpio.export(22, {
    direction: gpio.DIRECTION.IN,

    ready: function () {}
});

var arduino = gpio.export(23, {
    direction: gpio.DIRECTION.OUT,

    ready: function () {}
});


const port = new SerialPort('/dev/ttyAMA0', {
    baudRate: 9600
});
const parser = port.pipe(new Readline({
    delimiter: '\n'
}));

parser.on('data', data => {
    changingLetter(data.substring(0, data.length - 1));
});



function changingLetter(lett) {
    var  let = "";
    var time = 39;

    if (lett == 0) let = " ";
    else if (lett > 0 && lett <= time * 1) let = alphabet[0];
    else if (lett > time * 1 && lett <= time * 2) let = alphabet[1];
    else if (lett > time * 2 && lett <= time * 3) let = alphabet[2];
    else if (lett > time * 3 && lett <= time * 4) let = alphabet[3];
    else if (lett > time * 4 && lett <= time * 5) let = alphabet[4];
    else if (lett > time * 5 && lett <= time * 6) let = alphabet[5];
    else if (lett > time * 6 && lett <= time * 7) let = alphabet[6];
    else if (lett > time * 7 && lett <= time * 8) let = alphabet[7];
    else if (lett > time * 8 && lett <= time * 9) let = alphabet[8];
    else if (lett > time * 9 && lett <= time * 10) let = alphabet[9];
    else if (lett > time * 10 && lett <= time * 11) let = alphabet[10];
    else if (lett > time * 11 && lett <= time * 12) let = alphabet[11];
    else if (lett > time * 12 && lett <= time * 13) let = alphabet[12];
    else if (lett > time * 13 && lett <= time * 14) let = alphabet[13];
    else if (lett > time * 14 && lett <= time * 15) let = alphabet[14];
    else if (lett > time * 15 && lett <= time * 16) let = alphabet[15];
    else if (lett > time * 16 && lett <= time * 17) let = alphabet[16];
    else if (lett > time * 16 && lett <= time * 17) let = alphabet[17];
    else if (lett > time * 17 && lett <= time * 18) let = alphabet[18];
    else if (lett > time * 18 && lett <= time * 19) let = alphabet[19];
    else if (lett > time * 19 && lett <= time * 20) let = alphabet[20];
    else if (lett > time * 20 && lett <= time * 21) let = alphabet[21];
    else if (lett > time * 21 && lett <= time * 22) let = alphabet[22];
    else if (lett > time * 22 && lett <= time * 23) let = alphabet[23];
    else if (lett > time * 23 && lett <= time * 24) let = alphabet[24];
    else if (lett > time * 24 && lett <= time * 25) let = alphabet[25];
    else if (lett > time * 25 && lett <= time * 26) let = alphabet[26];
    else let = "*";

    letter =
        let;
    lcd.clear();

    lcd.setCursor(0, 0); // col 0, row 0
    lcd.print(let.toString()); // print time
    lcd.once('printed', function () {
        lcd.setCursor(0, 1); // col 0, row 1
        lcd.print(message); // print date

    });
}

liner.on("change", function (val) {
    if (val == 0) {
        message = message + letter;
    }
});

sender.on("change", function (val) {
    if (val == 0) {
        lcd.clear();
        var fname = "file-" + Math.floor(Math.random() * 100000) + ".txt";
        var writerS = fs.createWriteStream(fname);
        writerS.write(message, 'UTF8');
        writerS.end();


        writerS.on('finish', function () {
            c.put(fname, fname, function (err) {
                if (err) throw err;
                c.end();
            });

            lcd.setCursor(0, 0); // col 0, row 0
            lcd.print("Uploaded"); // print time
            lcd.once('printed', function () {
                lcd.setCursor(0, 1); // col 0, row 1
                lcd.print(fname); // print date 
            });
        });

        writerS.on('error', function (err) {
            console.log(err.stack);
        });

        message = "";
        letter = "";

    }
});
lcd.on('ready', function () {

  
});
process.on('SIGINT', function () { 
    arduino.unexport();
    lcd.clear();
    lcd.close();
    process.exit();
});
 