import { Html } from '@react-three/drei';

export default function Star({ star, onClick }) {
    return (
        <group>
            <mesh position={star.position} onClick={() => onClick(star)}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial
                    emissive={star.color || 'white'}
                    emissiveIntensity={2}
                    color={star.color}
                />
            </mesh>
            <Html position={[0, 0.5, 0]} center>
                <div className="star-label">{star.name}</div>
            </Html>
        </group>
    );
}