import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ThumbnailImage from '../ImageGalleryDefaultComponents/ThumbnailImage';

const NavArrow = styled.span`
  color: #32292F;
  visibility: ${(props) => (props.clear ? 'hidden' : 'visible')};
  font-size: 2.75rem;
  &:hover {
    color: #90D7FF;
    cursor: 'pointer';
  }
`;

export default function ExpandedThumbnailImageNav({
  curDisplayPhotos,
  curDisplayIndex,
  setCurDisplayIndex,
  missingImg
}) {
  const maxThumbnailIndex = 6;
  const curDisplayMaxIndex = curDisplayPhotos.length - 1;
  const [expandedThumbnailIndex, setExpandedThumbnailIndex] = useState(curDisplayIndex);
  let navArrowLeft;
  let navArrowRight;
  let curDisplayPhotosSeven = curDisplayPhotos;

  useEffect(() => {
    setExpandedThumbnailIndex(curDisplayIndex);
  }, [curDisplayIndex]);

  function onClickHandler(e) {
    if (e.target.id === 'left') {
      if (expandedThumbnailIndex > curDisplayMaxIndex - 4) {
        setExpandedThumbnailIndex(curDisplayMaxIndex - 4);
      } else {
        setExpandedThumbnailIndex(expandedThumbnailIndex - 1);
      }
    } else if (expandedThumbnailIndex < 4) {
      setExpandedThumbnailIndex(4);
    } else {
      setExpandedThumbnailIndex(expandedThumbnailIndex + 1);
    }
  }

  if (curDisplayMaxIndex > maxThumbnailIndex) {
    if (expandedThumbnailIndex <= 3) {
      curDisplayPhotosSeven = curDisplayPhotos.slice(0, 7);
      navArrowLeft = <NavArrow id="left" clear>&#8249;</NavArrow>;
      navArrowRight = <NavArrow id="right" onClick={onClickHandler}>&#8250;</NavArrow>;
    } else if (expandedThumbnailIndex >= (curDisplayMaxIndex - 3)) {
      curDisplayPhotosSeven = curDisplayPhotos.slice(curDisplayMaxIndex - 6, curDisplayMaxIndex + 1);
      navArrowRight = <NavArrow id="right" clear>&#8250;</NavArrow>;
      navArrowLeft = <NavArrow id="left" onClick={onClickHandler}>&#8249;</NavArrow>;
    } else {
      curDisplayPhotosSeven = curDisplayPhotos.slice(expandedThumbnailIndex - 3, expandedThumbnailIndex + 4);
      navArrowRight = <NavArrow id="right" onClick={onClickHandler}>&#8250;</NavArrow>;
      navArrowLeft = <NavArrow id="left" onClick={onClickHandler}>&#8249;</NavArrow>;
    }
  }

  return (
    <>
      {navArrowLeft}
      {curDisplayPhotosSeven.map(({ id, thumbnail_url }, i) => (
        <ThumbnailImage
          key={i}
          id={id}
          thumbnail={thumbnail_url}
          curDisplayIndex={curDisplayIndex}
          setCurDisplayIndex={setCurDisplayIndex}
          missingImg={missingImg}
        />
      ))}
      {navArrowRight}
    </>
  );
}
