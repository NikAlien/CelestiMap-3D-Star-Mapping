import Star from './Star';

export default function Stars({ stars }) {
    return (
        <>
            {stars.map((star) => (
                <Star key={star.id} position={star.position} color={star.color} />
            ))}
        </>
    );
}