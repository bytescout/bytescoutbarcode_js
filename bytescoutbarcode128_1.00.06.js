/*
 * Bytescout BarCode SDK / Code 128 for Javascript 1.00.06
 * All rights reserved. Copyright (c) ByteScout 2011-2012
 * http://bytescout.com/products/developer/barcodegeneratorsdkjs/index.html
 * Free for commercial and non-commercial use. 
 * Looking for a way to generate PDF from client-side Javascript? Check our PDF Generator SDK JS:
 * http://bytescout.com/products/developer/pdfgeneratorsdkjs/index.html
 * PDF generation script is compatible with this code 128 barcode generation script (you can insert Code 128 barcodes into PDF)
 * Looking for powerful web API to work with PDF, Barcodes and Spreadsheets? Check https://bytescout.com/ !
 */

function bytescoutbarcode128() {
    //Parameters to set dimension
    this.private_width=undefined;           //width of codeBar
    this.private_height=undefined;          //height of codeBar+caption (if enabled)
    this.private_minBarWidth=2;             //min bar width. Can be 1px, 2px,...
    this.private_forceBarWidth=undefined;   //forced width of a single bar
    this.private_margins={left:0,top:0,right:0,bottom:0};
    this.private_quietZonePixels=20;        //number of pixels for quiet zone
    
    //Calculated dimensions
    this.private_barWidth=undefined;        //width of a single bar
    this.private_barHeight=undefined;       //height of barcode without caption
    this.private_minWidth=undefined;        //minimun required width to draw the barcode
    
    this.private_codeSet=bytescoutbarcode128.Auto;   //default encoding
    this.private_value=undefined;           //value of barcode.
    this.private_encodedValue=undefined;    //encoded value
    
    this.private_caption=undefined;         //text to show. If undefined uses value
    this.private_captionEnabled=true;       
    this.private_captionPosition=bytescoutbarcode128.BELOW;
    this.private_captionInterline=1.5;      //factor to calculate caption interline (relative to fontSize)
    this.private_captionColor=undefined;    //color for caption. If undefined uses barColor.
    this.private_fontName="Arial";
    this.private_fontSize=12;

    this.private_barColor="#000000";
    this.private_backgroundColor="#FFFFFF";
}

//sets the initial encoding (A, B, C or Auto).
bytescoutbarcode128.prototype.setCodeSet=function(codeSet) {
    this.private_codeSet=codeSet;
    this.resetCode();
}

//forces value to be encoded again
bytescoutbarcode128.prototype.resetCode=function() {
    this.private_encodedValue=undefined; 
    this.resetSize();
}

//forces barWidth,barHeight,minWidth,minHeight to be calculed again
bytescoutbarcode128.prototype.resetSize=function() {
    this.private_barWidth=this.private_barHeight=this.private_minWidth=undefined;    
}

//value of the barcode
bytescoutbarcode128.prototype.valueSet=function(value) {
    this.private_value=value;
    this.private_caption=undefined;
    //value must be encoded again
    this.resetCode();
}

//barcode total size, with caption
bytescoutbarcode128.prototype.setMargins=function(left, top, right, bottom) {
    //adding 20px for quietzone
    this.private_margins={left:left, top:top, right:right, bottom:bottom};
}

//barcode total size, with caption
bytescoutbarcode128.prototype.setSize=function(width, height) {
    this.private_width=width;
    this.private_height=height;
    this.resetSize();    
}

//define min bar width: used to calculate if codebar fits into size
bytescoutbarcode128.prototype.setMinBarWidth=function(width) {
    this.private_minBarWidth=width;
    this.private_forceBarWidth=undefined;
    this.resetSize();    
}

//force bar width
bytescoutbarcode128.prototype.setBarWidth=function(width) {
    this.private_forceBarWidth=width;    
    this.private_minBarWidth=undefined;
    this.resetSize();
}

//PRE: value, width and height must be set
//return true if the barcode of value fits into width,height
bytescoutbarcode128.prototype.valueFits=function() {
    if (this.private_encodedValue===undefined) 
        this.private_encodedValue=this.getBars(this.private_value);
    
    //barWidth
     if (this.private_barWidth===undefined) 
        if (this.private_forceBarWidth!==undefined)
            this.private_barWidth=this.private_forceBarWidth;
        else
            this.private_barWidth=Math.floor((this.private_width-this.private_quietZonePixels*2-this.private_margins.left-this.private_margins.right)/this.getBarsLength());

    //barHeight
    if (this.private_barHeight===undefined)
        if (this.private_captionEnabled) 
            this.private_barHeight=Math.floor(this.private_height-this.private_margins.top-this.private_margins.bottom-this.private_fontSize*this.private_captionInterline);
        else 
            this.private_barHeight=this.private_height-this.private_margins.top-this.private_margins.bottom;

    //minWidth
    if (this.private_minWidth===undefined)
        if (this.private_barWidth<this.private_minBarWidth) 
            this.private_minWidth=this.private_minBarWidth*this.getBarsLength()+this.private_quietZonePixels*2+this.private_margins.left+this.private_margins.right;
        else 
            this.private_minWidth=this.private_barWidth*this.getBarsLength()+this.private_quietZonePixels*2+this.private_margins.left+this.private_margins.right;

    return this.private_barWidth>=this.private_minBarWidth;
}


