import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const StarMapCanvas = ({ stars = [], onStarClick }) => {
    const mountRef = useRef();

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000011");
        const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        stars.forEach(star => {
            const geometry = new THREE.SphereGeometry(0.5);
            const mesh = new THREE.Mesh(geometry, starMaterial);
            mesh.position.set(parseFloat(star.x), parseFloat(star.y), parseFloat(star.z));
            mesh.name = star.name;
            scene.add(mesh);
        });

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onClick = (e) => {
            const bounds = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
            mouse.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0 && onStarClick) {
                onStarClick(intersects[0].object.name);
            }
        };

        renderer.domElement.addEventListener("click", onClick);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            renderer.domElement.removeEventListener("click", onClick);
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [stars, onStarClick]);

    return <div style={{ width: "100%", height: "600px" }} ref={mountRef}></div>;
};

export default StarMapCanvas;
