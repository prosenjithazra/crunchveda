import { styled } from "@mui/material";

export const HomeBannerWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 120px 0;
  @media (max-width: 1199px) {
    padding: 100px 0;
  }
  @media (max-width: 899px) {
    padding: 75px 0;
  }
  @media (max-width: 599px) {
    padding: 48px 0;
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

    @media (max-width: 599px) {
      background: linear-gradient(
        90deg,
        rgba(252, 249, 242, 0.85) 75%,
        rgba(252, 249, 242, 0.25) 100%
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
    max-width: 540px;
    .cmnSmallTitle {
      font-weight: 600;
      font-size: 13px;
      letter-spacing: 2.2px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.secondary?.dark};
      margin-bottom: 8px;

      @media (max-width: 599px) {
        font-size: 11px;
        letter-spacing: 1.2px;
        margin-bottom: 6px;
      }
    }
    h1 {
      margin-bottom: 12px;
      @media (max-width: 599px) {
        margin-bottom: 8px;
      }
    }
    p {
      max-width: 440px;
      font-weight: 400;
      font-size: 16px;
      letter-spacing: 0.15px;
      color: ${({ theme }) => theme.palette.customColors?.textColor};

      @media (max-width: 599px) {
        font-size: 14px;
        max-width: 280px;
        line-height: 1.35;
      }
    }
    .btnWrapper {
      margin-top: 18px;
      display: flex;
      align-items: center;
      gap: 12px;

      @media (max-width: 599px) {
        margin-top: 12px;
        gap: 8px;
      }
      button {
        min-width: 180px;
        @media (max-width: 599px) {
          min-width: 140px;
          padding: 8px 16px;
        }
      }
    }
  }
`;