//returns the minimun needed width
bytescoutbarcode128.prototype.getMinWidth=function() {
    if (this.private_minWidth===undefined) this.valueFits();
    return this.private_minWidth;
}

//returns single bar width
bytescoutbarcode128.prototype.getBarWidth=function() {
    if (this.private_minWidth===undefined) this.valueFits();
    return this.private_barWidth;
}

//returns single bar height
bytescoutbarcode128.prototype.getBarHeight=function() {
    if (this.private_minWidth===undefined) this.valueFits();
    return this.private_barHeight;
}





//sets caption for the barcode, font name and fontSize.
bytescoutbarcode128.prototype.setCaption=function(caption, fontName, fontSize) {
    this.private_caption=caption;
    this.private_fontName=fontName;
    this.private_fontSize=fontSize;
    this.private_captionEnabled=true;
}

//true when caption is visible
bytescoutbarcode128.prototype.setCaptionVisibility=function(visible) {
    this.private_captionEnabled=visible;  
}

bytescoutbarcode128.BELOW=1;
bytescoutbarcode128.ABOVE=2;
//sets caption position
bytescoutbarcode128.prototype.setCaptionPosition=function(position) {
    this.private_captionPosition=position;
}

//set caption color.
bytescoutbarcode128.prototype.setCaptionColor=function(R,G,B) {
    if (G===undefined) this.private_captionColor=R;
    else this.private_captionColor=bytescoutbarcode128.RGBtoHex(R,G,B);   
}

//set background color. The canvas will be cleaned using this color
bytescoutbarcode128.prototype.setBackgroundColor=function(R,G,B) {
    if (G===undefined) this.private_backgroundColor=R;
    else this.private_backgroundColor=bytescoutbarcode128.RGBtoHex(R,G,B);   
}

//set foreground color, for bars and caption
bytescoutbarcode128.prototype.setBarColor=function(R,G,B) {
    if (G===undefined) this.private_barColor=R;
    else this.private_barColor=bytescoutbarcode128.RGBtoHex(R,G,B);
}

//auxiliar funtion to convert rgb color to #RRGGBB
bytescoutbarcode128.RGBtoHex=function(R,G,B) {
    var toHex=function(c) { 
        var hex = c.toString(16); 
        return hex.length == 1 ? "0" + hex : hex; 
    } 
    return "#" + toHex(R) + toHex(G) + toHex(B);    
}







//draws the barcode of value into a canvas, with a given rotation (if any).
bytescoutbarcode128.prototype.exportToCanvas=function(canvas, angle) {
    this.valueFits();
    var ctx=canvas.getContext('2d');
    ctx.fillStyle=this.private_backgroundColor;
    ctx.fillRect(0,0,canvas.width, canvas.height);  //clear to canvas

    ctx.translate(canvas.width / 2, canvas.height / 2); //origin at the center of canvas
    if (angle!==undefined && angle!=0) {
        ctx.rotate(angle*Math.PI/180); //aply rotation if any
    }

    var middleY=this.private_height/2;
    var barY=-middleY+this.private_margins.top;
    var barHeight=this.private_height-this.private_margins.top-this.private_margins.bottom;

    if (this.private_captionEnabled) { 
        var captionHeight=this.private_fontSize*this.private_captionInterline;
        captionY=(this.private_captionPosition==bytescoutbarcode128.BELOW?middleY-this.private_margins.bottom-2:-middleY+this.private_margins.top+this.private_fontSize);
        barY=(this.private_captionPosition==bytescoutbarcode128.BELOW?-middleY+this.private_margins.top:-middleY+this.private_margins.top+captionHeight);
        barHeight=this.private_height-captionHeight-this.private_margins.top-this.private_margins.bottom;

        ctx.fillStyle=(this.private_captionColor===undefined?this.private_barColor:this.private_captionColor);
        ctx.font = ""+this.private_fontSize+"px "+this.private_fontName;
        var caption=(this.private_caption===undefined?this.private_value:this.private_caption);
        var textWidth = ctx.measureText(caption); //to center caption in canvas
        ctx.fillText(caption, -textWidth.width/2, captionY); 
    
    }

    //draw each bar in the barcode
    ctx.fillStyle=this.private_barColor;
    var n=0, x=-this.private_minWidth/2+this.private_margins.left+this.private_quietZonePixels;
    for (var i=0;i<this.private_encodedValue.length;i++) {
        var patt=bytescoutbarcode128._patterns[this.private_encodedValue[i]];
        //document.write(','+bars[i]); //debug: show codes
        n=0;
        for (var j=0;j<patt.length;j++) {
            if (patt.charAt(j)=="1") n++;
            else {
                if (n>0) { //draw all 1's as a single broader bar!
                    ctx.fillRect(x,barY,this.private_barWidth*n,barHeight);        
                    x+=this.private_barWidth*n;
                }
                n=0;
                x+=this.private_barWidth;
            }
        }
        if (n>0) { //draws any remainder bar
            ctx.fillRect(x,barY,this.private_barWidth*n,barHeight);        
            x+=this.private_barWidth*n;
        }
    }
}

