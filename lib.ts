import h from 'hyperscript';
import {sprintf} from 'printj';

/* glue code */
export type Font = string;
export type Color = string;

export enum TextAlign {
    LEFT = "left" ,
    RIGHT = "right",	
    CENTER = "center",
}

export class Bitmap {
    public img = new Image;
    constructor( src : string) {
        this.img.src = src;
    }
}

export class Gfx {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor(canvas: HTMLCanvasElement, width = 296, height = 128) {


        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;

        canvas.height = this.height;
        canvas.width = this.width;
        canvas.style.height = this.height + "px";
        canvas.style.width = this.width + "px";

        this.ctx.textBaseline = "top"; 
    }

  

    public print(x : number, y: number, font : Font, align : TextAlign , text : string) {
        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }

    
    public printf(x : number, y: number, font : Font,align : TextAlign, text : string, ...args) {
        this.print(x,y,font,align,sprintf(text,...args))
    }

    public fill(color : Color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    public clear () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    public draw_pixel_at(x : number, y : number, color : Color) {
        this.ctx.fillRect(x, y, 1, 1);
    }

    public rectangle(x1: number, y1: number, width: number, height: number, color : Color ) {
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(x1, y1, width, height);
    }
    public filled_rectangle(x1: number, y1: number, width: number, height: number, color : Color ) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x1, y1, width, height);
    }

    public image(x : number, y : number, image : Bitmap) {
      this.ctx.drawImage(image.img,x,y);
    }

    public line(x1: number, y1: number, x2: number, y2: number, color : Color ) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    public horizontal_line (x : number, y : number, width : number,  color : Color =COLOR_ON) {
        this.line(x,y,x+width,y, color)
    }

    public verical_line (x : number, y : number, height : number,  color : Color =COLOR_ON) {
        this.line(x,y,x,y + height, color)
    }

    public circle (centerX : number, centerY : number, radius : number,  color : Color = COLOR_ON) {
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        this.ctx.strokeStyle = color;
        this.ctx.stroke()
    }
  
    public filled_circle (centerX : number, centerY : number, radius : number,  color : Color = COLOR_ON) {
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
    


    public get_width() : number {
        return this.width
    }

    public get_height() : number {
        return this.height
    }

}

export class Sensor<T> {
    constructor(public name : string, public state : T = undefined) {
    }
}



export class BinarySensor extends Sensor<boolean> {}
export class NumericSensor extends Sensor<number> {}



export class UI {
    sensors : Sensor<any>[] = [];
    renderLoop : (i : Gfx) => void;
    gfx : Gfx;

    constructor(private rootElement : HTMLElement, height : number = 296, width : number = 128) {
        let canvas = rootElement.appendChild(document.createElement("canvas"));
        this.gfx = new Gfx(canvas, height,width);
    }

    public registerSensor(sensor : Sensor<any>) {
        this.sensors.push(sensor)
    }
    public registerRenderLoop( loop : (i : Gfx) => void) {
        this.renderLoop = loop;
        
    }

    public getCode() : string{
        let code = this.renderLoop.toString();

        // remove first and last line
        code = code.substring(code.indexOf("\n") + 1);
        code = code.substring(code.lastIndexOf("\n") + 1, -1 )
        // fix text enum
        code = code.replace(/TextAlign\./g,"TextAlign::");
        // fix loop vars
        code = code.replace(/for \(var/g,"for (int");
        return code;

    }

    public run() {
        let mockSensors = h("div",{className:'controls'},
        h("h2","Mock Sensors"),
        h("p",h("small","Sensors registered via ui.registerSensor can be adjusted below.")),
        h("dl", 
        this.sensors.map( s => {
            
            if(s instanceof BinarySensor) {
                return [
                    h("dt",s.name,": "),
                    h("dd",h("input", { type : "checkbox", oninput : 
                    (e : InputEvent) => {
                        s.state = (e.target as HTMLInputElement).checked
                    }, checked : s.state}))
                ];
            } else if (s instanceof NumericSensor) {
                return [
                    h("dt",s.name,": "),
                    h("dd",h("input", { type : "number", oninput : 
                    (e : InputEvent) => {
                        s.state = parseFloat((e.target as HTMLInputElement).value)
                    }, value : s.state}))
                ]
            }
        })));


        let code = h("div",{className:'controls'},
        h("h2","Formatted Code"),
        h("p",h("small","The code below can be copied. Minor syntax fixes from JS to C were applied.")),
        h("textarea",{readOnly:true}, this.getCode())
        )
        
       

        this.rootElement.appendChild(mockSensors);
        this.rootElement.appendChild(code);


        this.run_loop()
    }

    public run_loop(){
        this.renderLoop(this.gfx);
        window.setTimeout(this.run_loop.bind(this),500);
    }
}

export function id<T>(el : T) : T {return el;}

export const COLOR_OFF = "white"
export const COLOR_ON = "black"