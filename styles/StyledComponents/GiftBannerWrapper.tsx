import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const GiftBannerWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 0;
  background: ${({ theme }) => theme.palette.customColors?.lightCream};

  .gift_banner_card {
    position: relative;
    width: 100%;
    border-radius: 40px;
    overflow: hidden;
    background: ${({ theme }) => theme.palette.primary.dark};
    padding: 80px 60px;
    min-height: 480px;
    display: flex;
    align-items: center;

    @media (max-width: 899px) {
      padding: 60px 30px;
      min-height: 520px;
      align-items: flex-end;
    }

    @media (max-width: 599px) {
      border-radius: 24px;
      padding: 40px 20px;
    }
  }

  .banner_overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(11, 32, 19, 0.95) 45%,
      rgba(11, 32, 19, 0.1) 100%
    );
    pointer-events: none;
    z-index: 2;

    @media (max-width: 899px) {
      background: linear-gradient(
        180deg,
        rgba(11, 32, 19, 0.2) 0%,
        rgba(11, 32, 19, 0.95) 75%
      );
    }
  }

  .banner_img {
    position: absolute;
    right: 0;
    top: 0;
    width: 60%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    z-index: 1;

    @media (max-width: 899px) {
      width: 100%;
      height: 100%;
    }
  }

  .banner_content {
    position: relative;
    z-index: 3;
    max-width: 540px;

    .cmnSmallTitle {
      font-family: ${outFit.style.fontFamily};
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 2.8px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.warning.light};
      margin-bottom: 16px;

      @media (max-width: 599px) {
        font-size: 12px;
        letter-spacing: 1.5px;
        margin-bottom: 10px;
      }
    }

    h2 {
      font-family: ${playFair.style.fontFamily};
      font-weight: 600;
      font-size: 48px;
      line-height: 1.2;
      color: ${({ theme }) => theme.palette.common.white};
      margin-bottom: 20px;

      @media (max-width: 1199px) {
        font-size: 40px;
      }
      @media (max-width: 899px) {
        font-size: 32px;
      }
      @media (max-width: 599px) {
        font-size: 28px;
        margin-bottom: 14px;
      }
    }

    p {
      font-family: ${outFit.style.fontFamily};
      font-weight: 400;
      font-size: 16px;
      line-height: 1.7;
      color: ${({ theme }) => theme.palette.common.white};
      opacity: 0.85;
      margin-bottom: 32px;
      max-width: 460px;

      @media (max-width: 599px) {
        font-size: 14px;
        margin-bottom: 24px;
      }
    }

    .customize_btn {
      background: ${({ theme }) => theme.palette.warning.light};
      color: ${({ theme }) => theme.palette.primary.dark};
      font-family: ${outFit.style.fontFamily};
      font-weight: 600;
      font-size: 15px;
      text-transform: none;
      padding: 14px 32px;
      border-radius: 12px;
      transition: all 0.3s ease;
      box-shadow: none;

      @media (max-width: 599px) {
        padding: 12px 24px;
        font-size: 14px;
      }

      &:hover {
        background: ${({ theme }) => theme.palette.warning.main};
        transform: translateY(-2px);
      }
    }
  }
`;
