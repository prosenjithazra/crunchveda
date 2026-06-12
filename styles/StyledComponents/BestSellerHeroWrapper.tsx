import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const BestSellerHeroWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 80px 0 60px;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};

  @media(max-width: 1199px) {
    padding: 60px 0 40px;
  }
  @media(max-width: 599px) {
    padding: 40px 0 20px;
  }

  .header_box {
    max-width: 680px;
    margin-bottom: 56px;
    @media(max-width: 599px) {
      margin-bottom: 36px;
    }
  }

  .section_tag {
    font-family: ${outFit.style.fontFamily};
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2.6px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.secondary.light};
    margin-bottom: 12px;
    display: inline-block;
    @media(max-width: 599px) {
      font-size: 11px;
      margin-bottom: 8px;
    }
  }

  .section_title_large {
    font-family: ${playFair.style.fontFamily};
    font-size: 44px;
    font-weight: 700;
    line-height: 1.2;
    color: ${({ theme }) => theme.palette.primary.main};
    margin-bottom: 20px;
    @media(max-width: 1199px) {
      font-size: 36px;
    }
    @media(max-width: 599px) {
      font-size: 28px;
      margin-bottom: 10px;
    }
  }

  .hero_desc {
    font-family: ${outFit.style.fontFamily};
    font-size: 15px;
    line-height: 1.65;
    color: ${({ theme }) => theme.palette.customColors.textColor};
    margin: 0;
    @media(max-width: 599px) {
      font-size: 14px;
    }
  }

  .dates_imgBox {
    position: relative;
    width: 100%;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.05);
    aspect-ratio: 1.15 / 1;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    border-radius: 20px;
    overflow: hidden;
    }

    .badge_overlay {
      position: absolute;
      bottom: -16px;
      right: -16px;
      z-index: 3;
      background-color: ${({ theme }) => theme.palette.primary.dark};
      color: #ffffff;
      padding: 32px;
      border-top-left-radius: 20px;
      max-width: 320px;
      box-shadow: -8px -8px 30px rgba(11, 32, 19, 0.1);
    border-radius: 16px;
      @media(max-width: 599px) {
        padding: 20px;
        max-width: 240px;
        border-radius: 12px;
      }

      .badge_tag {
        font-family: ${outFit.style.fontFamily};
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.palette.warning.light};
        margin-bottom: 6px;
      }

      .badge_title {
        font-family: ${playFair.style.fontFamily};
        font-size: 24px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 6px;
        @media(max-width: 599px) {
          font-size: 18px;
        }
      }

      .badge_sub {
        font-family: ${outFit.style.fontFamily};
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
      }
    }
  }

  .provenance_box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding-left: 20px;
    @media(max-width: 899px) {
      padding-left: 0;
      margin-top: 40px;
    }
    button{
      width: auto;
      display: inline-flex;
      max-width: 200px;
    }
  }

  .feature_list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 24px 0 32px;
    
    .feature_item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: ${outFit.style.fontFamily};
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.primary.main};
      
      svg {
        width: 18px;
        height: 18px;
        color: ${({ theme }) => theme.palette.secondary.light};
      }
  }
}
`;
