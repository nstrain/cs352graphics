// Written By Nathan Strain for cs352 hw6 on 3/22/22
// Draw a pulsing spinning flower

import * as THREE from "./js/three.module.js";
import { TrackballControls } from "./js/TrackballControls.js";

$(document).ready(function () { flower.init(); });

var flower = {
    numPetals: 50,
    maxNumPetals: 100,
    petals: [],
    petalGeom: [],
    petalLocation: [],
    petalWidth: Math.PI / 5,
    height: 2.8,
    minSpread: 2,
    maxSpread: 10,
    spreadIteration: 0
};


//initalize everything
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


    flower.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    flower.scene.add(flower.directionalLight);
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    flower.scene.add(ambientLight);

    flower.renderer.shadowMap.enabled = true;
    flower.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    //Create a DirectionalLight and turn on shadows for the light
    flower.directionalLight.position.set(0.75, 1, 0); //default; light shining from top
    flower.directionalLight.castShadow = true; // default false
    flower.scene.add(flower.directionalLight);

    //Set up shadow properties for the light
    flower.directionalLight.shadow.mapSize.width = 512; // default
    flower.directionalLight.shadow.mapSize.height = 512; // default
    flower.directionalLight.shadow.camera.near = 0.5; // default
    flower.directionalLight.shadow.camera.far = 500; // default


    //stem of flower
    var geometry = new THREE.ConeGeometry(0.09, flower.height, 8);
    var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    flower.stem = new THREE.Mesh(geometry, material);
    flower.stem.castShadow = true;
    flower.scene.add(flower.stem);

    //ground
    geometry = new THREE.PlaneGeometry(100, 100);
    material = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    flower.plane = new THREE.Mesh(geometry, material);
    flower.plane.position.y -= flower.height / 2;
    flower.plane.rotation.x += Math.PI / 2;
    flower.plane.receiveShadow = true;
    flower.scene.add(flower.plane);

    // for loops set up arrays because there are many petals
    var points = [];
    for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.5 + 0.5, (i) * 1 / 10));
    }

    for (let i = 0; i < flower.maxNumPetals; i++) {
        this.petalLocation.push((i * (flower.petalWidth / 2)) % (2 * Math.PI));
    }
    for (let i = 0; i < flower.maxNumPetals; i++) {
        flower.petalGeom.push(new THREE.LatheGeometry(points, 12, 1, flower.petalWidth));
    }
    material = new THREE.MeshLambertMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    var lathe = new THREE.Mesh(geometry, material);
    // flower.scene.add(flower.lathe);
    for (let i = 0; i < flower.maxNumPetals; i++) {
        flower.petals.push(lathe);
    }


    flower.scene.add(flower.petals[0]);

    //add a little circle so that the stem actually looks connected and petals don't float
    geometry = new THREE.CircleGeometry(.01 + .01 * (10 + 1) * ((flower.numPetals + 1) / 2));
    flower.circle = new THREE.Mesh(geometry, material);
    flower.scene.add(flower.circle);

    flower.camera.position.z = 5;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    flower.controls.update();

    flower.makePetals();

    flower.renderer.render(flower.scene, flower.camera);
};

// Generate the petals acording to time
flower.makePetals = function () {

    flower.spreadIteration += Math.PI / 100;

    flower.spread = ((flower.maxSpread - flower.minSpread) / 2) * Math.sin(flower.spreadIteration) + ((flower.maxSpread - flower.minSpread) / 2 + flower.minSpread);
    // console.log(flower.spreadIteration, flower.spread);
    var material = new THREE.MeshLambertMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    flower.circle.geometry.dispose();
    flower.scene.remove(flower.circle);
    flower.circle = new THREE.Mesh(new THREE.CircleGeometry(.001 * (10 + 1) * ((flower.numPetals + 1) / flower.spread), 32), material);
    flower.circle.rotation.x += Math.PI / 2;
    flower.circle.castShadow = true;
    flower.circle.receiveShadow = true;
    flower.circle.position.y += flower.height / 2;
    flower.scene.add(flower.circle);


    for (let i = 0; i < flower.numPetals; i++) {
        let points = [];
        for (let j = 0; j < 10; j++) {
            points.push(new THREE.Vector2(.01 + .01 * (j + 1) * ((i + 1) / flower.spread), (j) / (10 * (1))));
            // console.log(Math.sin(j * 0.2) * 0.5 + 0.5, (j) * 1 / (10*(i+1)));

        }

        // flower.petalGeom[i].dispose();
        //dispose of old geometries and meshes to avoid leaking memory
        flower.petals[i].geometry.dispose();
        flower.scene.remove(flower.petals[i]);
        flower.petalGeom[i] = new THREE.LatheGeometry(points, 12, flower.petalLocation[i], flower.petalWidth);
        flower.petalLocation[i] = (flower.petalLocation[i] + flower.petalWidth / 50) % (2 * Math.PI);
        flower.petals[i] = new THREE.Mesh(
            flower.petalGeom[i],
            material);
        flower.petals[i].position.y += flower.height / 2;
        flower.petals[i].castShadow = true;
        flower.petals[i].receiveShadow = true;
        flower.scene.add(flower.petals[i]);
    }
}

