import React from 'react';
import styled from 'styled-components';
import ThumbnailImageNav from './ImageGalleryDefaultComponents/ThumbnailImageNav';
import DisplayImageNav from './ImageGalleryDefaultComponents/DisplayImageNav';
import SocialMedia from './SocialMedia';

const DisplayImage = styled.img`
  object-fit: cover;
  cursor: zoom-in;
  width: 60%;
  height: 100%;
  object-position: 40% 20%;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  &:hover: {
    cursor: zoom-in;
  }
`;

const DisplayWrapper = styled.div`
  height: 39rem;
  width: 52rem;
  position: relative;
  display: inline-block;
`;

const ThumbnailImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: .5rem;
`;

export default function ImageGalleryDefault({
  curDisplayPhotos,
  curDisplayIndex,
  setCurDisplayIndex,
  setExpandedView,
  url,
  slogan,
  missingImg,
}) {

  let curDisplaySrc;

  function onClickHandler(e) {
    setExpandedView(true);
  }

  if(!curDisplayPhotos[curDisplayIndex]) {
    curDisplaySrc = missingImg;
  } else {
    curDisplaySrc = curDisplayPhotos[curDisplayIndex].url;
  }

  return (
    <DisplayWrapper>
      <DisplayImage
        src={curDisplaySrc || missingImg}
        onClick={onClickHandler}
        onError={(e)=>e.target.src=missingImg}
      />
      <ThumbnailImageWrapper>
        <ThumbnailImageNav
          curDisplayPhotos={curDisplayPhotos}
          curDisplayIndex={curDisplayIndex}
          setCurDisplayIndex={setCurDisplayIndex}
          missingImg={missingImg}
        />
      </ThumbnailImageWrapper>
      <DisplayImageNav
        curDisplayIndex={curDisplayIndex}
        setCurDisplayIndex={setCurDisplayIndex}
        maxDisplayIndex={curDisplayPhotos.length - 1}
      />
      <SocialMedia url={url} slogan={slogan} />
    </DisplayWrapper>
  );
}
