import {Font,BinarySensor,NumericSensor,UI,TextAlign,id,COLOR_ON, Bitmap} from './lib';

// mock the fonts registered in esphome, use the variable name as id
const arial : Font = "20px Arial"
const my_font : Font = "11px Arial"

// mock the sensor values / variables  registered in esphome, use the variable name as id
// the label and default state are only used in the mock gui.
const mainswitch = new BinarySensor("Switch On/Off", true);
const battery = new NumericSensor("Battery %", 45);
const wifi = new NumericSensor("Wifi Rssi", -65);
const temperature = new NumericSensor("Temperature", 22);
const humidity = new NumericSensor("Humidity", 45);

// initialize the gui, set the screen size
let ui = new UI(document.getElementById("root"), 296, 128 );

// add controls for the sensors to the mock gui
ui.registerSensor(mainswitch);
ui.registerSensor(battery);
ui.registerSensor(wifi);
ui.registerSensor(temperature);
ui.registerSensor(humidity);

// this is the render loop. Enter the code for the esphome display lambda function here.
ui.registerRenderLoop( it => {
    // custom code starts here

    it.clear();

    it.print(it.get_width()/2,4,id(my_font),TextAlign.CENTER,"Hello World!");
    if (id(mainswitch).state) {
        it.filled_circle(it.get_width() / 2, it.get_height() / 2, 20);
    }
    it.horizontal_line(6,it.get_height()/2,it.get_width()/2-30);
    it.horizontal_line(it.get_width()/2+24,it.get_height()/2,it.get_width()/2-28);
    it.rectangle(3,it.get_height()/2-30,it.get_width()-6,60,COLOR_ON);
    it.printf(3, 110, id(my_font),TextAlign.LEFT, "Temperature: %.1f°C, Humidity: %.1f%%", id(temperature).state, id(humidity).state);
   
    // battery state
    it.printf(it.get_width()-26,2,id(my_font),TextAlign.RIGHT,"%d%%", id(battery).state);
    it.rectangle(it.get_width() - 22,  2, 19, 10, COLOR_ON);
    it.filled_rectangle(it.get_width() - 2,  4, 2, 6,COLOR_ON);
    it.filled_rectangle(it.get_width() - 20,  4, 16 * id(battery).state / 100, 6, COLOR_ON);

    // wifi
    // Note: Not all syntax is equivalent between C<->Typescript
    // replace the int with var in the loops and reverse
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 2 * (i + 1); j++) {
            if (id(wifi).state/-1.2 > i * 25 || j == 0) {
                it.draw_pixel_at(5 + 2 * i, 10 - j, COLOR_ON);
            }
        }
    }


});


// render the ui
ui.run();


