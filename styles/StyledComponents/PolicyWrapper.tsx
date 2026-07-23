import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const PolicyWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 40px 0 60px 0;
  background-color: ${({ theme }) => theme.palette.customColors?.lightCream || "#FCF9F2"};

  @media (max-width: 1199px) {
    padding: 28px 0 44px 0;
  }
  @media (max-width: 599px) {
    padding: 16px 0 30px 0;
  }

  .policy_container {
    max-width: 1140px;
    margin: 0 auto;
  }

  /* ── Header Section ── */
  .policy_header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 1px solid rgba(11, 32, 19, 0.1);
    padding-bottom: 28px;
    margin-bottom: 32px;
    gap: 32px;

    @media(max-width: 899px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }
  }

  .header_left_block {
    max-width: 680px;

    .gov_tag {
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
      font-size: 46px;
      font-weight: 700;
      line-height: 1.15;
      color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
      margin: 0 0 16px 0;

      @media(max-width: 1199px) {
        font-size: 38px;
      }
      @media(max-width: 599px) {
        font-size: 28px;
      }
    }

    .header_desc {
      font-family: ${outFit.style.fontFamily};
      font-size: 15px;
      line-height: 1.6;
      color: ${({ theme }) => theme.palette.customColors?.textColor || "#5F5E59"};
      margin: 0;
      @media(max-width: 599px) {
        font-size: 14px;
      }
    }
  }

  .effective_date_box {
    text-align: right;
    flex-shrink: 0;

    @media(max-width: 899px) {
      text-align: left;
    }

    .date_label {
      font-family: ${outFit.style.fontFamily};
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.text.secondary || "#5F5E59"};
      margin-bottom: 4px;
      display: block;
    }

    .date_val {
      font-family: ${playFair.style.fontFamily};
      font-size: 24px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
      @media(max-width: 599px) {
        font-size: 20px;
      }
    }
  }

  /* ── Header Navigation Links Row ── */
  .policy_nav_row {
    display: flex;
    gap: 32px;
    margin-bottom: 48px;
    flex-wrap: wrap;
    border-bottom: 1px solid rgba(11, 32, 19, 0.05);
    padding-bottom: 16px;

    @media(max-width: 599px) {
      gap: 16px;
      margin-bottom: 32px;
    }

    .nav_item {
      font-family: ${outFit.style.fontFamily};
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.text.secondary || "#5F5E59"};
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: color 0.2s ease;

      span {
        color: ${({ theme }) => theme.palette.secondary.light || "#B88900"};
      }

      &:hover {
        color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
      }
    }
  }

  /* ── Two-Column Main Layout ── */
  .split_layout {
    display: flex;
    gap: 48px;
    align-items: flex-start;

    @media(max-width: 1199px) {
      gap: 32px;
    }
    @media(max-width: 899px) {
      flex-direction: column;
      gap: 40px;
    }
  }

  .doc_main_column {
    flex: 1;
    min-width: 0; /* fixes flex wrap issues */
  }

  .doc_sidebar_column {
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: sticky;
    top: 100px; /* aligns with header flow */

    @media(max-width: 1199px) {
      width: 280px;
    }
    @media(max-width: 899px) {
      width: 100%;
      position: static;
    }
  }

  /* ── Policy Document content (Left Side) ── */
  .section_block {
    margin-bottom: 56px;
    &:last-child {
      margin-bottom: 0;
    }

    @media(max-width: 599px) {
      margin-bottom: 36px;
    }
  }

  .section_title_row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;

    .section_num {
      font-family: ${playFair.style.fontFamily};
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
      color: ${({ theme }) => theme.palette.grey[300] || "#D2CFC7"};
      flex-shrink: 0;
      position: relative;
      top: -4px;

      @media(max-width: 599px) {
        font-size: 28px;
      }
    }

    h2 {
      font-family: ${playFair.style.fontFamily};
      font-size: 28px;
      font-weight: 700;
      line-height: 1.25;
      color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
      margin: 0;

      @media(max-width: 1199px) {
        font-size: 24px;
      }
      @media(max-width: 599px) {
        font-size: 20px;
      }
    }
  }

  .section_body {
    padding-left: 54px;

    @media(max-width: 599px) {
      padding-left: 0;
    }

    p {
      font-family: ${outFit.style.fontFamily};
      font-size: 15px;
      line-height: 1.65;
      color: ${({ theme }) => theme.palette.customColors?.textColor || "#5F5E59"};
      margin: 0 0 16px 0;

      &:last-child {
        margin-bottom: 0;
      }

      @media(max-width: 599px) {
        font-size: 14px;
      }
    }

    /* Warning/Important Blockquote */
    .warning_blockquote {
      background-color: ${({ theme }) => theme.palette.customColors?.greyLightBg || "#F6F3EC"};
      border-left: 4px solid ${({ theme }) => theme.palette.secondary.light || "#B88900"};
      padding: 24px;
      border-radius: 4px 12px 12px 4px;
      margin: 24px 0;

      @media(max-width: 599px) {
        padding: 16px;
        margin: 16px 0;
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 14px;
        font-style: italic;
        line-height: 1.6;
        color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
        margin: 0;
      }
    }

    /* Side-by-side Columns inside sections */
    .sub_columns_grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
      margin: 28px 0 16px 0;

      @media(max-width: 599px) {
        grid-template-columns: 1fr;
        gap: 20px;
        margin: 20px 0 12px 0;
      }

      .sub_col {
        h3 {
          font-family: ${outFit.style.fontFamily};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
          margin: 0 0 8px 0;
        }

        p {
          font-family: ${outFit.style.fontFamily};
          font-size: 13px;
          line-height: 1.6;
          color: ${({ theme }) => theme.palette.text.secondary || "#5F5E59"};
          margin: 0;
        }
      }
    }
  }

  /* ── Sidebar Cards (Right Side) ── */
  .concierge_card {
    background-color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
    border-radius: 20px;
    padding: 32px;
    color: ${({ theme }) => theme.palette.common.white || "#FFF"};
    box-shadow: 0 8px 30px rgba(11, 32, 19, 0.15);

    h3 {
      font-family: ${playFair.style.fontFamily};
      font-size: 26px;
      font-weight: 600;
      line-height: 1.25;
      color: ${({ theme }) => theme.palette.common.white || "#FFF"};
      margin: 0 0 16px 0;

      @media(max-width: 1199px) {
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
      background-color: ${({ theme }) => theme.palette.common.white || "#FFF"};
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
      transition: background-color 0.2s ease;

      &:hover {
        background-color: ${({ theme }) => theme.palette.warning.light || "#EAC15D"};
        color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      }
    }
  }

  .related_docs_card {
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

    .docs_links_list {
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
          transition: transform 0.2s ease, color 0.2s ease;
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

  .heritage_img_card {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    aspect-ratio: 1.25 / 1;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(11, 32, 19, 0) 50%, rgba(11, 32, 19, 0.8) 100%);
      z-index: 2;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 20px;
    }

    .heritage_card_btn {
      z-index: 3;
      background-color: ${({ theme }) => theme.palette.common.white || "#FFF"};
      color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      font-family: ${outFit.style.fontFamily};
      font-weight: 700;
      font-size: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 10px 20px;
      border-radius: 30px;
      border: none;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.25s ease;

      &:hover {
        background-color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
        color: ${({ theme }) => theme.palette.common.white || "#FFF"};
        transform: translateY(-2px);
      }
    }
  }

  /* ── Bottom Unrivaled Service Block ── */
  .unrivaled_service_block {
    text-align: center;
    border-top: 1px solid rgba(11, 32, 19, 0.1);
    margin-top: 80px;
    padding-top: 64px;

    @media(max-width: 599px) {
      margin-top: 48px;
      padding-top: 40px;
    }

    h2 {
      font-family: ${playFair.style.fontFamily};
      font-size: 36px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.main || "#0B2013"};
      margin: 0 0 16px 0;

      @media(max-width: 599px) {
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

      @media(max-width: 599px) {
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

      @media(max-width: 599px) {
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

        @media(max-width: 599px) {
          display: none;
        }
      }
    }
  }
`;
