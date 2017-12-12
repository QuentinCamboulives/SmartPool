//// Libs //////////////////////////////////////////////////////////////////////////
"use strict"; // Accelere le chargement et montre plus d'erreurs de code
const mraa = require('mraa'); // Version: v1.7.0
var Uln200xa_lib = require('jsupm_uln200xa');// ULN200XA Darlington Motor Driver / Instantiate a ULN2003XA stepper object

//// Sensors ///////////////////////////////////////////////////////////////////////
var luxMeter = new mraa.Aio(0);
var rainSensor = new mraa.Aio(2);
var waterSensor = new mraa.Aio(3);
var fillingPump = new mraa.Gpio(2);
var filteringPump = new mraa.Gpio(3);
var coverMotor = new Uln200xa_lib.ULN200XA(4096, 5, 6, 7, 8);
var chloreMotor = new Uln200xa_lib.ULN200XA(4096, 9, 10, 11, 12);

//// Lux Sensor ////////////////////////////////////////////////////////////////////
exports.getLuxMeter = function()
{
    return (luxMeter.read());
}

//// Rain Sensor //////////////////////////////////////////////////////////////////
exports.getWeather = function()
{
    return (waterSensor.read());
}

//// Water Sensor //////////////////////////////////////////////////////////////////
exports.getWaterLevel = function()
{
    return (rainSensor.read());
}

//// Water Pumps ///////////////////////////////////////////////////////////////////
exports.filtrate = function(choice)
{
    if (choice === true) {
        console.log("--[Filtration] : La filtration est active.");        
	    filteringPump.dir(mraa.DIR_OUT);
    } else if (choice === false) {
        console.log("--[Filtration] : La filtration est éteinte.");
        filteringPump.dir(mraa.DIR_IN);
    }
}

exports.fill = function(choice)
{
    if (choice == true) {
        console.log("--[Pompe] : Mise à niveau de la ligne d'eau.");        
	    fillingPump.dir(mraa.DIR_OUT);
    } else if (choice == false) {
        console.log("--[Pompe] : Arrèt de la mise à niveau de la ligne d'eau.");
	    fillingPump.dir(mraa.DIR_IN);
    }
}

//// Motors ///////////////////////////////////////////////////////////////////////
// Doc:     https://iotdk.intel.com/docs/master/upm/classupm_1_1_u_l_n200_x_a.html
exports.closeCover = function()
{
    console.log("--[Bâche] : Fermeture de la bâche.");
    coverMotor.setSpeed(5);
    coverMotor.setDirection(Uln200xa_lib.ULN200XA_DIR_CW); // Clock Wise
    coverMotor.stepperSteps(15000);
    coverMotor.release();
    console.log("--[Bâche] : Bâche fermée.");
};

exports.openCover = function()
{
    console.log("--[Bâche] : Ouverture de la bâche.");    
    coverMotor.setSpeed(5);
    coverMotor.setDirection(Uln200xa_lib.ULN200XA_DIR_CCW); // Counter Clock Wise
    coverMotor.stepperSteps(15000);
    coverMotor.release();
    console.log("--[Bâche] : Bâche ouverte.");    
};

exports.addChlore = function()
{
    console.log("--[Chlore] : Ajustement du niveau de chlore.");
    chloreMotor.setSpeed(5);
    chloreMotor.setDirection(Uln200xa_lib.ULN200XA_DIR_CCW);
    chloreMotor.stepperSteps(4096);
    chloreMotor.release();
    console.log("--[Chlore] : Niveau de chlore ajusté.");
};