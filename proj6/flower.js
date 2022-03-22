import * as THREE from "./js/three.module.js";
import { TrackballControls } from "./js/TrackballControls.js";

$(document).ready(function () { flower.init(); });

var flower = {
    numPetals: 10,
    petals: [],
    petalGeom: [],
    petalLocation: [],
    petalWidth: Math.PI / 3
};

flower.init = function () {
    flower.scene = new THREE.Scene();
    flower.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    flower.mesh

    flower.renderer = new THREE.WebGLRenderer({ antialias: true });
    flower.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(flower.renderer.domElement);
    flower.controls = new TrackballControls(flower.camera, flower.renderer.domElement);
    flower.controls.rotateSpeed = 5.0;
    flower.controls.zoomSpeed = 1.2;
    flower.controls.panSpeed = 1.0;
    flower.controls.keys = ['KeyA', 'KeyS', 'KeyD'];


    var geometry = new THREE.ConeGeometry(0.09, 2.8, 8);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    flower.stem = new THREE.Mesh(geometry, material);
    flower.scene.add(flower.stem);

    var points = [];
    for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.5 + 0.5, (i) * 1 / 10));
    }

    for (let i = 0; i < flower.numPetals; i++) {
        this.petalLocation.push((i * (flower.petalWidth / 2)) % (2*Math.PI));
    }
    for(let i = 0; i < flower.numPetals; i++) {
        flower.petalGeom.push(new THREE.LatheGeometry(points, 12, 1, flower.petalWidth));
    }
    material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    var lathe = new THREE.Mesh(geometry, material);
    // flower.scene.add(flower.lathe);
    for (let i = 0; i < flower.numPetals; i++) {
        flower.petals.push(lathe);
    }

    flower.scene.add(flower.petals[0]);

    flower.camera.position.z = 5;
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // flower.cube.rotation.x += 0.01;
    // flower.cube.rotation.y += 0.01;
    // flower.petal(1,1,1);
    flower.controls.update();

    var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    for (let i = 0; i < 1; i++) {
        var points = [];
        for (let i = 0; i < 10; i++) {
            points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.5 + 0.5, (i) * 1 / 10));
        }
        flower.scene.remove(flower.petals[i]);
        flower.petalGeom[i].dispose();
        flower.petalGeom[i] = new THREE.LatheGeometry(points, 12, flower.petalLocation[i], flower.petalWidth);
        flower.petalLocation[i] = (flower.petalLocation[i] + flower.petalWidth / 50) % (2*Math.PI);
        flower.petals[0] = new THREE.Mesh(
            flower.petalGeom[i],
            material);
        flower.scene.add(flower.petals[0]);
    }


    flower.renderer.render(flower.scene, flower.camera);
};

flower.petal = function (base, width, start) {
    // const points = [];
    // for (let i = 0; i < 10; i++) {
    //     points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
    // }
    const geometry = new THREE.LatheGeometry();//(points);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const lathe = new THREE.Mesh(geometry, material);
    scene.add(lathe);
}
