# DrawMock for ESPHome

This is an early attempt to mock the display module of ESPHome so that designs can be tested before flashing.
We use a web development stack using live-reload so that changes in the drawing code are immediately rendered in a browser window. 

The library provides a stub implementation of the display module and the sensor module in Typescript. Since C and JavaScript's syntax is quite similar, most code can be copied without major changes. See the [main.ts](./main.ts) file for an example.

## Usage

[Main.ts](./main.ts) contains your custom drawing code. You will need to modify the source code directly using a text editor (e.g., vscode). The snowpack bundler, launched through ``npm run start``,  will live-reload the browser window to sync any changes. Create your fonts, bitmaps, and sensors, and then provide your drawing lambda.

**Note**: Not all syntax is equivalent between C<->Typescript. You will need to adapt variable declarations to use var instead of int/str/... (especially in loops) and modify any enums from TextAlign::LEFT  to TextAlign.LEFT and vice versa. The code shown in the GUI has some of these transformations applied automatically.


## Installation


* Install nodejs and clone this repository
* run ``npm install`` in the project folder
* run ``npm run start`` in the project folder and wait for the browser window to open
* Changes to [main.ts](./main.ts) should then be immediately rendered in the browser window.
