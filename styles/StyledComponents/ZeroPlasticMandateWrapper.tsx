import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const ZeroPlasticMandateWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 48px 0;
  background-color: ${({ theme }) => theme.palette.primary.dark};
  color: #ffffff;

  @media (max-width: 1199px) {
    padding: 36px 0;
  }
  @media (max-width: 899px) {
    padding: 28px 0;
  }
  @media (max-width: 599px) {
    padding: 20px 0;
  }
  .mandate_header {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 56px;
    padding: 0 24px;
    @media(max-width: 599px) {
      margin-bottom: 36px;
    }

    h2 {
      font-family: ${playFair.style.fontFamily};
      font-size: 40px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 16px;
      @media(max-width: 1199px) {
        font-size: 32px;
      }
      @media(max-width: 599px) {
        font-size: 26px;
      }
    }

    p {
      font-family: ${outFit.style.fontFamily};
      font-size: 15px;
      line-height: 1.65;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      @media(max-width: 599px) {
        font-size: 14px;
      }
    }
  }

  .mandate_card {
    position: relative;
    width: 100%;
    height: 400px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    
    @media(max-width: 1199px) {
      height: 340px;
    }
    @media(max-width: 599px) {
      height: 280px;
    }

    .card_bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .card_overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      background: linear-gradient(
        180deg,
        rgba(11, 32, 19, 0) 40%,
        rgba(11, 32, 19, 0.95) 100%
      );
    }

    .card_content {
      position: absolute;
      bottom: 32px;
      left: 32px;
      right: 32px;
      z-index: 3;
      display: flex;
      flex-direction: column;
      
      @media(max-width: 599px) {
        bottom: 20px;
        left: 20px;
        right: 20px;
      }

      .card_tag {
        font-family: ${outFit.style.fontFamily};
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: ${({ theme }) => theme.palette.warning.light};
        margin-bottom: 8px;
      }

      h3 {
        font-family: ${playFair.style.fontFamily};
        font-size: 24px;
        font-weight: 600;
        color: #ffffff;
        margin: 0;
        @media(max-width: 599px) {
          font-size: 20px;
        }
      }
    }

    &:hover {
      .card_bg {
        transform: scale(1.05);
      }
    }
  }
`;
