import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon'
console.log("hey")
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(6, 8, 14);
orbit.update();

// Sets a 12 by 12 gird helper
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

const world = new CANNON.World({gravity: new THREE.Vector3(0,-9.8,0)})

const mouse=new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();
const light=new THREE.PointLight();
scene.add(light)


window.addEventListener('mousemove',function (e){
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal,scene.position)
    raycaster.setFromCamera(mouse,camera)
    raycaster.ray.intersectPlane(plane,intersectionPoint)
})

window.addEventListener('click',function(e){
    const sphereGeo=new THREE.SphereGeometry(0.125,30,30);
    const sphereMat=new THREE.MeshStandardMaterial({
        color: 0xfaa500,
        metalness: 0,
        roughness: 0
    })
    const Sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(Sphere);
    Sphere.position.copy(intersectionPoint);
})

const planeGeo=new THREE.PlaneGeometry();
const planeMat = new THREE.MeshStandardMaterial({color: 0xfaa500,side:THREE.DoubleSide 
})
const sphPlane=new THREE.Mesh(planeGeo, planeMat);
scene.add(sphPlane)

const planeBody=new CANNON.Body({type:CANNON.Body.STATIC,
shape:new CANNON.Box(new CANNON.Vector3(5,5,0.001))})
planeBody.quaternion.setFromEuler(-Math.PI/0,0,2)
world.addBody(planeBody)


function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});