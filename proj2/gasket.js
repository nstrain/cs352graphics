/*
 * gasket v2: draw a Sierpinski gasket by drawing lots of dots,
 * where each is the average of the previous and a random vertex
 * For CS352, Calvin College Computer Science
 *
 * Harry Plantinga -- January 2011
 * 
 * Edited by Nathan Strain
 * January 2022
 * No longer a sierpinski gasket
 * Instead cheese burger man?
 */

var gasket = {
  radius: 0.005,				// dot radius
}
var vertex = new Array();

$(document).ready(function () { gasket.init(); });

gasket.init = function () {
  gasket.burg = new Image();   // Create new img element
  gasket.burg.src = 'burg.png'; // Set source path
  gasket.canvas = $('#canvas1')[0];
  gasket.cx = gasket.canvas.getContext('2d');	// get the drawing canvas
  // gasket.cx.fillStyle = 'rgba(250,0,0,0.7)';
  // gasket.cx.fillStyle = 'rgba(255,255,255,0.7)';
  gasket.cx.fillStyle = 'rgba(0,0,0,1)';
  gasket.animate = false;


  // vertex[0] = Vector.create([0, 0]);		// the vertices of our triangle
  // vertex[1] = Vector.create([1, 0]);
  // vertex[2] = Vector.create([0.5, 1]);

  // By default (0,0) is the upper left and canvas.width, canvas.height 
  // is the lower right. We'll add a matrix multiplication to the state
  // to change the coordinate system so that the central part of the canvas
  // (a 300x300 square) is (0,0) to (1,1), with (0,0) in the lower left.
  gasket.cx.setTransform(300, 0, 0, -300, 75, 321);

  //create gradient style
  gasket.lingrad = gasket.cx.createLinearGradient(0, 0, 0, 1);
  gasket.lingrad.addColorStop(0, '#26C000');
  gasket.lingrad.addColorStop(0.5, '#fff');
  gasket.lingrad.addColorStop(0.5, '#00ABEB');
  gasket.lingrad.addColorStop(1, '#fff');
  gasket.cx.font = '10px serif';

  // bind functions to events, button clicks
  $('#animatebutton').bind('click', gasket.startAnimation);
  $('#slider1').bind('change', gasket.slider);
  $('#controlCheck').bind('click', gasket.control);

  gasket.draw();

}

gasket.startAnimation = function() {
  gasket.animate = !gasket.animate;
  if(gasket.animate)
    gasket.runAnimation();
}

gasket.runAnimation = function() {
  if(gasket.animate) {
    $('#slider1').val(($('#slider1').val() + 1)%51);
    gasket.slider();
    
    setTimeout(gasket.runAnimation, 1000);
  }
}

gasket.draw = function (ev) {
  // // pick a random point along the bottom edge
  // p = Vector.create([Math.random(), 0]);
  // $('#messages').prepend("Starting point: (" + p.e(1) + "," + p.e(2) + ")<br>");

  // for (i = 0; i < $('#slider1').val(); i++) {
  //   v = Math.floor(Math.random() * 3);		// random integer from 0 to 2
  //   p = (vertex[v].add(p)).multiply(0.5);	// average p with chosen vertex
  //   if (i < 5) {
  //     $('#messages').prepend("Avg with vertex[" + v + "]->[" + p.e(1) + "," + p.e(2) + "]<br>");
  //   }

  //   gasket.circle(p.e(1), p.e(2), gasket.radius);
  // }
  gasket.erase();

  //background
  gasket.cx.fillStyle = gasket.lingrad;
  gasket.cx.fillRect(0, 0, 1, 1);
  gasket.cx.fillStyle = 'rgba(0,0,0,1)';

  gasket.burgers();
  gasket.circle(.5,.75,.1, true);
  //body
  gasket.cx.fillRect(.49,.75,.02,-.5);
  gasket.legs();
  gasket.arms();
  if(!$('#controlCheck').is(':checked')){
    gasket.belly();
    
    gasket.cx.setTransform( 2, 0, 0, 2, 0, 0 );
    gasket.cx.fillText('The Amazing Fat Man', 0, 150);
    gasket.cx.setTransform(300,0,0,-300,75,321);

  }


}

// draw a filled circle
gasket.circle = function (x, y, radius, fill = false) {
  gasket.cx.beginPath();
  gasket.cx.arc(x, y, radius, 0, 2 * Math.PI, false);
  fill ? gasket.cx.fill() : gasket.cx.stroke();
}

gasket.legs = function(width = .02) {
  gasket.cx.beginPath();
  gasket.cx.lineWidth = width;
  gasket.cx.moveTo(.45,0);
  gasket.cx.lineTo(.5,.25);  
  gasket.cx.lineTo(.55,.0);
  // gasket.cx.closePath();
  gasket.cx.stroke();
}

gasket.arms = function(width = .02) {
  gasket.cx.beginPath();
  gasket.cx.lineWidth = width;
  var offset = gasket.hands();
  gasket.cx.moveTo(.5-offset[1],.6-offset[0]);
  gasket.cx.lineTo(.5,.6);  
  gasket.cx.lineTo(.5+offset[1],.6-offset[0]);
  // gasket.cx.closePath();
  gasket.cx.stroke();
}

gasket.belly = function(fattness = 0) {
  var offset = gasket.hands();
  gasket.cx.beginPath();
  gasket.cx.lineWidth = .001;
  gasket.cx.moveTo(.5,.6);
  gasket.cx.quadraticCurveTo(.5-offset[1],.6-offset[0], .5, .25);
  gasket.cx.quadraticCurveTo(.5+offset[1],.6-offset[0], .5, .6);
  gasket.cx.closePath();
  gasket.cx.fill();


}

// erase canvas and message box
gasket.erase = function (ev) {
  gasket.cx.clearRect(-1, -1, 3, 3);
  $('#messages').html("");
}

// update the message below the slider with its setting
gasket.slider = function (ev) {
  $('#pointcount').text($('#slider1').val());
  gasket.draw();
}

gasket.control = function (ev) {
  $('#controlText').text($('#controlCheck').is(':checked') ? "Self Control" : "No Self Control");
  console.log($('#controlCheck').is(':checked'));
  gasket.draw();
}

// https://stackoverflow.com/questions/1250419/finding-points-on-a-line-with-a-given-distance
// (xt, yt) = (((1 - t) * x0 + t * x1), ((1 - t) * y0 + t * y1))

gasket.fatAngle = function() {
  fattness = $('#slider1').val();
  return (80-fattness) * (Math.PI/180);
}

//arm length 0.35355339059
gasket.hands = function() {
  return [(0.35355339059/Math.sin(Math.PI/2))*Math.sin(gasket.fatAngle()),(0.35355339059/Math.sin(Math.PI/2))*Math.sin(Math.PI/2 - gasket.fatAngle())]
}

// place burgesr, all coordinates are for top left
gasket.burgers = function(){
  var xvals = [0, .2, .6, .8]
  var num;
  for(let i = 0; i < $('#slider1').val(); i++) {
    num = i / 2;
    gasket.cx.drawImage(gasket.burg, xvals[(num)%4], .08 + .13 * Math.floor(num/4), .16, .16);
  }
}