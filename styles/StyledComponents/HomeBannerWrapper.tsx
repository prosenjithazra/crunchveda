import { styled } from "@mui/material";

export const HomeBannerWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 200px 0;
  @media(max-width:1199px){
    padding: 160px 0;
  }
    @media(max-width:899px){
    padding: 120px 0;
  }
      @media(max-width:599px){
    padding: 90px 0;
  }
  &::before {
    position: absolute;
    content: "";
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(252, 249, 242, 0.95) 40%,
      rgba(252, 249, 242, 0) 100%
    );
    pointer-events: none;
    z-index: 2;

    @media(max-width:599px){ background: linear-gradient(
      90deg,
      rgba(252, 249, 242, 0.75) 70%,
      rgba(252, 249, 242, 0.2) 100%
    );
    }
  }
  .bannerImg {
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .bannerTxtBoxWrapper {
    position: relative;
    z-index: 3;
    max-width: 580px;
    .cmnSmallTitle {
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 2.8px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.secondary?.dark};
      margin-bottom: 10px;

    @media(max-width:599px){
        font-size: 12px;
        letter-spacing: 1.5px;
    }
    }
    h1 {
      margin-bottom: 16px;
    }
    p {
      max-width: 440px;
      font-weight: 400;
      font-size: 18px;
      letter-spacing: 0.18px;
      color: ${({ theme }) => theme.palette.customColors?.textColor};

    @media(max-width:599px){
        font-size: 16px;
        max-width: 260px;
    }
    }
    .btnWrapper{
        margin-top: 24px;
        display: flex;
        align-items: center;
        gap: 16px;

    @media(max-width:599px){
    margin-top: 16px;
    }
        button{
            min-width: 220px;
        }
    }
  }
`;
