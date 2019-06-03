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


    function getInt8LE(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.Int8LE);
    }

    function getUInt16LE(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt16LE);
    }

    function getInt16LE(addr: number, reg: number): number {
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

        TCS34725_RGBC_C = getUInt16LE(TCS34725_ADDRESS, REG_CLEAR_CHANNEL_L | REG_TCS34725_COMMAND_BIT);
        TCS34725_RGBC_R = getUInt16LE(TCS34725_ADDRESS, REG_RED_CHANNEL_L | REG_TCS34725_COMMAND_BIT);
        TCS34725_RGBC_G = getUInt16LE(TCS34725_ADDRESS, REG_GREEN_CHANNEL_L | REG_TCS34725_COMMAND_BIT);
        TCS34725_RGBC_B = getUInt16LE(TCS34725_ADDRESS, REG_BLUE_CHANNEL_L | REG_TCS34725_COMMAND_BIT);

        basic.pause(50);
        let ret = readReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE | REG_TCS34725_COMMAND_BIT)
        ret |= TCS34725_ENABLE_AIEN;
        writeReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE | REG_TCS34725_COMMAND_BIT, ret)
    }

    /**
     * 获取TCS34725颜色传感器的红色分量
     */
    //% block="Get red"
    //% weight=60 
    export function getRed(): number {
        getRGBC();
        return TCS34725_RGBC_R;
    }

    /**
     * 获取TCS34725颜色传感器的绿色分量
     */
    //% block="Get green"
    //% weight=60 
    export function getGreen(): number {
        getRGBC();
        return TCS34725_RGBC_G;
    }

    /**
     * 获取TCS34725颜色传感器的蓝色分量
     */
    //% block="Get blue"
    //% weight=60 
    export function getBlue(): number {
        getRGBC();
        return TCS34725_RGBC_B;
    }

    /**
     * 获取TCS34725颜色传感器的自然光线值
     */
    //% block="Get light"
    //% weight=60 
    export function getC(): number {
        getRGBC();
        return TCS34725_RGBC_C;
    }

    /**
     * STM32  function
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

    //% block="set Led %parms"
    //% weight=69
    export function setLed(parms: STM32_LED_STATUS) {
        writeReg(STM32_ADDRESS, REG_SEM32_LED_CONTROL, parms)
    }



    /**
     * 获取紫外线传感器的UV值
     */
    //% block="get UV"
    //% weight=70
    export function getUV(): number {
        let ret1 = readReg(STM32_ADDRESS, REG_STM32_UV_H);
        let ret2 = readReg(STM32_ADDRESS, REG_SEM32_UV_L);
        return (ret1 << 8) | ret2;
    }

    /**
     * 获取TDS传感器的K值
     */
    //% block="get TDS K Value"
    //% weight=70
    export function getK(): string {
        let ret1 = readReg(STM32_ADDRESS, REG_STM32_K_INTEGER);
        let ret2 = readReg(STM32_ADDRESS, REG_SEM32_K_DECIMAL);
        let str = ".";
        if (ret2 < 10) {
            str = str + '0';
        }
        str = ret1 + str + ret2;
        return str;
    }

    /**
     * 设置TDS传感器的K值
     */
    //% block="set TDS K %value"
    //% weight=70
    export function setK(value: number) {

        let ret1 = parseInt(value.toString());
        writeReg(STM32_ADDRESS, REG_STM32_K_INTEGER, ret1);
        let ret2 = (value * 100 - ret1 * 100);
        writeReg(STM32_ADDRESS, REG_SEM32_K_DECIMAL, ret2);
    }

    /**
     * 获取TDS传感器的TDS值
     */
    //% block="get TDS"
    //% weight=70
    export function getTDS(): number {
        let ret1 = readReg(STM32_ADDRESS, REG_STM32_TDS_H);
        let ret2 = readReg(STM32_ADDRESS, REG_SEM32_TDS_L);
        return (ret1 << 8) | ret2;
    }

    /**
     * 获取声音强度函数
     */
    //% block="get noise"
    //% weight=70
    export function getNoise(): number {
        let ret1 = readReg(STM32_ADDRESS, REG_SEM32_NOISE_H);
        let ret2 = readReg(STM32_ADDRESS, REG_STM32_NOISE_L);
        return (ret1 << 8) | ret2;
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

    /**
     * 获取BME280传感器的压强、温度、湿度值
     */
    //% block="get %data"
    //% weight=80
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
     * OLED 12864显示屏
     */
    //% blockId=oled_show_text
    //% weight=90
    //% line.min=0 line.max=7
    //% text.defl="DFRobot"
    //% block="OLED show line %line|text %text"
    //% shim=OLED::showText
    export function showUserText(line: number, text: string): void {
        return;
    }
    /**
     * initialises the i2c OLED display
     * @param line line num (8 pixels per line), eg: 0
     * @param n value , eg: 2019
     */
    //% blockId=oled_show_number
    //% weight=90
    //% line.min=0 line.max=7
    //% block="OLED show line %line|number %n"
    //% shim=OLED::showNumber
    export function showUserNumber(line: number, n: number): void {
        return;
    }

    /**
     * clears the screen.
     */
    //% blockId=oled_clear_screen
    //% block="clear OLED display"
    //% icon="\uf1ec" 
    //% weight=89
    //% shim=OLED::clearDisplay
    export function clear(): void {
        return;
    }
    /**
     * OLED
     */
    //% shim=DS18B20::Temperature
    export function Temperature(p: number): number {
        // Fake function for simulator
        return 0
    }

    /**
     * 获取水的温度
     */
    //% weight=80 blockId="get DS18B20 Temp" 
    //% block="get DS18B20 Temp "
    export function TemperatureNumber(): number {
        // Fake function for simulator
        return Temperature(13) / 100
    }

}