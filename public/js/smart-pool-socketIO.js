var socket = io.connect('http://' + ip + ':8080');

// ----- Connection -------------------------------------
socket.on('connected', function() {
    $("#connected").removeClass("text-warning");
    $("#connected").addClass("text-info");
    $("#connected").text("Connecté au serveur.");
});

// ----- Water Temp -------------------------------------
socket.on('waterTemp', function(value) {
    $("#waterTemp").text(value + "°C");
});

// ----- Period -----------------------------------------
socket.on('period', function(period) {
    if (period === "day") {
        $("#period").removeClass("pe-7s-moon");
        $("#period").addClass("pe-7s-sun");
        $("#periodText").text("Jour.");
    } else if (period === "night") {
        $("#period").removeClass("pe-7s-sun");
        $("#period").addClass("pe-7s-moon");
        $("#periodText").text("Nuit.");
    }
});

// ----- Weather ----------------------------------------
socket.on('weather', function(weather) {
    if (weather === "normal") {
        $("#weather").removeClass("pe-7s-umbrella");
        $("#weather").addClass("pe-7s-leaf");
        $("#weatherText").text("Doux.");
    } else if (weather === "rain") {
        $("#weather").removeClass("pe-7s-leaf");
        $("#weather").addClass("pe-7s-umbrella");
        $("#weatherText").text("Pluvieux.");
    }
});

// ----- Cover -----------------------------------------
$("#coverButton").on('click', function(){
    socket.emit('cover');
});

socket.on('cover', function(value) {
    if(value === true) {
        $("#coverInfo").removeClass("alert-danger");
        $("#coverInfo").addClass("alert-success");
        $("#coverInfo span").text("Ouverte");
        $("#coverButton").removeClass("btn-info");
        $("#coverButton").addClass("btn-warning");
        $("#coverButton span").text("Fermer");
    } else if (value === false) {
        $("#coverInfo").removeClass("alert-success");
        $("#coverInfo").addClass("alert-danger");
        $("#coverInfo span").text("Fermée");
        $("#coverButton").removeClass("btn-warning");
        $("#coverButton").addClass("btn-info");
        $("#coverButton span").text("Ouvrir");
    }
});

// ----- Filtrate --------------------------------------
$("#filtrateButton").on('click', function(){
    socket.emit('filtrate');
});

socket.on('filtrate', function(value) {
    if(value === true) {
        $("#filtrateInfo").removeClass("alert-danger");
        $("#filtrateInfo").addClass("alert-success");
        $("#filtrateInfo span").text("Active");
        $("#filtrateButton").removeClass("btn-info");
        $("#filtrateButton").addClass("btn-warning");
        $("#filtrateButton span").text("Désactiver");
    } else if (value === false) {
        $("#filtrateInfo").removeClass("alert-success");
        $("#filtrateInfo").addClass("alert-danger");
        $("#filtrateInfo span").text("Inactive");
        $("#filtrateButton").removeClass("btn-warning");
        $("#filtrateButton").addClass("btn-info");
        $("#filtrateButton span").text("Activer");
    }
});

// ----- Water Level -----------------------------------
$("#waterLevelButton").on('click', function(){
    socket.emit('waterLevel');
});

socket.on('waterLevel', function(value) {
    if(value === true) {
        $("#waterLevelInfo").removeClass("alert-danger");
        $("#waterLevelInfo").addClass("alert-success");
        $("#waterLevelInfo span").text("Correct");
        $("#waterLevelButton").removeClass("btn-info");
        $("#waterLevelButton").addClass("btn-warning");
        $("#waterLevelButton span").text("Arret");
    } else if (value === false) {
        $("#waterLevelInfo").removeClass("alert-success");
        $("#waterLevelInfo").addClass("alert-danger");
        $("#waterLevelInfo span").text("Bas");
        $("#waterLevelButton").removeClass("btn-warning");
        $("#waterLevelButton").addClass("btn-info");
        $("#waterLevelButton span").text("Ajouter");
    }
});

// ----- Chlore -----------------------------------------
$("#chloreButton").on('click', function(){
    socket.emit('chlore');
});

socket.on('chlore', function(value) {
    if(value === true) {
        $("#chloreInfo").removeClass("alert-danger");
        $("#chloreInfo").addClass("alert-success");
        $("#chloreInfo span").text("Correct");
    } else if (value === false) {
        $("#chloreInfo").removeClass("alert-success");
        $("#chloreInfo").addClass("alert-danger");
        $("#chloreInfo span").text("Insufisant");
    }
});
