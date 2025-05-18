import { Line } from '@react-three/drei';

export default function Constellations({ connections, stars }) {
    return (
        <>
            {connections.map((pair, idx) => {
                const star1 = stars.find(s => s.id === pair[0]);
                const star2 = stars.find(s => s.id === pair[1]);
                if (!star1 || !star2) return null;
                return (
                    <Line
                        key={idx}
                        points={[star1.position, star2.position]}
                        color="lightblue"
                        lineWidth={1}
                        dashed
                        dashSize={0.2}
                        gapSize={0.1}
                    />
                );
            })}
        </>
    );
}