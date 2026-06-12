import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const RegenerativeAgricultureWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 80px 0;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};

  @media(max-width: 1199px) {
    padding: 60px 0;
  }
  @media(max-width: 899px) {
    padding: 40px 0;
  }

  .text_col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding-right: 40px;
    @media(max-width: 899px) {
      padding-right: 0;
      margin-bottom: 40px;
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
    font-size: 40px;
    font-weight: 700;
    line-height: 1.25;
    color: ${({ theme }) => theme.palette.primary.main};
    margin-bottom: 32px;
    @media(max-width: 1199px) {
      font-size: 32px;
      margin-bottom: 24px;
    }
    @media(max-width: 599px) {
      font-size: 26px;
      margin-bottom: 18px;
    }
  }

  .feature_list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .feature_box {
    background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};
    border-radius: 12px;
    padding: 24px;
    display: flex;
    gap: 20px;
    align-items: flex-start;
    transition: all 0.3s ease;

    @media(max-width: 599px) {
      padding: 18px;
      gap: 14px;
    }

    .icon_box {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: #ffffff;
      color: ${({ theme }) => theme.palette.primary.main};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .feature_text {
      h3 {
        font-family: ${playFair.style.fontFamily};
        font-size: 20px;
        font-weight: 600;
        color: ${({ theme }) => theme.palette.primary.main};
        margin-bottom: 8px;
        @media(max-width: 599px) {
          font-size: 17px;
          margin-bottom: 4px;
        }
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 14px;
        line-height: 1.6;
        color: ${({ theme }) => theme.palette.customColors.textColor};
        margin: 0;
      }
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
    }
  }

  .crop_imgBox {
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
    aspect-ratio: 1 / 1;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
`;
