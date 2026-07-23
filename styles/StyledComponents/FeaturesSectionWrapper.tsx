import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const FeaturesSectionWrapper = styled("section")`
  position: relative;
  padding: 52px 0;
  background: ${({ theme }) => theme.palette.customColors?.lightCream};
  @media (max-width: 1199px) {
    padding: 38px 0;
  }
  @media (max-width: 599px) {
    padding: 24px 0;
  }
  .features_grid {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;

    @media (max-width: 899px) {
      gap: 14px;
    }
  }

  .feature_card {
    flex: 1;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 16px 12px;

    @media (max-width: 599px) {
      width: 100%;
      min-width: 100%;
      padding: 10px 4px;
    }
  }

  .icon_box {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);

    @media (max-width: 599px) {
      width: 44px;
      height: 44px;
      margin-bottom: 8px;
      border-radius: 12px;
    }

    svg {
      width: 24px;
      height: 24px;
      @media (max-width: 599px) {
        width: 20px;
        height: 20px;
      }
    }

    &.organic_bg {
      background: ${({ theme }) => theme.palette.customColors.lightGreen};
      color: ${({ theme }) => theme.palette.primary.main};
    }

    &.quality_bg {
      background: ${({ theme }) => theme.palette.customColors.lightYellow};
      color: ${({ theme }) => theme.palette.warning.dark};
    }

    &.delivery_bg {
      background: ${({ theme }) => theme.palette.customColors.lightOrange};
      color: ${({ theme }) => theme.palette.customColors.orangeText};
    }

    &.packing_bg {
      background: ${({ theme }) => theme.palette.customColors.lightGray};
      color: ${({ theme }) => theme.palette.primary.dark};
    }
  }

  .feature_title {
    font-family: ${playFair.style.fontFamily};
    font-weight: 600;
    font-size: 18px;
    color: ${({ theme }) => theme.palette.primary.dark};
    margin-bottom: 6px;
    @media (max-width: 599px) {
      font-size: 15px;
      margin-bottom: 4px;
    }
  }

  .feature_desc {
    font-family: ${outFit.style.fontFamily};
    font-weight: 400;
    font-size: 13px;
    line-height: 1.45;
    color: ${({ theme }) => theme.palette.text.secondary};
    max-width: 240px;
    margin: 0 auto;
    @media (max-width: 599px) {
      font-size: 12px;
      line-height: 1.35;
    }
  }
`;
