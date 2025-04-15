import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function StarRating({ value, onChange }) {
  const displayRating = value / 2;

  const handleClick = (starIndex, half) => {
    const newRating = (starIndex + (half ? 0.5 : 1)) * 2;
    onChange(newRating);
  };

  const stars = [];
  const commonStyles = { cursor: 'pointer', color: 'gold', fontSize: '2rem', marginRight: '0.25rem' };

  for (let i = 0; i < 5; i++) {
    let starElement;
    if (displayRating >= i + 1) {
      // Full star
      starElement = (
        <span key={i} style={commonStyles} onClick={() => handleClick(i, false)}>
          <FaStar />
        </span>
      );
    } else if (displayRating >= i + 0.5) {
      // Half star
      starElement = (
        <span key={i} style={commonStyles} onClick={() => handleClick(i, true)}>
          <FaStarHalfAlt />
        </span>
      );
    } else {
      // Empty star
      starElement = (
        <span key={i} style={commonStyles} onClick={() => handleClick(i, false)}>
          <FaRegStar />
        </span>
      );
    }
    stars.push(starElement);
  }
  
  return <div>{stars}</div>;
}