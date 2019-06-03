// Add your code here

//% color="#AA278D" height=100 icon="\uf062" block="NaturalScience"
namespace NaturalScience {
    /**
    * TCS34725:颜色识别传感器相关寄存器变量定义
    */
    let TCS34725_ADDRESS = 0x29;
    let REG_TCS34725_ID = 0x12;
    let REG_TCS34725_COMMAND_BIT = 0x80;
    let REG_TCS34725_ENABLE = 0X00;
    let REG_TCS34725_ATIME = 0X01
    let REG_TCS34725_GAIN = 0x0F
    let REG_CLEAR_CHANNEL_L = 0X14;
    let REG_RED_CHANNEL_L = 0X16;
    let REG_GREEN_CHANNEL_L = 0X18;
    let REG_BLUE_CHANNEL_L = 0X1A;

    let TCS34275_POWER_ON = 0X01
    let TCS34725_ENABLE_AEN = 0X02
    let TCS34725_RGBC_C = 0;
    let TCS34725_RGBC_R = 0;
    let TCS34725_RGBC_G = 0;
    let TCS34725_RGBC_B = 0;
    let TCS34725_BEGIN = 0;
    let TCS34725_ENABLE_AIEN = 0X10;
    enum TCS34275_ENABLE {
        POWER_ON = 0x01,
        POWER_OFF = 0x00,
        RGBC_ENABLE = 0X01,
        RGBC_DISABLE = 0X00
    }
    enum TCS34725IntegrationTime_t {
        TCS34725_INTEGRATIONTIME_2_4MS = 0xFF,
        TCS34725_INTEGRATIONTIME_24MS = 0xF6,
        TCS34725_INTEGRATIONTIME_50MS = 0xEB,
        TCS34725_INTEGRATIONTIME_101MS = 0xD5,
        TCS34725_INTEGRATIONTIME_154MS = 0xC0,
        TCS34725_INTEGRATIONTIME_700MS = 0x00
    }
    enum TCS34725Gain_t {
        TCS34725_GAIN_1X = 0x00,
        TCS34725_GAIN_4X = 0x01,
        TCS34725_GAIN_16X = 0x02,
        TCS34725_GAIN_60X = 0x03
    }


