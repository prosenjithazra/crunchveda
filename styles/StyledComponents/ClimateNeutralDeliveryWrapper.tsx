import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const ClimateNeutralDeliveryWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 48px 0;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};

  @media (max-width: 1199px) {
    padding: 36px 0;
  }
  @media (max-width: 899px) {
    padding: 24px 0;
  }

  .stats_col {
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: center;
    height: 100%;
  }

  .stat_card {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 32px 24px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    transition: transform 0.3s ease;

    @media(max-width: 599px) {
      padding: 24px 16px;
    }

    .stat_num {
      font-family: ${playFair.style.fontFamily};
      font-size: 36px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.main};
      margin-bottom: 6px;
      line-height: 1;
      @media(max-width: 599px) {
        font-size: 28px;
      }
    }

    .stat_label {
      font-family: ${outFit.style.fontFamily};
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.secondary.light};
      margin: 0;
    }

    &:hover {
      transform: translateY(-2px);
    }
  }

  .narrative_col {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding-left: 40px;
    @media(max-width: 899px) {
      padding-left: 0;
      margin-top: 40px;
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
    margin-bottom: 24px;
    @media(max-width: 1199px) {
      font-size: 32px;
      margin-bottom: 18px;
    }
    @media(max-width: 599px) {
      font-size: 26px;
      margin-bottom: 12px;
    }
  }

  .delivery_desc {
    font-family: ${outFit.style.fontFamily};
    font-size: 15px;
    line-height: 1.65;
    color: ${({ theme }) => theme.palette.customColors.textColor};
    margin-bottom: 32px;
    @media(max-width: 599px) {
      font-size: 14px;
      margin-bottom: 24px;
    }
  }

  .reportBtn {
    width: auto;
    display: inline-flex;
    max-width: 240px;
  }
`;
