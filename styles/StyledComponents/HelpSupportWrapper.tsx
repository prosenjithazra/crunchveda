import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const HelpSupportWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 40px 0 60px 0;
  background-color: ${({ theme }) => theme.palette.customColors?.lightCream || "#FCF9F2"};

  @media (max-width: 1199px) {
    padding: 28px 0 44px 0;
  }
  @media (max-width: 599px) {
    padding: 16px 0 32px 0;
  }

  .help_container {
    max-width: 1140px;
    margin: 0 auto;
  }

  /* ── Hero Header ── */
  .help_header {
    text-align: center;
    max-width: 780px;
    margin: 0 auto 40px auto;

    .help_tag {
      font-family: ${outFit.style.fontFamily};
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2.2px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.secondary.light || "#B88900"};
      margin-bottom: 12px;
      display: inline-block;
    }

    h1 {
      font-family: ${playFair.style.fontFamily};
      font-size: 48px;
      font-weight: 700;
      line-height: 1.15;
      color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
      margin: 0 0 16px 0;

      @media (max-width: 1199px) {
        font-size: 38px;
      }
      @media (max-width: 599px) {
        font-size: 28px;
      }
    }

    .header_desc {
      font-family: ${outFit.style.fontFamily};
      font-size: 16px;
      line-height: 1.6;
      color: ${({ theme }) => theme.palette.customColors?.textColor || "#5F5E59"};
      margin: 0 0 32px 0;

      @media (max-width: 599px) {
        font-size: 14px;
      }
    }
  }

  /* ── Search Bar Box ── */
  .search_box {
    position: relative;
    max-width: 600px;
    margin: 0 auto 40px auto;

    .search_input {
      width: 100%;
      background: #ffffff;
      border: 1px solid rgba(11, 32, 19, 0.12);
      border-radius: 50px;
      padding: 16px 24px 16px 54px;
      font-family: ${outFit.style.fontFamily};
      font-size: 15px;
      color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      outline: none;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
      transition: all 0.25s ease;

      &:focus {
        border-color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
        box-shadow: 0 6px 24px rgba(11, 32, 19, 0.08);
      }

      &::placeholder {
        color: ${({ theme }) => theme.palette.text.secondary || "#8E8D88"};
      }
    }

    .search_icon {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: ${({ theme }) => theme.palette.secondary.light || "#B88900"};
      pointer-events: none;
      width: 22px;
      height: 22px;
    }
  }

  /* ── Category Filter Pills ── */
  .category_pills {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 48px;

    @media (max-width: 599px) {
      gap: 8px;
      margin-bottom: 32px;
    }

    .pill_btn {
      font-family: ${outFit.style.fontFamily};
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      padding: 10px 22px;
      border-radius: 30px;
      border: 1px solid rgba(11, 32, 19, 0.12);
      background: #ffffff;
      color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      cursor: pointer;
      transition: all 0.25s ease;

      @media (max-width: 599px) {
        font-size: 11px;
        padding: 8px 16px;
      }

      &:hover {
        background: ${({ theme }) => theme.palette.customColors?.greyLightBg || "#F6F3EC"};
        border-color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
      }

      &.active {
        background: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
        color: #ffffff;
        border-color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
        box-shadow: 0 4px 14px rgba(11, 32, 19, 0.15);
      }
    }
  }

  /* ── Two-Column Main Layout ── */
  .split_layout {
    display: flex;
    gap: 48px;
    align-items: flex-start;

    @media (max-width: 1199px) {
      gap: 32px;
    }
    @media (max-width: 899px) {
      flex-direction: column;
      gap: 40px;
    }
  }

  .doc_main_column {
    flex: 1;
    min-width: 0;
  }

  .doc_sidebar_column {
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: sticky;
    top: 100px;

    @media (max-width: 1199px) {
      width: 280px;
    }
    @media (max-width: 899px) {
      width: 100%;
      position: static;
    }
  }

  /* ── FAQ Section Block ── */
  .faq_section_block {
    margin-bottom: 56px;

    &:last-child {
      margin-bottom: 0;
    }

    @media (max-width: 599px) {
      margin-bottom: 36px;
    }

    .section_title_row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;

      .section_num {
        font-family: ${playFair.style.fontFamily};
        font-size: 32px;
        font-weight: 700;
        line-height: 1;
        color: ${({ theme }) => theme.palette.secondary.light || "#B88900"};
        flex-shrink: 0;
      }

      h2 {
        font-family: ${playFair.style.fontFamily};
        font-size: 28px;
        font-weight: 700;
        color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
        margin: 0;

        @media (max-width: 599px) {
          font-size: 22px;
        }
      }
    }
  }

  /* ── Custom Accordion ── */
  .help_accordion {
    background: #ffffff !important;
    border-radius: 16px !important;
    border: 1px solid rgba(11, 32, 19, 0.08) !important;
    margin-bottom: 14px !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02) !important;
    overflow: hidden;

    &:before {
      display: none !important;
    }

    &.Mui-expanded {
      border-color: ${({ theme }) => theme.palette.secondary.light || "#B88900"} !important;
      box-shadow: 0 4px 20px rgba(11, 32, 19, 0.06) !important;
    }

    .MuiAccordionSummary-root {
      padding: 16px 24px !important;

      @media (max-width: 599px) {
        padding: 12px 16px !important;
      }

      .MuiAccordionSummary-content {
        margin: 0 !important;

        .faq_question {
          font-family: ${playFair.style.fontFamily};
          font-size: 18px;
          font-weight: 700;
          color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};

          @media (max-width: 599px) {
            font-size: 16px;
          }
        }
      }

      .MuiAccordionSummary-expandIconWrapper {
        color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      }
    }

    .MuiAccordionDetails-root {
      padding: 0 24px 20px 24px !important;
      border-top: 1px dashed rgba(11, 32, 19, 0.06);
      padding-top: 16px !important;

      @media (max-width: 599px) {
        padding: 0 16px 16px 16px !important;
      }

      .faq_answer {
        font-family: ${outFit.style.fontFamily};
        font-size: 15px;
        line-height: 1.65;
        color: ${({ theme }) => theme.palette.customColors?.textColor || "#5F5E59"};
        margin: 0;

        @media (max-width: 599px) {
          font-size: 14px;
        }
      }
    }
  }

  /* ── Sidebar Cards ── */
  .concierge_card {
    background-color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
    border-radius: 20px;
    padding: 32px;
    color: #ffffff;
    box-shadow: 0 8px 30px rgba(11, 32, 19, 0.15);

    h3 {
      font-family: ${playFair.style.fontFamily};
      font-size: 26px;
      font-weight: 600;
      line-height: 1.25;
      color: #ffffff;
      margin: 0 0 16px 0;

      @media (max-width: 1199px) {
        font-size: 22px;
      }
    }

    p {
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.8);
      margin: 0 0 28px 0;
    }

    .concierge_btn {
      width: 100%;
      background-color: #ffffff;
      color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      font-family: ${outFit.style.fontFamily};
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 14px 20px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: ${({ theme }) => theme.palette.warning.light || "#EAC15D"};
        color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      }
    }
  }

  .quick_links_card {
    background-color: ${({ theme }) => theme.palette.customColors?.greyLightBg || "#F6F3EC"};
    border-radius: 20px;
    padding: 28px;
    border: 1px solid rgba(11, 32, 19, 0.05);

    h3 {
      font-family: ${outFit.style.fontFamily};
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
      margin: 0 0 20px 0;
      border-bottom: 1px solid rgba(11, 32, 19, 0.08);
      padding-bottom: 8px;
    }

    .links_list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      a {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: ${outFit.style.fontFamily};
        font-size: 14px;
        font-weight: 500;
        color: ${({ theme }) => theme.palette.text.primary || "#2B2A27"};
        text-decoration: none;
        padding: 8px 0;
        border-bottom: 1px dashed rgba(11, 32, 19, 0.05);
        transition: color 0.2s ease;

        svg {
          width: 14px;
          height: 14px;
          color: ${({ theme }) => theme.palette.text.secondary || "#5F5E59"};
          transition: transform 0.2s ease;
        }

        &:hover {
          color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};

          svg {
            transform: translateX(4px);
            color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
          }
        }
      }
    }
  }

  /* ── Bottom Service Footer ── */
  .support_service_block {
    text-align: center;
    border-top: 1px solid rgba(11, 32, 19, 0.1);
    margin-top: 80px;
    padding-top: 64px;

    @media (max-width: 599px) {
      margin-top: 48px;
      padding-top: 40px;
    }

    h2 {
      font-family: ${playFair.style.fontFamily};
      font-size: 36px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
      margin: 0 0 16px 0;

      @media (max-width: 599px) {
        font-size: 26px;
      }
    }

    .service_desc {
      font-family: ${outFit.style.fontFamily};
      font-size: 15px;
      line-height: 1.6;
      color: ${({ theme }) => theme.palette.text.secondary || "#5F5E59"};
      max-width: 620px;
      margin: 0 auto 32px auto;

      @media (max-width: 599px) {
        font-size: 14px;
        margin-bottom: 24px;
      }
    }

    .contact_links_row {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;

      @media (max-width: 599px) {
        gap: 12px;
      }

      .contact_item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: ${outFit.style.fontFamily};
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
        text-decoration: none;

        svg {
          width: 16px;
          height: 16px;
        }

        &:hover {
          color: ${({ theme }) => theme.palette.secondary.light || "#B88900"};
        }
      }

      .separator_dot {
        width: 6px;
        height: 6px;
        background-color: ${({ theme }) => theme.palette.secondary.light || "#B88900"};
        border-radius: 50%;
        display: inline-block;

        @media (max-width: 599px) {
          display: none;
        }
      }
    }
  }
`;
