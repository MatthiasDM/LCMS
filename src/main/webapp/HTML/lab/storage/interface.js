/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    storage_doLoad($("#storage-container"));

});

function generateSVGGrid(parent) {
    //    <svg width="400" height="110">
    //<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
    //</svg>
    var container = document.getElementById(parent);

    var width = container.clientWidth;
    var height = container.clientHeight;
    var squaresX = 16;
    var squaresY = 16;
    var squareWidth = width / squaresX;
    var squareHeight = height / squaresY;

//String.fromCharCode(97 + n);

    for (var x = 0; x < squaresX; x += 1) {



        for (var y = 0; y < squaresY; y += 1) {
            var style = "fill:rgb(255,255,255);stroke:rgb(150,150,150);stroke-width:1;";
            var value = "";
            if (x == 0) {
                style = "fill:rgb(255,255,255);stroke:rgb(255,255,255);stroke-width:0;";
                var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', squareWidth * x + (squaresX / 2));
                text.setAttribute('y', squareHeight * (y+2) - (squaresY / 2));
                text.setAttribute('text-anchor', "middle");
                text.setAttribute('alignment-baseline', 'middle')
                text.textContent = y+1;
                container.appendChild(text);
            }
            if (y == 0 & x > 0) {

                style = "fill:rgb(255,255,255);stroke:rgb(255,255,255);stroke-width:0;";
                var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', squareWidth * x + (squaresX / 2));
                text.setAttribute('y', squareHeight * y + (squaresY / 2));
                text.setAttribute('text-anchor', "middle");
                text.setAttribute('alignment-baseline', 'middle')
                text.textContent = String.fromCharCode(64 + x);
                container.appendChild(text);
            }

            if (x > 0 & y > 0) {
                var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', squareWidth * x);
                rect.setAttribute('y', squareHeight * y);
                rect.setAttribute('width', squareWidth);
                rect.setAttribute('height', squareHeight);
                rect.setAttribute("style", style);
                container.appendChild(rect);

            }


        }

    }


}


function populateGrid(_data, parent) {
    console.log("Populating grid...");
    var container = document.getElementById(parent);
    var width = container.clientWidth;
    var height = container.clientHeight;
    var squaresX = 16;
    var squaresY = 16;
    var squareWidth = width / squaresX;
    var squareHeight = height / squaresY;

    $.each(JSON.parse(_data.table), function (index, value) {
        var y = value.location.match(/\d+/)[0]; // "3"
        var x = letterValue(value.location.match(/\D+/)[0]); // "3"

        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', squareWidth * x);
        rect.setAttribute('y', squareHeight * (y));
        rect.setAttribute('width', squareWidth);
        rect.setAttribute('height', squareHeight);
        rect.setAttribute("style", "fill:rgb(66,139,202);stroke:rgb(66,139,202);stroke-width:1;");
        container.appendChild(rect);

    });


}

function letterValue(text) {
    var result = 0;
    for (var i = 0; i < text.length; i++) {
        var code = text.toUpperCase().charCodeAt(i)
        if (code > 64 && code < 91) {
            result = result * 26;
            result += (code - 64);
        }
    }

    return result;
}



