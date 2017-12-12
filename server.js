var SmartPool = require('./SmartPool');
var express = require('express');
var app = module.exports.app = express();
var server = app.listen(8080);
var io = require('socket.io').listen(server);
var ip = require('ip');

app.use(express.static(__dirname + '/public'));

// Route principale de l'app + transmission de l'ip du serveur à la page pour la connection de socket IO
app.get('/', function(req, res){
    res.render('index.ejs', {
        ip: ip.address()
    });
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable.');
});

// Values at server start
var period = "day" // day - night
var weather = "normal"; // normal - rain
var coverIsOpen = false;
var filtrateIsActive = false;
var waterLevelIsGood = false;
var chloreisGood = false;

io.sockets.on('connection', function (socket) {
    // ----- Init Html page --------------------------------------
    io.emit('connected');
    io.emit('period', period);
    io.emit('weather', weather);
    io.emit('cover', coverIsOpen);
    io.emit('filtrate', filtrateIsActive);
    io.emit('waterLevel', waterLevelIsGood);
    io.emit('chlore', chloreisGood);

    function getSensorsValues(){
        if (SmartPool.getLuxMeter() > 800) {
            period = "night";
        } else if (SmartPool.getLuxMeter() < 800) {
            period = "day";
        }
        io.emit('period', period);
        io.emit('waterTemp', Math.floor(Math.random() * (27 - 24)) + 24);        
        setTimeout(getSensorsValues, 2000);
    }
    getSensorsValues();

    // ----- Cover ----------------------------------------------
    socket.on('cover', function(msg) {
        if (coverIsOpen === true) {
            SmartPool.closeCover();
            coverIsOpen = !coverIsOpen;
            io.emit('cover', coverIsOpen);
        } else if (coverIsOpen === false) {
            SmartPool.openCover();
            coverIsOpen = !coverIsOpen;
            io.emit('cover', coverIsOpen);
        }
    });

    // ----- Filtrate -------------------------------------------
    socket.on('filtrate', function(msg) {
        if (filtrateIsActive === true) {
            filtrateIsActive = !filtrateIsActive;
            SmartPool.filtrate(filtrateIsActive);
            io.emit('filtrate', filtrateIsActive);
        } else if (filtrateIsActive === false) {
            filtrateIsActive = !filtrateIsActive;
            SmartPool.filtrate(filtrateIsActive);
            io.emit('filtrate', filtrateIsActive);
        }
    });

    // ----- Water Level ----------------------------------------
    socket.on('waterLevel', function(msg) {
        if (waterLevelIsGood === true) {
            waterLevelIsGood = !waterLevelIsGood;
            SmartPool.fill(waterLevelIsGood);
            io.emit('waterLevel', waterLevelIsGood);
        } else if (waterLevelIsGood === false) {
            waterLevelIsGood = !waterLevelIsGood;
            SmartPool.fill(waterLevelIsGood);
            io.emit('waterLevel', waterLevelIsGood);
        }
    });

    // ----- Chlore ----------------------------------------
    socket.on('chlore', function(msg) {
        if (chloreisGood === true) {
            SmartPool.addChlore();
            chloreisGood = !chloreisGood;
            io.emit('chlore', chloreisGood);
        } else if (chloreisGood === false) {
            SmartPool.addChlore();
            chloreisGood = !chloreisGood;
            io.emit('chlore', chloreisGood);
        }
    });
});

// Fermeture de la bâche et extinxion des pompes à l'arret du serveur
process.on('SIGINT', function() {
    if (coverIsOpen === true)
        SmartPool.closeCover();
    if (filtrateIsActive === true)
        SmartPool.filtrate(false);
    if (waterLevelIsGood === true)
        SmartPool.fill(false);
    console.log("\n--------------------------------------------------------\n\nServer stoped, see you soon on SmartPool System.");
    process.exit();
});

console.log("\nEverything is good, server is running.\nVisit " + ip.address() + ":8080 to use the app.\n\nActions:\n--------------------------------------------------------");