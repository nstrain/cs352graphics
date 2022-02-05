/*
 * CanvasPaint 352 -- starter code for a paint program using the 
 * HTML5 canvas element--for CS352, Calvin College Computer Science
 *
 * Harry Plantinga -- January 2011
 */

$(document).ready(function () { cpaint.init(); });

var cpaint = {
  drawing: 		false,
  tool:			'marker',
  lineThickness: 	12,
  color:		'#333399',
}

cpaint.init = function () {  
  cpaint.canvas  = $('#canvas1')[0];
  cpaint.cx = cpaint.canvas.getContext('2d');
  cpaint.imgData = cpaint.cx.getImageData(0, 0, cpaint.canvas.width, cpaint.canvas.height);
  cpaint.lastCoord = [0,0];
  cpaint.secondLastCoord = [0,0];
  cpaint.initialCoord = [0,0];
  
  					// create offscreen copy of canvas in an image

  // bind functions to events, button clicks
  $(cpaint.canvas).bind('mousedown', cpaint.drawStart);
  $(cpaint.canvas).bind('mousemove', cpaint.draw);
  $('*').bind('mouseup', cpaint.drawEnd);
  $('#color1').bind('change', cpaint.colorChange);
  $('#color1').colorPicker();			// initialize color picker
  $('#mainmenu').clickMenu();			// initialize menu

  // bind menu options
  $('#menuClear').bind('click', cpaint.clear);
  $('#menuNew').bind('click', cpaint.clear);
  $('#menuFade').bind('click', cpaint.fade);
  $('#menuUnfade').bind('click', cpaint.unfade);
  $('#menuOpen').bind('click',cpaint.open);
  $('#menuSave').bind('click',cpaint.save);
  $('#menuEdge').bind('click', cpaint.edgeDetect);
  $('#toolBar').show();		// when toolbar is initialized, make it visible

  $('#menuMarker').bind('click', {tool:"marker"}, cpaint.selectTool);
  $('#menuLine').bind('click', {tool:"line"}, cpaint.selectTool);
  $('#menuRect').bind('click', {tool:"rect"}, cpaint.selectTool);
  $('#menuEraser').bind('click', {tool:"eraser"}, cpaint.selectTool);

  //side tool bar selection
  $('#markerButton').bind('click', {tool:"marker"}, cpaint.selectTool);
  $('#lineButton').bind('click', {tool:"line"}, cpaint.selectTool);
  $('#rectButton').bind('click', {tool:"rect"}, cpaint.selectTool);
  $('#eraserButton').bind('click', {tool:"eraser"}, cpaint.selectTool);
  $('#clearButton').bind('click', cpaint.clear);
  $('#widthSlider').bind('change', cpaint.thickness);
}

cpaint.thickness = function() {
  $('#dot').css({"height": Math.round($('#widthSlider').val()/2) + "px", "width":Math.round($('#widthSlider').val()/2) + "px"});
}

cpaint.clear = function() {
  cpaint.cx.clearRect(0,0, cpaint.canvas.width, cpaint.canvas.height);
}
/*
 * handle mousedown events
 */
cpaint.drawStart = function(ev) {
  var x, y; 				// convert event coords to (0,0) at top left of canvas
  x = ev.pageX - $(cpaint.canvas).offset().left;
  y = ev.pageY - $(cpaint.canvas).offset().top;
  ev.preventDefault();

  cpaint.drawing = true;			// go into drawing mode

  cpaint.color = $('#color1').val();
  cpaint.lineThickness = $('#widthSlider').val();
  if(cpaint.tool == 'eraser'){
    cpaint.color = '#ffffff'
  }

  cpaint.cx.lineWidth = cpaint.lineThickness;
  cpaint.cx.lineStyle = cpaint.color;
  cpaint.cx.strokeStyle = cpaint.color;
  cpaint.cx.fillStyle = cpaint.color;
  cpaint.imgData = cpaint.cx.getImageData(0, 0, cpaint.canvas.width, cpaint.canvas.height);
  						// save drawing window contents
  // cpaint.cx.beginPath();			// draw initial point
  // cpaint.cx.moveTo(x-1,y-1);
  // cpaint.cx.lineTo(x,y);
  // cpaint.cx.stroke();
  cpaint.lastCoord = [x,y];
  cpaint.secondLastCoord = [x,y];
  cpaint.initialCoord = [x,y];
}

