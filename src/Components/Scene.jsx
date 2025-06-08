import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars as StarBG } from '@react-three/drei';
import Stars from './Stars';
import Constellations from './Constellations';

export default function Scene({ stars, connections, onStarHover }) {
    return (
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} shadows>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.2} />
            <StarBG radius={100} depth={50} count={5000} factor={4} fade />
            <Stars stars={stars} onStarHover={onStarHover} />
            <Constellations connections={connections} stars={stars} />
            <OrbitControls enableZoom enableRotate enablePan />
        </Canvas>
    );
}