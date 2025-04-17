import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function StarRating({ value, onChange }) {
  const displayRating = value / 2;

  const handleClick = (starIndex, half) => {
    const newRating = (starIndex + (half ? 0.5 : 1)) * 2;
    onChange(newRating);
  };

  const handleStarClick = (e, starIndex) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    const half = clickX < width / 2;
    handleClick(starIndex, half);
  };

  const stars = [];
  const commonStyles = { 
    cursor: 'pointer', 
    color: 'gold', 
    fontSize: '3rem', 
    marginRight: '0.25rem', 
    marginLeft: '0.25rem'
  };

  for (let i = 0; i < 5; i++) {
    let starElement;
    if (displayRating >= i + 1) {
      // Full star
      starElement = (
      <span key={i} style={commonStyles} onClick={(e) => handleStarClick(e, i)}>
          <FaStar />
        </span>
      );
    } else if (displayRating >= i + 0.5) {
      // Half star
      starElement = (
      <span key={i} style={commonStyles} onClick={(e) => handleStarClick(e, i)}>
          <FaStarHalfAlt />
        </span>
      );
    } else {
      // Empty star
      starElement = (
      <span key={i} style={commonStyles} onClick={(e) => handleStarClick(e, i)}>
          <FaRegStar />
        </span>
      );
    }
    stars.push(starElement);
  }
  
  return <div>{stars}</div>;
}