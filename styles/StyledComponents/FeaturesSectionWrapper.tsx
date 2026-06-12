import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const FeaturesSectionWrapper = styled("section")`
  position: relative;
  padding: 80px 0;
  background: ${({ theme }) => theme.palette.customColors?.lightCream};
  @media (max-width: 1199px) {
    padding: 60px 0;
  }
  @media (max-width: 599px) {
    padding: 40px 0;
  }
  .features_grid {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    flex-wrap: wrap;

    @media (max-width: 899px) {
      gap: 20px;
    }
  }

  .feature_card {
    flex: 1;
    min-width: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px 16px;

    @media (max-width: 599px) {
      width: 100%;
      min-width: 100%;
      padding: 16px 8px;
    }
  }

  .icon_box {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);

    svg {
      width: 28px;
      height: 28px;
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
    font-size: 20px;
    color: ${({ theme }) => theme.palette.primary.dark};
    margin-bottom: 12px;
  }

  .feature_desc {
    font-family: ${outFit.style.fontFamily};
    font-weight: 400;
    font-size: 14px;
    line-height: 1.6;
    color: ${({ theme }) => theme.palette.text.secondary};
    max-width: 260px;
    margin: 0 auto;
  }
`;
