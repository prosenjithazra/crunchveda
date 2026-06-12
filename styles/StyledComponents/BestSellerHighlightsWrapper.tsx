import { styled } from "@mui/material";
import { outFit } from "@/mui-theme/_muiTheme";

export const BestSellerHighlightsWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 40px 0 100px;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};

  @media(max-width: 1199px) {
    padding-bottom: 80px;
  }
  @media(max-width: 599px) {
    padding-bottom: 60px;
  }

  .highlight_col {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 16px;
  }

  .icon_box {
    color: ${({ theme }) => theme.palette.secondary.light};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 28px;
      height: 28px;
    }
  }

  .highlight_title {
    font-family: ${outFit.style.fontFamily};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.primary.main};
    margin-bottom: 8px;
  }

  .highlight_desc {
    font-family: ${outFit.style.fontFamily};
    font-size: 14px;
    line-height: 1.6;
    color: ${({ theme }) => theme.palette.customColors.textColor};
    margin: 0;
    max-width: 280px;
  }
`;
