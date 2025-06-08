import Star from './Star';

export default function Stars({ stars, onStarHover }) {
    return (
        <>
            {stars.map((star) => (
                <Star
                    key={star.id}
                    star={star}
                    onStarHover={onStarHover}
                />
            ))}
        </>
    );
}