//returns the image base64 encoded
bytescoutbarcode128.prototype.exportToBase64=function(width, height, angle) {
    var canvas = document.createElement("CANVAS");
    canvas.style.visibility='hidden';
    canvas.style.position='absolute';
    document.body.appendChild(canvas);
    canvas.width=width;
    canvas.height=height;
    this.exportToCanvas(canvas,angle);
    var base64=canvas.toDataURL("image/png");     
    return base64;
}

//returns the image base64 encoded without "data:image/png;base64" prefix for saving to file.
bytescoutbarcode128.prototype.exportToImageDataBase64=function(width, height, angle) {
    var base64=this.exportToBase64(width, height, angle);
    var pos=base64.indexOf("base64,");
    if (pos!=-1) base64=base64.substr(pos+7);
    return base64;
}

//Type A encoding singleton.
bytescoutbarcode128.A=new function() {
    this.start=103; //startA code
    this.toB=100;   //code to switch from A to B encoding. Used in auto mode.
    this.toC=99;    //code to switch from A to C encoding. Used in auto mode.
    this.table=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_";
    //Returns the code of the next char in value at charPos.
    //Also returns how many chars has been processed. In A encoding always +1.
    //If the currect char can not be encoded, returns null.
    this.process=function(value, charPos){
        var c=value.charAt(charPos);
        var code=this.table.indexOf(c);
        if (code==-1) return null; //ERROR: current char can not be encoded
        return {code:code,charPos:charPos+1}; 
    }
    //function used to optimize encoding transitions in Auto mode.
    //Returns the distance to the next control char (when A encoding is needed).
    this.getFirstControlCharPos=function(value, charPos) {
        var count=0;
        while (charPos<value.length && value.charAt(charPos++)>=' ') count++; //char < /u0032
        return count;        
    }
};

//Type B encoding singleton.
bytescoutbarcode128.B=new function() {
    this.start=104;     //startB code
    this.toA=101;       //code to switch from B to A encoding. Used in auto mode.
    this.toC=99;        //code to switch from B to C encoding. Used in auto mode.
    this.table=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    //Returns the code of the next char in value at charPos.
    //Also returns how many chars has been processed. In B encoding always +1.
    //If the currect char can not be encoded, returns null.
    this.process=function(value, charPos){
        var c=value.charAt(charPos);
        var code=this.table.indexOf(c);
        if (code==-1) return null;
        return {code:code,charPos:charPos+1};
    }
    //function used to optimize encoding transitions in Auto mode.
    //Returns the distance to the next lower case char (when B encoding is needed).
    this.getFirstLowerCasePos=function(value, charPos){
        var count=0;
        while (charPos<value.length && !this.isLower(value.charAt(charPos++))) count++; 
        return count;          
    }
    //return true is c is a lower case char.
    this.isLower=function(c) { return c>='a' && c<='z';}
};

//Type C encoding singleton.
bytescoutbarcode128.C=new function() {
    this.start=105;     //startC code
    this.toA=101;       //code to switch from C to A encoding. Used in auto mode.
    this.toB=100;       //code to switch from C to B encoding. Used in auto mode.
    this.table="0123456789";
    //Returns the code of the next char in value at charPos.
    //Also returns how many chars has been processed. In C encoding always +2.
    //If the currect char can not be encoded, returns null.
    this.process=function(value, charPos){
        if (charPos+1>=value.length) return null; //need 2 digits
        var c1=value.charAt(charPos);
        var c2=value.charAt(charPos+1);
        //must be numbers
        if (this.table.indexOf(c1)==-1 || this.table.indexOf(c2)==-1) return null;
        return {code:parseInt(c1+c2),charPos:charPos+2};
    }; 
    this.getNumberCount=function(value, charPos) {
        var count=0;
        while (charPos<value.length && this.table.indexOf(value.charAt(charPos++))!=-1) count++;
        return count;
    }
};

