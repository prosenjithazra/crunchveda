import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const SustainabilityHeroWrapper = styled("section")`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};

  .sustainability_hero {
    position: relative;
    width: 100%;
    height: 580px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    
    @media(max-width: 899px) {
      height: 480px;
    }
    @media(max-width: 599px) {
      height: 380px;
    }

    .hero_bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      
      img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    }

    .hero_overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      background: linear-gradient(
        180deg,
        rgba(252, 249, 242, 0.1) 0%,
        rgba(252, 249, 242, 0.6) 60%,
        rgba(252, 249, 242, 1) 100__percent
      );
    }

    /* Temp fix for CSS parser double percent issues */
    background: linear-gradient(
      180deg,
      rgba(252, 249, 242, 0.1) 0%,
      rgba(252, 249, 242, 0.6) 60%,
      #FCF9F2 100%
    );

    .hero_content {
      position: relative;
      z-index: 3;
      max-width: 760px;
      padding: 0 24px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .section_tag {
        font-family: ${outFit.style.fontFamily};
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 2.6px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.palette.secondary.light};
        margin-bottom: 16px;
        display: inline-block;
        @media(max-width: 599px) {
          font-size: 11px;
        }
      }

      h1 {
        font-family: ${playFair.style.fontFamily};
        font-size: 54px;
        font-weight: 700;
        line-height: 1.25;
        color: ${({ theme }) => theme.palette.primary.main};
        margin-bottom: 20px;
        @media(max-width: 1199px) {
          font-size: 44px;
        }
        @media(max-width: 899px) {
          font-size: 36px;
        }
        @media(max-width: 599px) {
          font-size: 28px;
        }
      }

      .hero_desc {
        font-family: ${outFit.style.fontFamily};
        font-size: 16px;
        line-height: 1.6;
        color: ${({ theme }) => theme.palette.customColors.textColor};
        max-width: 600px;
        margin: 0;
        @media(max-width: 599px) {
          font-size: 14px;
        }
      }
    }
  }

  .quote_section {
    padding: 60px 0 80px;
    text-align: center;
    @media(max-width: 599px) {
      padding: 40px 0 60px;
    }

    .quote_symbol {
      font-size: 80px;
      line-height: 1;
      font-family: ${playFair.style.fontFamily};
      color: ${({ theme }) => theme.palette.secondary.light};
      opacity: 0.6;
      margin-bottom: 0px;
      display: inline-block;
      height: 30px;
      @media(max-width: 599px) {
        font-size: 56px;
      }
    }

    blockquote {
      font-family: ${playFair.style.fontFamily};
      font-size: 28px;
      font-weight: 500;
      line-height: 1.45;
      color: ${({ theme }) => theme.palette.primary.main};
      max-width: 840px;
      margin: 0 auto;
      padding: 0 24px;
      @media(max-width: 1199px) {
        font-size: 24px;
      }
      @media(max-width: 899px) {
        font-size: 20px;
      }
      @media(max-width: 599px) {
        font-size: 18px;
        line-height: 1.5;
      }
    }
  }
`;
