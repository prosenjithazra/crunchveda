import { alpha, styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const CategoriesMainWrapper = styled("section")`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};
  padding: 52px 0;
  
  @media (max-width: 1199px) {
    padding: 38px 0;
  }
  @media (max-width: 599px) {
    padding: 24px 0;
  }

  .title_section {
    text-align: center;
    max-width: 680px;
    margin: 0 auto 36px;
    padding: 0 16px;
    @media (max-width: 599px) {
      margin: 0 auto 18px;
      padding: 0;
    }
    
    .subtitle_small {
      font-family: ${outFit.style.fontFamily};
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 2.6px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.secondary.light};
      margin-bottom: 12px;
      @media(max-width: 599px) {
        font-size: 11px;
        margin-bottom: 8px;
      }
    }

    h1 {
      font-family: ${playFair.style.fontFamily};
      font-size: 48px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.main};
      margin-bottom: 16px;
      
      @media(max-width: 899px) {
        font-size: 38px;
      }
      @media(max-width: 599px) {
        font-size: 32px;
        margin-bottom: 8px;
      }
    }

    .desc_para {
      font-family: ${outFit.style.fontFamily};
      font-size: 16px;
      line-height: 1.6;
      color: ${({ theme }) => theme.palette.customColors.textColor};
    }
  }

  .grid_container {
    margin-bottom: 80px;
    @media(max-width: 1199px) {
      margin-bottom: 60px;
    }
    @media(max-width: 599px) {
      margin-bottom: 40px;
    }
  }

  .category_card {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    height: 440px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
    transition: box-shadow 0.4s ease;
    text-decoration: none;
    
    @media(max-width: 899px) {
      height: 380px;
    }
    @media(max-width: 599px) {
      height: 320px;
      border-radius: 16px;
    }

    &.tall_card {
      height: 440px;
      @media(max-width: 899px) {
        height: 380px;
      }
      @media(max-width: 599px) {
        height: 320px;
      }
    }

    &.medium_card {
      height: 350px;
      @media(max-width: 899px) {
        height: 300px;
      }
      @media(max-width: 599px) {
        height: 280px;
      }
    }

    &.banner_card {
      height: 380px;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40px;
      @media(max-width: 899px) {
        height: 340px;
      }
      @media(max-width: 599px) {
        height: 320px;
        padding: 24px;
      }
    }

    &:hover {
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
      
      .card_bg {
        transform: scale(1.05);
      }
      
      .discover_link svg {
        transform: translateX(6px);
      }
    }

    .card_bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
      
      img {
        object-fit: cover;
      }
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 40%,
        rgba(0, 0, 0, 0.75) 100%
      );
      
      &.banner_overlay {
        background: ${({ theme }) => theme.palette.primary.dark}BF; /* Primary dark green tint with alpha */
      }
    }

    .card_badge {
      position: absolute;
      top: 24px;
      left: 24px;
      z-index: 3;
      background-color: ${({ theme }) => theme.palette.warning.light};
      color: ${({ theme }) => theme.palette.primary.main};
      font-family: ${outFit.style.fontFamily};
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 6px 14px;
      border-radius: 20px;
      
      @media(max-width: 599px) {
        top: 16px;
        left: 16px;
        font-size: 10px;
        padding: 4px 10px;
      }
    }

    .card_content {
      position: relative;
      z-index: 3;
      padding: 32px;
      color: ${({ theme }) => theme.palette.common.white};
      max-width: 100%;
      
      @media(max-width: 1199px) {
        padding: 20px;
      }
      @media (max-width: 599px) {
        padding: 16px;
      }

      h2 {
        font-family: ${playFair.style.fontFamily};
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 8px;
        color: ${({ theme }) => theme.palette.common.white};
        
        @media(max-width: 1199px) {
          font-size: 24px;
        }
        @media(max-width: 599px) {
          font-size: 20px;
        }
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 14px;
        line-height: 1.5;
        color: ${({ theme }) => alpha(theme.palette.common.white, 0.9)};
        margin-bottom: 16px;
        
        @media(max-width: 599px) {
          font-size: 13px;
          margin-bottom: 12px;
        }
      }

      .discover_link {
        font-family: ${outFit.style.fontFamily};
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        gap: 8px;
        
        svg {
          transition: transform 0.3s ease;
        }
      }
    }

    .banner_content {
      position: relative;
      z-index: 3;
      color: ${({ theme }) => theme.palette.common.white};
      max-width: 640px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .banner_badge {
        background-color: ${({ theme }) => theme.palette.warning.light};
        color: ${({ theme }) => theme.palette.primary.main};
        font-family: ${outFit.style.fontFamily};
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        padding: 6px 16px;
        border-radius: 20px;
        margin-bottom: 16px;
        display: inline-block;
      }

      h2 {
        font-family: ${playFair.style.fontFamily};
        font-size: 40px;
        font-weight: 600;
        margin-bottom: 12px;
        color: ${({ theme }) => theme.palette.common.white};
        
        @media(max-width: 599px) {
          font-size: 28px;
        }
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 16px;
        line-height: 1.6;
        opacity: 0.9;
        margin-bottom: 28px;
        
        @media(max-width: 599px) {
          font-size: 14px;
          margin-bottom: 20px;
        }
      }
    }
    }
  }

  .features_banner {
    background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};
    padding: 64px 0;
    margin-top: 80px;
    border-radius: 24px;
    @media(max-width: 1199px) {
      padding: 48px 0;
      margin-top: 56px;
      border-radius: 16px;
    }
    @media(max-width: 599px) {
      padding: 32px 0;
      margin-top: 40px;
    }
    
    .feature_col {
      text-align: center;
      padding: 0 24px;
      
      @media(max-width: 899px) {
        margin-bottom: 32px;
        &:last-child {
          margin-bottom: 0;
        }
      }

      .icon_wrapper {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.palette.customColors.lightYellow};
        color: ${({ theme }) => theme.palette.secondary.light};
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        
        svg {
          width: 24px;
          height: 24px;
        }
      }

      h3 {
        font-family: ${playFair.style.fontFamily};
        font-size: 20px;
        font-weight: 600;
        color: ${({ theme }) => theme.palette.primary.main};
        margin-bottom: 10px;
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 14px;
        line-height: 1.6;
        color: ${({ theme }) => theme.palette.customColors.textColor};
        max-width: 280px;
        margin: 0 auto;
      }
    }
  }
`;
