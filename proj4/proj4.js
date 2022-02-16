
$(document).ready(function () { climb.init(); });

var climb = {
}

climb.init = function () {
    climb.canvas = $('#canvas1')[0];
    climb.cx = climb.canvas.getContext('2d');
    climb.cx.fillStyle = 'rgb(255,0,0)';

    climb.cx.setTransform(1, 0, 0, 1, 360, 270);	// world frame is (-1,-1) to (1,1)
    climb.cloud = [0, -300];
    climb.bird = 0;
    climb.cx.lineCap = "round";
    climb.cx.lineWidth = 5;


    climb.draw()
}

climb.circle = function (x, y, radius, fill = true) {
    climb.cx.beginPath();
    climb.cx.arc(x, y, radius, 0, 2 * Math.PI, false);
    fill ? climb.cx.fill() : climb.cx.stroke();
}

climb.draw = function () {
    var grade = 0 - parseInt($('#grade').val());
    var speed = parseInt($('#speed').val());

    $('#gradeVal').text("Angle: " + (0 - grade));

    //sky
    climb.cx.clearRect(-climb.canvas.width / 2, -climb.canvas.height / 2, climb.canvas.width, climb.canvas.height);
    climb.cx.fillStyle = '#7EC0EE';
    climb.cx.fillRect(-climb.canvas.width / 2, -climb.canvas.height / 2, climb.canvas.width, climb.canvas.width);

    //cloud
    climb.cx.save();
    climb.cx.translate(0, 100);
    climb.cx.rotate(grade * Math.PI / 180);
    climb.cx.fillStyle = '#ffffff';
    climb.cloud[0] = (climb.cloud[0] + 1 * speed) % 800;
    climb.circle(400 - climb.cloud[0], climb.cloud[1], 20);
    climb.circle(390 - climb.cloud[0], climb.cloud[1] + 12, 19);
    climb.circle(405 - climb.cloud[0], climb.cloud[1] - 15, 18);
    climb.circle(414 - climb.cloud[0], climb.cloud[1], 24);
    // console.log("cloud", climb.cloud[0]);

    climb.cx.fillStyle = '#000000';
    //bird
    climb.bird = (climb.bird + 1 * speed) % 360;
    climb.cx.save();
    climb.cx.rotate(-(climb.bird * Math.PI / 180))
    climb.cx.translate(50, 0);
    climb.cx.rotate(climb.bird * Math.PI / 180);
    climb.cx.translate(400 - climb.cloud[0], climb.cloud[1]);
    climb.cx.rotate(Math.sin((climb.bird / 2) * (Math.PI / 180)) + Math.PI / 2);
    climb.cx.rotate(-(grade * Math.PI / 180));
    climb.cx.beginPath();
    climb.cx.moveTo(0, 0);
    climb.cx.lineTo(10, 0);
    climb.cx.stroke();
    // climb.circle(0,0,10);
    climb.cx.restore();
    climb.cx.save();
    climb.cx.rotate(-(climb.bird * Math.PI / 180))
    climb.cx.translate(50, 0);
    climb.cx.rotate(climb.bird * Math.PI / 180);
    climb.cx.translate(400 - climb.cloud[0], climb.cloud[1]);
    climb.cx.rotate(-Math.sin((climb.bird / 2) * (Math.PI / 180)) + Math.PI / 2);
    climb.cx.rotate(-(grade * Math.PI / 180));
    climb.cx.beginPath();
    climb.cx.moveTo(0, 0);
    climb.cx.lineTo(10, 0);
    climb.cx.stroke();
    // climb.circle(0,0,10);


    climb.cx.restore();

    //land
    climb.cx.fillStyle = '#d4c08c';
    climb.cx.globalAlpha = 1;
    // climb.cx.save();
    // climb.cx.translate(0, 100);
    // climb.cx.rotate(grade * Math.PI / 180);
    climb.cx.fillRect(-climb.canvas.width, 0, climb.canvas.width * 2, climb.canvas.height);
    climb.cx.translate(0, -75);
    // climb.cx.translate(this.x, 0);
    climb.cx.restore();

    //head
    climb.cx.fillStyle = '#000000';
    climb.circle(100,150, 10);

    //body
    climb.cx.beginPath();
    climb.cx.moveTo(100,150);
    climb.cx.lineTo(100,190);
    climb.cx.stroke();

    //legs
    climb.cx.save();
    climb.cx.translate(100,190);
    climb.cx.rotate(-Math.sin((((climb.bird+180)%360) / 2) * (Math.PI / 180)) );
    climb.cx.beginPath();
    climb.cx.moveTo(0,0);
    climb.cx.lineTo(0,15);
    climb.cx.stroke();
    climb.cx.translate(0,15);
    climb.cx.rotate(Math.sin((((climb.bird+180)%360) / 2) * (Math.PI / 180)) );
    climb.cx.beginPath();
    climb.cx.moveTo(0,0);
    climb.cx.lineTo(0,15);
    climb.cx.stroke();
    climb.cx.restore();

    climb.cx.save();
    climb.cx.translate(100,190);
    var steep = (grade < -80) ? 1:0;
    // console.log(offset);
    climb.cx.rotate(-Math.sin((climb.bird / 2 + 180*steep) * (Math.PI / 180)) );
    climb.cx.beginPath();
    climb.cx.moveTo(0,0);
    climb.cx.lineTo(0,15);
    climb.cx.stroke();
    climb.cx.translate(0,15);
    climb.cx.rotate(Math.sin((climb.bird / 2 + 180*steep) * (Math.PI / 180)) );
    climb.cx.beginPath();
    climb.cx.moveTo(0,0);
    climb.cx.lineTo(0,15);
    climb.cx.stroke();
    climb.cx.restore();

    //arms
    climb.cx.save()
    climb.cx.translate(100,170);
    climb.cx.rotate(-Math.sin((climb.bird / (2)) * (Math.PI / 180)) - Math.PI/8 * steep);
    climb.cx.beginPath();
    climb.cx.moveTo(0,0);
    climb.cx.lineTo(0,10);
    climb.cx.stroke();
    climb.cx.translate(0,10);
    climb.cx.rotate(-Math.sin((climb.bird / (2)) * (Math.PI / 180)) - Math.PI/8*steep);
    climb.cx.beginPath();
    climb.cx.moveTo(0,0);
    climb.cx.lineTo(0,8);
    climb.cx.stroke();
    climb.cx.restore();

    climb.cx.save()
    climb.cx.translate(100,170);
    if(grade <-80){
        climb.cx.rotate(Math.sin((((climb.bird+180)%360) / (2)) * (Math.PI / 180)) + Math.PI/8);
    } else {
        climb.cx.rotate(-Math.sin((((climb.bird+180)%360) / (2)) * (Math.PI / 180)) - Math.PI/8 *steep);
    }
    climb.cx.beginPath();
    climb.cx.moveTo(0,0);
    climb.cx.lineTo(0,10);
    climb.cx.stroke();
    climb.cx.translate(0,10);
    if(grade <-80){
        climb.cx.rotate(Math.sin((((climb.bird+180)%360) / (2)) * (Math.PI / 180)) + Math.PI/8);
    } else {
        climb.cx.rotate(-Math.sin((((climb.bird+180)%360) / (2)) * (Math.PI / 180)) - Math.PI/8*steep);
    }
    climb.cx.beginPath();
    climb.cx.moveTo(0,0);
    climb.cx.lineTo(0,8);
    climb.cx.stroke();
    climb.cx.restore();



    setTimeout(climb.draw, 1000 / 90);
}

climb.accel = function(event) {
    $('#grade').val(event.gamma);
}
window.addEventListener("deviceorientation", climb.accel);