//Auto encoding singleton. 
bytescoutbarcode128.Auto=new function() {
    this.start=undefined;       //will be the start code for the selected start encoding.
    this.codeSet=undefined;     //points to the current encoding A, B or C.
    this.canSwitch=true;        //auto mode allows to switch encoding.

    //Selects the best encoding to encode value starting at charPos.
    //At the beginning (this.codiSet==null) select the start encoding for auto mode.
    //Later returns the switch code (A to B, A to C, B to A, B to C, C to A or C to B).
    this.switchCodeSet=function(value,charPos){
        var switchCode=null;
        if (bytescoutbarcode128.C.getNumberCount(value, charPos) >= 4) {
            if (!this.codeSet) this.start=bytescoutbarcode128.C.start;
            else switchCode=this.codeSet.toC;
            this.codeSet=bytescoutbarcode128.C;
        } else if (bytescoutbarcode128.A.getFirstControlCharPos(value, charPos) <= bytescoutbarcode128.B.getFirstLowerCasePos(value, charPos)) {
            if (!this.codeSet) this.start=bytescoutbarcode128.A.start;
            else switchCode=this.codeSet.toA;
            this.codeSet=bytescoutbarcode128.A;
        }else {
            if (!this.codeSet) this.start=bytescoutbarcode128.B.start;
            else switchCode=this.codeSet.toB;
            this.codeSet=bytescoutbarcode128.B;
        }
        return switchCode;
    }
    //just wrapper to the current encoding sigleton.    
    this.process=function(value, charPos) {
        return this.codeSet.process(value,charPos);
    }
};

//function to validate a code
bytescoutbarcode128.prototype.valueValidate=function() {
    try { this.getBars(this.private_value);}
    catch (err){ return false;}
    return true;
}

//returns an array of codes to encode a value (string) using the current codeSet.
bytescoutbarcode128.prototype.getBars=function(value) {
    if (this.private_codeSet==bytescoutbarcode128.Auto) this.private_codeSet.switchCodeSet(value,0);
    var bars=[];
    bars.push(this.private_codeSet.start);
    var charPos=0;
    while (charPos<value.length) {
        var result=this.private_codeSet.process(value,charPos);
        if (!result) {
            if (!this.private_codeSet.canSwitch) throw "ERROR not valid char";
            bars.push(this.private_codeSet.switchCodeSet(value,charPos));            
            result=this.private_codeSet.process(value,charPos);
            if (!result) throw "ERROR: switch to wrong code";
        }        
        bars.push(result.code);
        charPos=result.charPos;
    }
    bars.push(this.getCheckSum(bars));
    bars.push(bytescoutbarcode128._stop);

    this.encodedValue=bars; //remember the encoded value
    return bars;
}

bytescoutbarcode128.prototype.getBarsLength=function() {
    return this.encodedValue.length*11+2;
}

//returns the checksum for a barcode.
bytescoutbarcode128.prototype.getCheckSum=function(bars) {
    var sum=0;
    for(var i=0;i<bars.length;i++)
        sum+=(i==0?1:i)*bars[i];
    var code=sum%103;
    //if (code>=95) code+=105;
    return code;
}

//bars for each code
bytescoutbarcode128._patterns = [
            "11011001100", "11001101100", "11001100110", "10010011000",
            "10010001100", "10001001100", "10011001000", "10011000100",
            "10001100100", "11001001000", "11001000100", "11000100100",
            "10110011100", "10011011100", "10011001110", "10111001100",
            "10011101100", "10011100110", "11001110010", "11001011100",
            "11001001110", "11011100100", "11001110100", "11101101110",
            "11101001100", "11100101100", "11100100110", "11101100100",
            "11100110100", "11100110010", "11011011000", "11011000110",
            "11000110110", "10100011000", "10001011000", "10001000110",
            "10110001000", "10001101000", "10001100010", "11010001000",
            "11000101000", "11000100010", "10110111000", "10110001110",
            "10001101110", "10111011000", "10111000110", "10001110110",
            "11101110110", "11010001110", "11000101110", "11011101000",
            "11011100010", "11011101110", "11101011000", "11101000110",
            "11100010110", "11101101000", "11101100010", "11100011010",
            "11101111010", "11001000010", "11110001010", "10100110000",
            "10100001100", "10010110000", "10010000110", "10000101100",
            "10000100110", "10110010000", "10110000100", "10011010000",
            "10011000010", "10000110100", "10000110010", "11000010010",
            "11001010000", "11110111010", "11000010100", "10001111010",
            "10100111100", "10010111100", "10010011110", "10111100100",
            "10011110100", "10011110010", "11110100100", "11110010100",
            "11110010010", "11011011110", "11011110110", "11110110110",
            "10101111000", "10100011110", "10001011110", "10111101000",
            "10111100010", "11110101000", "11110100010", "10111011110",
            "10111101110", "11101011110", "11110101110", "11010000100",
            "11010010000", "11010011100", "1100011101011"];

bytescoutbarcode128._stop=106;       //code for stop