/*
 * handle mouseup events
 */
cpaint.drawEnd = function(ev) {
  cpaint.drawing = false;
}

/*
 * handle mousemove events
 */
cpaint.draw = function(ev) {
  var x, y;
  x = ev.pageX - $(cpaint.canvas).offset().left;
  y = ev.pageY - $(cpaint.canvas).offset().top;

  if (cpaint.drawing) {
    cpaint.lineWidth = 1;
    cpaint.lineJoin = 'round';
    if(cpaint.tool == 'marker' || cpaint.tool == 'eraser'){
      cpaint.cx.beginPath();			// draw initial stroke
      cpaint.cx.moveTo(cpaint.secondLastCoord[0], cpaint.secondLastCoord[1]);
      cpaint.cx.lineTo(cpaint.lastCoord[0],cpaint.lastCoord[1]);
      cpaint.cx.lineTo(x,y);
      cpaint.cx.stroke();
    } else if (cpaint.tool == "line") {
      cpaint.cx.clearRect(0, 0, cpaint.canvas.width, cpaint.canvas.height);
      cpaint.cx.putImageData(cpaint.imgData,0,0);
      cpaint.cx.beginPath();
      cpaint.cx.moveTo(cpaint.initialCoord[0], cpaint.initialCoord[1]);
      cpaint.cx.lineTo(x,y);
      cpaint.cx.stroke();
      cpaint.cx.closePath();
    } else if (cpaint.tool == "rect") {
      cpaint.cx.clearRect(0, 0, cpaint.canvas.width, cpaint.canvas.height);
      cpaint.cx.putImageData(cpaint.imgData,0,0);
      cpaint.cx.fillRect(cpaint.initialCoord[0],cpaint.initialCoord[1], x-cpaint.initialCoord[0],y-cpaint.initialCoord[1]);
    }
  }
  cpaint.secondLastCoord = cpaint.lastCoord;
  cpaint.lastCoord = [x,y];
  
} 

/*
 * clear the canvas, offscreen buffer, and message box
 */
cpaint.clear = function(ev) {
  cpaint.cx.clearRect(0, 0, cpaint.canvas.width, cpaint.canvas.height);
  cpaint.imgData = cpaint.cx.getImageData(0, 0, cpaint.canvas.width, cpaint.canvas.height);
  $('#messages').html("");
}  

/*
 * color picker widget handler
 */
cpaint.colorChange = function(ev) {
  $('#messages').prepend("Color: " + $('#color1').val() + "<br>");
}


/*
 * handle open menu item by making open dialog visible
 */
cpaint.open = function(ev) { 
  $('#fileInput').show();
  $('#file1').bind('change submit',cpaint.loadFile);
  $('#closeBox1').bind('click',cpaint.closeDialog);
  $('#messages').prepend("In open<br>");	
}

/*
 * load the image whose URL has been typed in
 * (this should have some error handling)
 */
cpaint.loadFile = function() {
  $('#fileInput').hide();
  $('#messages').prepend("In loadFile<br>");	
  var img = document.createElement('img');
  var file1 = $("#file1").val();
  $('#messages').prepend("Loading image " + file1 + "<br>");	

  img.src=file1;
  img.onload = function() {
    cpaint.cx.clearRect(0, 0, cpaint.canvas.width, cpaint.canvas.height);
    cpaint.cx.drawImage(img,0, 0, cpaint.canvas.width, cpaint.canvas.height);
  }
}

cpaint.closeDialog = function() {
  $('#fileInput').hide();
}

/*
 * to save a drawing, copy it into an image element
 * which can be right-clicked and save-ased
 */
cpaint.save = function(ev) {
  $('#messages').prepend("Saving...<br>");	
  var dataURL = cpaint.canvas.toDataURL();
  if (dataURL) {
    $('#saveWindow').show();
    $('#saveImg').attr('src',dataURL);
    $('#closeBox2').bind('click',cpaint.closeSaveWindow);
  } else {
    alert("Your browser doesn't implement the toDataURL() method needed to save images.");
  }
}

cpaint.closeSaveWindow = function() {
  $('#saveWindow').hide();
}

