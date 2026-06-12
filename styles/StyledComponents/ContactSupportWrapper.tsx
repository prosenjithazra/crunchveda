import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const ContactSupportWrapper = styled("section")`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};
  padding: 80px 0 100px;

  @media(max-width: 1199px) {
    padding: 60px 0 80px;
  }
  @media(max-width: 599px) {
    padding: 40px 0 60px;
  }

  .support_header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
    @media(max-width: 599px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
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

  .browse_link {
    font-family: ${outFit.style.fontFamily};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.primary.main};
    text-decoration: underline;
    text-underline-offset: 4px;
    transition: opacity 0.2s ease;
    display: inline-block;
    margin-bottom: 6px;

    &:hover {
      opacity: 0.8;
    }
  }

  .support_card {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 40px 32px;
    height: 100%;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.01);
    transition: all 0.3s ease;

    @media(max-width: 1199px) {
      padding: 32px 24px;
    }

    &.highlighted {
      background-color: ${({ theme }) => theme.palette.customColors.lightGrey};
      box-shadow: none;
    }

    .card_icon {
      color: ${({ theme }) => theme.palette.primary.main};
      margin-bottom: 28px;
      display: flex;
      align-items: center;

      svg {
        width: 32px;
        height: 32px;
        stroke-width: 1.5;
      }
    }

    h3 {
      font-family: ${playFair.style.fontFamily};
      font-size: 24px;
      font-weight: 600;
      color: ${({ theme }) => theme.palette.primary.main};
      margin-bottom: 12px;
      @media(max-width: 599px) {
        font-size: 20px;
      }
    }

    p {
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      line-height: 1.6;
      color: ${({ theme }) => theme.palette.customColors.textColor};
      margin: 0;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.03);
    }
  }
`;
