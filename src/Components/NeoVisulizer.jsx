import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars as StarBG, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import '../Styles/NeoVisualizer.css';

const scaleSize = (meters) => Math.cbrt(meters) * 0.5;

function Earth({ radius = 0.5 }) {
    const meshRef = useRef();
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.001;
        }
    });
    return (
        <mesh ref={meshRef} rotation={[0.5, 0.5, 0]}>
            <sphereGeometry args={[radius, 64, 64]} />
            <meshStandardMaterial color="royalblue" />
            <Html position={[0, radius + 0.1, 0]} center>
                <div className="neo-label">Earth</div>
            </Html>
        </mesh>
    );
}

function RotatingAsteroid({ pos, radius, name, onClick, onHover, highlight }) {
    const meshRef = useRef();
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
        }
    });
    return (
        <mesh
            ref={meshRef}
            position={pos}
            onClick={onClick}
            onPointerOver={() => onHover(true)}
            onPointerOut={() => onHover(false)}
            castShadow
        >
            <sphereGeometry args={[radius, 32, 32]} />
            <meshStandardMaterial
                color={highlight ? 'yellow' : 'salmon'}
                emissive={highlight ? 'orange' : 'darkred'}
                emissiveIntensity={highlight ? 0.7 : 0.3}
            />
            <Html position={[0, radius + 0.2, 0]} center>
                <div className="neo-label">{name}</div>
            </Html>
        </mesh>
    );
}

function AxesHelper({ size = 1 }) {
    const group = useRef();
    useEffect(() => {
        if (group.current) {
            const helper = new THREE.AxesHelper(size);
            group.current.add(helper);
        }
    }, [size]);
    return <group ref={group} />;
}

function TimeUpdater({ playing, speed, setTimeT }) {
    useFrame((state, delta) => {
        if (playing) {
            setTimeT(prev => {
                const next = prev + speed * delta;
                if (next >= 1) {
                    return 1;
                }
                return next;
            });
        }
    });
    return null;
}

export default function NeoVisualization({ neo }) {
    const [showInfo, setShowInfo] = useState(false);
    const [hovered, setHovered] = useState(false);

    const [timeT, setTimeT] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(0.005);

    const missKm = neo.missDistanceKm;
    const startDistance = missKm * 5;
    const toScene = (km) => km / 1e6;
    const startPos = useMemo(() => [toScene(startDistance), 0, 0], [neo]);
    const endPos = useMemo(() => [toScene(missKm), 0, 0], [neo]);
    const currentPos = useMemo(() => {
        const x = startPos[0] + (endPos[0] - startPos[0]) * timeT;
        return [x, 0, 0];
    }, [startPos, endPos, timeT]);
    const radius = useMemo(
        () => scaleSize((neo.diameterMinMeters + neo.diameterMaxMeters) / 2),
        [neo]
    );

    useEffect(() => {
        setTimeT(0);
        setPlaying(false);
        setShowInfo(false);
    }, [neo]);

    return (
        <div className="neo-container">
            <Canvas shadows camera={{ position: [2, 2, 2], fov: 50 }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
                <StarBG radius={100} depth={60} count={6000} factor={4.5} fade />
                <AxesHelper size={1} />
                <Earth radius={0.5} />
                <Line
                    points={[startPos, endPos]}
                    dashed
                    dashSize={0.05}
                    gapSize={0.05}
                    lineWidth={1}
                    color="orange"
                />
                <RotatingAsteroid
                    pos={currentPos}
                    radius={radius}
                    name={neo.name}
                    onClick={() => setShowInfo(true)}
                    onHover={setHovered}
                    highlight={hovered}
                />
                <OrbitControls enableZoom enableRotate enablePan />
                <TimeUpdater playing={playing} speed={speed} setTimeT={setTimeT} />
            </Canvas>

            <div className="controls-overlay">
                <button
                    onClick={() => {
                        if (timeT >= 1) setTimeT(0);
                        setPlaying(prev => !prev);
                    }}>
                    {playing ? 'Pause' : timeT >= 1 ? 'Replay' : 'Play'}
                </button>
                <label className="control-group">
                    Speed:
                    <input
                        type="range"
                        min={0.001}
                        max={0.02}
                        step={0.001}
                        value={speed}
                        onChange={e => setSpeed(parseFloat(e.target.value))}
                    />
                    {speed.toFixed(3)}
                </label>
                <label className="control-group">
                    Time:
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={timeT}
                        onChange={e => {
                            setTimeT(parseFloat(e.target.value));
                            setPlaying(false);
                        }}
                    />
                    {(timeT * 100).toFixed(0)}%
                </label>
            </div>

            {showInfo && (
                <div className="info-panel">
                    <h3 className="info-title">{neo.name}</h3>
                    <p><strong>Diameter:</strong>{' '}
                        {(neo.diameterMinMeters / 1e3).toFixed(2)}–{(neo.diameterMaxMeters / 1e3).toFixed(2)} km
                    </p>
                    <p><strong>Miss Distance:</strong> {Math.round(neo.missDistanceKm).toLocaleString()} km</p>
                    <p><strong>Close Approach Date:</strong> {neo.closeApproachDate}</p>
                    <p>
                        <a href={neo.nasaJplUrl} target="_blank" rel="noreferrer" className="info-link">
                            More details (JPL)
                        </a>
                    </p>
                    <button onClick={() => setShowInfo(false)} className="info-close-btn">
                        Close
                    </button>
                </div>
            )}

            <div className="scale-legend">
                Note: Sizes/distances are not to scale. Distances scaled by 1e6×, sizes by cube root for visibility.
            </div>
        </div>
    );
}
