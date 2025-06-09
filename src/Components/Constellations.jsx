import { Line } from '@react-three/drei';

export default function Constellations({ connections, stars, onLineClick }) {
    const starPositions = {};
    stars.forEach(star => {
        starPositions[star.id] = star.position;
    });

    return (
        <group>
            {connections.map(([fromId, toId], idx) => {
                const start = starPositions[fromId];
                const end = starPositions[toId];
                if (!start || !end) return null;
                return (
                    <Line
                        key={idx}
                        points={[start, end]}
                        dashed
                        dashSize={0.5}
                        gapSize={0.3}
                        lineWidth={1}
                        onClick={() => onLineClick(fromId, toId)}
                    />
                );
            })}
        </group>
    );
}