    function getInt8LE(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.Int8LE);
    }

    function getUInt16LE(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(TCS34725_ADDRESS, NumberFormat.UInt16LE);
    }

    function getInt16LE(addr:number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.Int16LE);
    }

    /**
     * TCS34725 Color Sensor Init
     */
    function tcs34725_begin(): boolean {
        TCS34725_BEGIN = 0;
        let id = readReg(TCS34725_ADDRESS, REG_TCS34725_ID | REG_TCS34725_COMMAND_BIT);
        if ((id != 0x44) && (id != 0x10)) return false;
        TCS34725_BEGIN = 1;
        writeReg(TCS34725_ADDRESS, REG_TCS34725_ATIME | REG_TCS34725_COMMAND_BIT, 0xEB);
        writeReg(TCS34725_ADDRESS, REG_TCS34725_GAIN | REG_TCS34725_COMMAND_BIT, 0x01);
        writeReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE | REG_TCS34725_COMMAND_BIT, 0x01);
        basic.pause(3);
        writeReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE | REG_TCS34725_COMMAND_BIT, 0x01 | 0x02);
        return true;
    }

    function getRGBC() {
        if (!TCS34725_BEGIN) tcs34725_begin();
        /**
         * TCS34725_RGBC_C = getUInt16LE(REG_CLEAR_CHANNEL_L);
                TCS34725_RGBC_R = getUInt16LE(REG_RED_CHANNEL_L);
                TCS34725_RGBC_G = getUInt16LE(REG_RED_CHANNEL_L);
                TCS34725_RGBC_B = getUInt16LE(REG_BLUE_CHANNEL_L);
                basic.pause(50);
                tcs34725_lock();
        
         */

        TCS34725_RGBC_C = getUInt16LE(TCS34725_ADDRESS, 0x14 | REG_TCS34725_COMMAND_BIT);
        TCS34725_RGBC_R = getUInt16LE(TCS34725_ADDRESS, 0x16 | REG_TCS34725_COMMAND_BIT);
        TCS34725_RGBC_G = getUInt16LE(TCS34725_ADDRESS, 0x18 | REG_TCS34725_COMMAND_BIT);
        TCS34725_RGBC_B = getUInt16LE(TCS34725_ADDRESS, 0x1A | REG_TCS34725_COMMAND_BIT);

        basic.pause(50);
        let ret = readReg(TCS34725_ADDRESS, 0 | REG_TCS34725_COMMAND_BIT)
        ret |= 0x10;
        writeReg(TCS34725_ADDRESS, 0 | REG_TCS34725_COMMAND_BIT, ret)
    }

    //% block="Get red"
    //% weight=80 
    //% subcategory="Color & Light"
    export function getRed(): number {
        getRGBC();
        return TCS34725_RGBC_R;
    }

    //% block="Get green"
    //% weight=79 
    //% subcategory="Color & Light"
    export function getGreen(): number {
        getRGBC();
        return TCS34725_RGBC_G;
    }

    //% block="Get blue"
    //% weight=78 
    //% subcategory="Color & Light"
    export function getBlue(): number {
        getRGBC();
        return TCS34725_RGBC_B;
    }

    //% block="Get C"
    //% weight=77 
    //% subcategory="Color & Light"
    export function getC(): number {
        getRGBC();
        return TCS34725_RGBC_C;
    }

    /**
     * STM32
     */
    
    let STM32_ADDRESS = 0X10;
    let STM32_PID = 0X01;
    let REG_STM32_VID = 0X02;
    let REG_SEM32_LED_CONTROL = 0X03;
    let REG_STM32_K_INTEGER = 0X04;
    let REG_SEM32_K_DECIMAL = 0X05;
    let REG_STM32_TDS_H = 0X06;
    let REG_SEM32_TDS_L = 0X07;
    let REG_SEM32_NOISE_H = 0X08;
    let REG_STM32_NOISE_L = 0X09;
    let REG_STM32_UV_H = 0X0A;
    let REG_SEM32_UV_L = 0X0B;

    export enum STM32_LED_STATUS {
        ON = 0X01,
        OFF = 0X00
    }


    function readReg(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
    }

    function writeReg(addr: number, reg: number, dat: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(addr, buf)
    }


    //% block="Get Reg_data"
    //% weight=70
    //% subcategory="STM32"
    export function getData(): number {
        let ret = readReg(STM32_ADDRESS, STM32_PID);
        return ret;
    }

    //% block="set Led %parms"
    //% weight=71
    //% subcategory="STM32"
    export function setLed(parms: STM32_LED_STATUS) {
        writeReg(STM32_ADDRESS, REG_SEM32_LED_CONTROL, parms)
    }

    //% block="get K"
    //% weight=71
    //% subcategory="STM32"
    export function getK(): string {
        let ret1 = readReg(STM32_ADDRESS, REG_STM32_K_INTEGER);
        let ret2 = readReg(STM32_ADDRESS, REG_SEM32_K_DECIMAL);
        let str = ".";
        str = ret1 + str + ret2;
        return str;
    }

    //% block="get UV"
    //% weight=71
    //% subcategory="STM32"
    export function getUV(): number {
        let ret1 = readReg(STM32_ADDRESS, REG_STM32_UV_H);
        let ret2 = readReg(STM32_ADDRESS, REG_SEM32_UV_L);
        return (ret1 << 8) | ret2;
    }

    //% block="get TDS"
    //% weight=71
    //% subcategory="STM32"
    export function getTDS(): number {
        let ret1 = readReg(STM32_ADDRESS, REG_SEM32_TDS_L);
        let ret2 = readReg(STM32_ADDRESS, REG_SEM32_TDS_L);
        return (ret1 << 8) | ret2;
    }

    //% block="get noise"
    //% weight=71
    //% subcategory="STM32"
    export function getNoise(): number {
        let ret1 = readReg(STM32_ADDRESS, REG_SEM32_NOISE_H);
        let ret2 = readReg(STM32_ADDRESS, REG_STM32_NOISE_L);
        return (ret1 << 8) | ret2;
    }

    //% block="get zero"
    //% weight=71
    //% subcategory="STM32"
    export function getNoise1(): string {
        let ret1 = 0;
        let ret2 = 0;
        let str = "."
        str = ret1 + str + ret2;
        return str;
    }
    //% block="get float"
    //% weight=71
    //% subcategory="STM32"
    export function getNoise2(): number {
        let ret1 = 100;
        let ret2 = 25;
        let str = ".";
        str = ret1 + str + ret2;
        let ret = parseFloat(str);
        return ret;
    }

    /**
     * BME280
     */
    let BME280_I2C_ADDR = 0x76;

    let dig_T1 = getUInt16LE(BME280_I2C_ADDR, 0x88)
    let dig_T2 = getInt16LE(BME280_I2C_ADDR, 0x8A)
    let dig_T3 = getInt16LE(BME280_I2C_ADDR, 0x8C)
    let dig_P1 = getUInt16LE(BME280_I2C_ADDR, 0x8E)
    let dig_P2 = getInt16LE(BME280_I2C_ADDR, 0x90)
    let dig_P3 = getInt16LE(BME280_I2C_ADDR, 0x92)
    let dig_P4 = getInt16LE(BME280_I2C_ADDR, 0x94)
    let dig_P5 = getInt16LE(BME280_I2C_ADDR, 0x96)
    let dig_P6 = getInt16LE(BME280_I2C_ADDR, 0x98)
    let dig_P7 = getInt16LE(BME280_I2C_ADDR, 0x9A)
    let dig_P8 = getInt16LE(BME280_I2C_ADDR, 0x9C)
    let dig_P9 = getInt16LE(BME280_I2C_ADDR, 0x9E)
    let dig_H1 = readReg(BME280_I2C_ADDR, 0xA1)
    let dig_H2 = getInt16LE(BME280_I2C_ADDR, 0xE1)
    let dig_H3 = readReg(BME280_I2C_ADDR, 0xE3)
    let a = readReg(BME280_I2C_ADDR, 0xE5)
    let dig_H4 = (readReg(BME280_I2C_ADDR, 0xE4) << 4) + (a % 16)
    let dig_H5 = (readReg(BME280_I2C_ADDR, 0xE6) << 4) + (a >> 4)
    let dig_H6 = getInt8LE(BME280_I2C_ADDR, 0xE7)
    writeReg(BME280_I2C_ADDR, 0xF2, 0x04)
    writeReg(BME280_I2C_ADDR, 0xF4, 0x2F)
    writeReg(BME280_I2C_ADDR, 0xF5, 0x0C)
    let T = 0
    let P = 0
    let H = 0
    let POWER_ON = 0

    function get(): void {
        let adc_T = (readReg(BME280_I2C_ADDR, 0xFA) << 12) + (readReg(BME280_I2C_ADDR, 0xFB) << 4) + (readReg(BME280_I2C_ADDR, 0xFC) >> 4)
        let var1 = (((adc_T >> 3) - (dig_T1 << 1)) * dig_T2) >> 11
        let var2 = (((((adc_T >> 4) - dig_T1) * ((adc_T >> 4) - dig_T1)) >> 12) * dig_T3) >> 14
        let t = var1 + var2
        T = ((t * 5 + 128) >> 8) / 100
        var1 = (t >> 1) - 64000
        var2 = (((var1 >> 2) * (var1 >> 2)) >> 11) * dig_P6
        var2 = var2 + ((var1 * dig_P5) << 1)
        var2 = (var2 >> 2) + (dig_P4 << 16)
        var1 = (((dig_P3 * ((var1 >> 2) * (var1 >> 2)) >> 13) >> 3) + (((dig_P2) * var1) >> 1)) >> 18
        var1 = ((32768 + var1) * dig_P1) >> 15
        if (var1 == 0)
            return; // avoid exception caused by division by zero
        let adc_P = (readReg(BME280_I2C_ADDR, 0xF7) << 12) + (readReg(BME280_I2C_ADDR, 0xF8) << 4) + (readReg(BME280_I2C_ADDR, 0xF9) >> 4)
        let _p = ((1048576 - adc_P) - (var2 >> 12)) * 3125
        _p = (_p / var1) * 2;
        var1 = (dig_P9 * (((_p >> 3) * (_p >> 3)) >> 13)) >> 12
        var2 = (((_p >> 2)) * dig_P8) >> 13
        P = _p + ((var1 + var2 + dig_P7) >> 4)
        let adc_H = (readReg(BME280_I2C_ADDR, 0xFD) << 8) + readReg(BME280_I2C_ADDR, 0xFE)
        var1 = t - 76800
        var2 = (((adc_H << 14) - (dig_H4 << 20) - (dig_H5 * var1)) + 16384) >> 15
        var1 = var2 * (((((((var1 * dig_H6) >> 10) * (((var1 * dig_H3) >> 11) + 32768)) >> 10) + 2097152) * dig_H2 + 8192) >> 14)
        var2 = var1 - (((((var1 >> 15) * (var1 >> 15)) >> 7) * dig_H1) >> 4)
        if (var2 < 0) var2 = 0
        if (var2 > 419430400) var2 = 419430400
        H = (var2 >> 12) / 1024
    }

    function powerOn() {
        writeReg(BME280_I2C_ADDR, 0xF4, 0x2F)
        POWER_ON = 1
    }

    export enum BME280Data {
        //% block="Pressure"
        Pressure,
        //% block="Temperature"
        Temperature,
        //% block="Humidity"
        Humidity
    }
    
    //% block="get %data"
    //% weight=80
    //% subcategory="BMP280"
    export function readBME280Data(data: BME280Data): number {
        if (POWER_ON != 1) {
            powerOn()
        }
        get();
        switch (data) {
            case 0: return P;
            case 1: return T;
            case 2: return H;
            default: return 0;
        }
    }

    /**
     * OLED
     */
    //% blockId=oled_show_text
    //% weight=99
    //% line.min=0 line.max=7
    //% text.defl="DFRobot"
    //% block="OLED show line %line|text %text"
    //% shim=OLED::showText
    //% subcategory="OLED"
    export function showUserText(line: number, text: string): void {
        return;
    }
    /**
     * initialises the i2c OLED display
     * @param line line num (8 pixels per line), eg: 0
     * @param n value , eg: 2019
     */
    //% blockId=oled_show_number
    //% weight=98
    //% line.min=0 line.max=7
    //% block="OLED show line %line|number %n"
    //% shim=OLED::showNumber
    //% subcategory="OLED"
    export function showUserNumber(line: number, n: number): void {
        return;
    }

    /**
     * clears the screen.
     */
    //% blockId=oled_clear_screen
    //% block="clear OLED display"
    //% icon="\uf1ec" 
    //% shim=OLED::clearDisplay
    //% subcategory="OLED"
    export function clear(): void {
        return;
    }
    /**
     * OLED
     */
    export enum pin {
       //% block=pin0
       pin0 = 0,
       //% block=pin1
       pin1 = 1,
       //% block=pin2
       pin2 = 2,
       //% block=pin5
       pin5 = 5,
       //% block=pin8
       pin8 = 8,
       //% block=pin11
       pin11 = 11,
       //% block=pin12
       pin12 = 12,
       //% block=pin13
       pin13 = 13,
       //% block=pin14
       pin14 = 14,
       //% block=pin15
       pin15 = 15,
       //% block=pin16
       pin16 = 16
     }
     
    //% shim=DS18B20::Temperature
    export function Temperature(p: number): number {
        // Fake function for simulator
        return 0
    }
    
    //% weight=10 blockId="Temperature_number" 
    //% block="|%p| Temperature_number "
    //% p.fieldEditor="gridpicker" p.fieldOptions.columns=4
    export function TemperatureNumber(p: pin): number {
        // Fake function for simulator
        return Temperature(p)/100
    }
    
    //% weight=10 blockId="Temperature_string" 
    //% block="|%p| Temperature_string "
    //% p.fieldEditor="gridpicker" p.fieldOptions.columns=4
    export function TemperatureString(p: pin) : string{
        let temp = Temperature(p);
        let x = (temp / 100)
        let y = (temp % 100)
        let z = ''
        if(temp >= 0){
          if(y < 10){
            z = x.toString() + '.0' + y.toString()
          }
          else{
            z = x.toString() + '.' + y.toString()
          }
        }
        else if(temp < 0){
          if(y > -10){
            z = '-' + (-x).toString() + '.0' + (-y).toString()
          }
          else{
            z = '-' + (-x).toString() + '.' + (-y).toString()
          }
        }
        return z
    }
}