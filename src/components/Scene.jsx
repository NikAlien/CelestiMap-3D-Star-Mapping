import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars as StarBG } from '@react-three/drei';
import Stars from './Stars';
import Constellations from './Constellations';

function CameraKeyboardControls() {
    const { camera } = useThree();
    const keys = useRef({});

    const speed = 0.2;

    useEffect(() => {
        const downHandler = (e) => { keys.current[e.key.toLowerCase()] = true; };
        const upHandler = (e) => { keys.current[e.key.toLowerCase()] = false; };

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);

    useFrame(() => {
        if (keys.current['arrowup'] || keys.current['w']) camera.position.y += speed;
        if (keys.current['arrowdown'] || keys.current['s']) camera.position.y -= speed;
        if (keys.current['arrowleft'] || keys.current['a']) camera.position.x -= speed;
        if (keys.current['arrowright'] || keys.current['d']) camera.position.x += speed;
    });

    return null;
}

export default function Scene({ stars, connections }) {
    return (
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} shadows>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1.2} />
            <StarBG radius={100} depth={50} count={5000} factor={4} fade />
            <Stars stars={stars} />
            <Constellations connections={connections} stars={stars} />
            <CameraKeyboardControls/>
            <OrbitControls enableZoom enableRotate enablePan />
        </Canvas>
    );
}