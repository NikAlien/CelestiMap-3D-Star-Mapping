import React from 'react';
import { Html } from '@react-three/drei';
import '../Styles/Scene.css'

export default function Star({ star, onStarHover }) {
    if (!star || !Array.isArray(star.position)) {
        console.error("Invalid star data:", star);
        return null;
    }

    return (
        <group position={star.position}>
            <mesh onPointerOver={() => onStarHover(star)} onPointerOut={() => onStarHover(null)}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial
                    emissive={star.color || 'white'}
                    emissiveIntensity={2}
                    color={star.color}
                />
            </mesh>
            <Html position={[0, 0.5, 0]} center>
                <div className="star-label" style={{
                    color: 'white',
                    textShadow: '0 0 3px black, 0 0 5px black'
                }}>
                    {star.name}
                </div>
            </Html>
        </group>
    );
}