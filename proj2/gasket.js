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


$(document).ready(function () { gasket.init(); });

gasket.init = function () {
  gasket.burg = new Image();   // Create new img element
  gasket.burg.src = 'burg.png'; // Set source path
  gasket.canvas = $('#canvas1')[0];
  gasket.cx = gasket.canvas.getContext('2d');	// get the drawing canvas
  gasket.cx.fillStyle = 'rgba(0,0,0,1)';
  gasket.animate = false;


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

  //set font stuff
  gasket.cx.font = '10px serif';

  // bind functions to events, button clicks
  $('#animatebutton').bind('click', gasket.startAnimation);
  $('#slider1').bind('change', gasket.slider);
  $('#controlCheck').bind('click', gasket.control);

  gasket.draw();

}

//kick off the animation and then call another function to run the animation
gasket.startAnimation = function() {
  gasket.animate = !gasket.animate;
  if(gasket.animate)
    gasket.runAnimation();
}

//run the animation after it has been started
gasket.runAnimation = function() {
  if(gasket.animate) {
    $('#slider1').val((parseInt( $('#slider1').val()) + 1)%51);
    gasket.slider();
    gasket.animate = parseInt( $('#slider1').val()) != 0 ? true : false;
    setTimeout(gasket.runAnimation, 200);
  }
}

gasket.draw = function (ev) {

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
  if(!$('#controlCheck').is(':checked')){ // only do these things if the stick man can't control himself
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

//draw the stick man's legs
gasket.legs = function(width = .02) {
  gasket.cx.beginPath();
  gasket.cx.lineWidth = width;
  gasket.cx.moveTo(.45,0);
  gasket.cx.lineTo(.5,.25);  
  gasket.cx.lineTo(.55,.0);
  // gasket.cx.closePath();
  gasket.cx.stroke();
}

//draw the stick man's arms depending on the fatness value
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

//draw the stickman's belly depending on the fatness value
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

// update the message below the slider with its setting and redraw
gasket.slider = function (ev) {
  $('#pointcount').text($('#slider1').val());
  gasket.draw();
}

//update the check box text and redraw, toggles the stomach and text
gasket.control = function (ev) {
  $('#controlText').text($('#controlCheck').is(':checked') ? "Self Control" : "No Self Control");
  console.log($('#controlCheck').is(':checked'));
  gasket.draw();
}

//determine the angle of the arms based on the fatness factor
gasket.fatAngle = function() {
  fattness = $('#slider1').val();
  return (80-fattness) * (Math.PI/180);
}

//arm length 0.35355339059
//determine the position of the stickman's hands depending the the angle of his arms, return offset from shoulder (base of arm)
gasket.hands = function() {
  return [(0.35355339059/Math.sin(Math.PI/2))*Math.sin(gasket.fatAngle()),(0.35355339059/Math.sin(Math.PI/2))*Math.sin(Math.PI/2 - gasket.fatAngle())]
}

// place burgers, all coordinates are for top left of pic
gasket.burgers = function(){
  var xvals = [0, .2, .6, .8]
  var num;
  for(let i = 0; i < $('#slider1').val(); i++) {
    num = i / 2;
    gasket.cx.drawImage(gasket.burg, xvals[(num)%4], .08 + .13 * Math.floor(num/4), .16, .16);
  }
}