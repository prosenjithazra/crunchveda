import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const FaqSectionWrapper = styled("section")`
  position: relative;
  padding: 80px 0;
  background: ${({ theme }) => theme.palette.customColors?.greyLightBg};

  @media (max-width: 1199px) {
    padding: 60px 0;
  }
  @media (max-width: 599px) {
    padding: 40px 0;
  }

  .faq_header {
    text-align: center;
    margin-bottom: 48px;
    @media(max-width: 1199px){
      margin-bottom: 32px;
    }
    @media(max-width: 599px){
      margin-bottom: 24px;
    }
    h2 {
      font-family: ${playFair.style.fontFamily};
      font-weight: 600;
      color: ${({ theme }) => theme.palette.primary.dark};
      margin: 0;
    }
  }

  .faq_container {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .faq_item {
    background: ${({ theme }) => theme.palette.background.paper};
    border-radius: 16px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.02);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.03);

    &.active {
      box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.04);
      border-color: rgba(32, 53, 39, 0.1);
    }
  }

  .faq_trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 24px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    font-family: ${playFair.style.fontFamily};
    font-weight: 600;
    font-size: 20px;
    color: ${({ theme }) => theme.palette.primary.dark};
    transition: color 0.2s ease;

    @media (max-width: 599px) {
      padding: 18px 20px;
      font-size: 16px;
    }

    &:hover {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  .faq_caret {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.customColors?.lightGrey};
    color: ${({ theme }) => theme.palette.primary.dark};
    transition: transform 0.3s ease, background-color 0.3s ease;
    flex-shrink: 0;
    margin-left: 16px;

    svg {
      width: 12px;
      height: 12px;
      transition: stroke 0.3s ease;
    }
  }

  .faq_item.active .faq_caret {
    transform: rotate(180deg);
    background: ${({ theme }) => theme.palette.primary.main};
    color: ${({ theme }) => theme.palette.common.white};
  }

  .faq_content_wrapper {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
  }

  .faq_item.active .faq_content_wrapper {
    max-height: 500px;
    opacity: 1;
  }

  .faq_content {
    padding: 0 24px 24px 24px;
    font-family: ${outFit.style.fontFamily};
    font-weight: 400;
    font-size: 16px;
    line-height: 1.6;
    color: ${({ theme }) => theme.palette.text.secondary};

    @media (max-width: 599px) {
      padding: 0 20px 20px 20px;
      font-size: 14px;
    }
  }
`;
