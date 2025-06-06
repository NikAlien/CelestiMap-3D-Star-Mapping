export default function Star({ position, color }) {
    return (
        <>
            <mesh position={position}>
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial emissive={color || 'white'} emissiveIntensity={2} color={color} />
            </mesh>
            <pointLight position={position} color={color} intensity={0.8} distance={4} decay={2} />
        </>
    );
}