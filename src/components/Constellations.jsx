import { Line } from '@react-three/drei';
import * as THREE from 'three';

export default function Constellations({ connections, stars }) {
    const starPositions = {};
    stars.forEach(star => {
        starPositions[star.id] = star.position;
    });

    return (
        <>
            {connections.map(([fromId, toId], index) => {
                const start = starPositions[fromId];
                const end = starPositions[toId];

                if (!start || !end) return null;

                return (
                    <Line
                        key={index}
                        points={[start, end]}
                        color="white"
                        dashed
                        dashSize={0.5}  // Length of each dash
                        gapSize={0.3}   // Length of each gap
                        lineWidth={1}
                    />
                );
            })}
        </>
    );
}