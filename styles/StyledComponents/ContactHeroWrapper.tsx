import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const ContactHeroWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 48px 0 28px;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};

  @media (max-width: 899px) {
    padding: 32px 0 20px;
  }
  @media (max-width: 599px) {
    padding: 20px 0 12px;
  }

  .hero_text_col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
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
    margin-bottom: 24px;
    @media(max-width: 1199px) {
      font-size: 36px;
      margin-bottom: 18px;
    }
    @media(max-width: 599px) {
      font-size: 28px;
      margin-bottom: 8px;
    }
  }

  .hero_desc {
    font-family: ${outFit.style.fontFamily};
    font-size: 16px;
    line-height: 1.6;
    color: ${({ theme }) => theme.palette.customColors.textColor};
    max-width: 480px;
    margin-bottom: 0;
    @media(max-width: 599px) {
      font-size: 14px;
    }
  }

  .hero_imgBox {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.04);
    aspect-ratio: 1.25 / 1;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
`;