/*
 * Fade/unfade an image by altering Alpha of each pixel
 */
cpaint.fade = function(ev) {
  $('#messages').prepend("Fade<br>");	
  cpaint.imgData = cpaint.cx.getImageData(0, 0, cpaint.canvas.width, cpaint.canvas.height);
  var pix = cpaint.imgData.data;
  for (var i=0; i<pix.length; i += 4) {
    pix[i+3] /= 2;		// reduce alpha of each pixel
  }
  cpaint.cx.putImageData(cpaint.imgData, 0, 0);
}

cpaint.unfade = function(ev) {
  $('#messages').prepend("Unfade<br>");	
  cpaint.imgData = cpaint.cx.getImageData(0, 0, cpaint.canvas.width, cpaint.canvas.height);
  var pix = cpaint.imgData.data;
  for (var i=0; i<pix.length; i += 4) {
    pix[i+3] *= 2;		// increase alpha of each pixel
  }
  cpaint.cx.putImageData(cpaint.imgData, 0, 0);
}

cpaint.edgeDetect = function(ev) {
  cpaint.imgData = cpaint.cx.getImageData(0, 0, cpaint.canvas.width, cpaint.canvas.height);
  var edges = cpaint.imgData.data;
  var vertical;
  var horizontal;
  for (var col=1; col<cpaint.canvas.width; col += 1) {
    for(var row=1; row < cpaint.canvas.height; row += 1) {
      vertical = cpaint.imgData.data[(((row-1) * (cpaint.canvas.width * 4)) + ((col-1) * 4)) + 0] + 
        cpaint.imgData.data[(((row-1) * (cpaint.canvas.width * 4)) + ((col-0) * 4)) + 0] +
        cpaint.imgData.data[(((row-1) * (cpaint.canvas.width * 4)) + ((col+1) * 4)) + 0] -
        cpaint.imgData.data[(((row+1) * (cpaint.canvas.width * 4)) + ((col-1) * 4)) + 0] - 
        cpaint.imgData.data[(((row+1) * (cpaint.canvas.width * 4)) + ((col-0) * 4)) + 0] -
        cpaint.imgData.data[(((row+1) * (cpaint.canvas.width * 4)) + ((col+1) * 4)) + 0];
      horizontal = cpaint.imgData.data[(((row-1) * (cpaint.canvas.width * 4)) + ((col-1) * 4)) + 0] + 
        cpaint.imgData.data[(((row-0) * (cpaint.canvas.width * 4)) + ((col-1) * 4)) + 0] +
        cpaint.imgData.data[(((row+1) * (cpaint.canvas.width * 4)) + ((col-1) * 4)) + 0] -
        cpaint.imgData.data[(((row-1) * (cpaint.canvas.width * 4)) + ((col+1) * 4)) + 0] - 
        cpaint.imgData.data[(((row+0) * (cpaint.canvas.width * 4)) + ((col+1) * 4)) + 0] -
        cpaint.imgData.data[(((row+1) * (cpaint.canvas.width * 4)) + ((col+1) * 4)) + 0];
      if(Math.abs(vertical) > 2 || Math.abs(horizontal) > 2) {
        edges[((row * (cpaint.canvas.width * 4)) + (col * 4)) + 0] = 255;
        edges[((row * (cpaint.canvas.width * 4)) + (col * 4)) + 1] = 255;
        edges[((row * (cpaint.canvas.width * 4)) + (col * 4)) + 2] = 255;
      } else {
        edges[((row * (cpaint.canvas.width * 4)) + (col * 4)) + 0] = 0;
        edges[((row * (cpaint.canvas.width * 4)) + (col * 4)) + 1] = 0;
        edges[((row * (cpaint.canvas.width * 4)) + (col * 4)) + 2] = 0;
      }
    }
    
  }
  cpaint.cx.putImageData(cpaint.imageData, 0,0);

}

// select tool
cpaint.selectTool = function(ev) {
  cpaint.tool = ev.data.tool;			// get tool name

  $('.toolbarCell').each(function(index) {	// unselect other buttons
    $(this).removeClass('selected');
  });

  var tool = '#' + cpaint.tool + 'Button';	// construct ID of button as #toolButton
  $(tool).addClass('selected');			// select this button
}
