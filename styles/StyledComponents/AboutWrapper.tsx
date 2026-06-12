import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const AboutWrapper = styled("div")`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};

  /* ── Common Utilities ── */
  .section_pad {
    padding: 80px 0;
    @media(max-width: 1199px) {
      padding: 60px 0;
    }
    @media(max-width: 599px) {
      padding: 40px 0;
    }
  }

  .section_title_small {
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
      margin-bottom: 4px;
    }
  }

  .body_desc {
    font-family: ${outFit.style.fontFamily};
    font-size: 16px;
    line-height: 1.6;
    color: ${({ theme }) => theme.palette.customColors.textColor};
    margin-bottom: 24px;
    @media(max-width: 599px) {
      font-size: 14px;
      margin-bottom: 8px;
    }
  }

  /* ── 1. Hero Banner ── */
  .about_hero {
    position: relative;
    width: 100%;
    height: 520px;
    display: flex;
    align-items: flex-end;
    padding-bottom: 64px;
    overflow: hidden;
    @media(max-width: 899px) {
      height: 440px;
      padding-bottom: 48px;
    }
    @media(max-width: 599px) {
      height: 380px;
      padding-bottom: 32px;
    }

    .hero_bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      
      img {
        object-fit: cover;
      }
    }

    .hero_overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      background: linear-gradient(
        to bottom,
        rgba(11, 32, 19, 0.2) 20%,
        rgba(11, 32, 19, 0.8) 100%
      );
    }

    .hero_content {
      position: relative;
      z-index: 3;
      color: ${({ theme }) => theme.palette.common.white};
      max-width: 800px;

      h1 {
        font-family: ${playFair.style.fontFamily};
        font-size: 56px;
        font-weight: 700;
        margin-bottom: 16px;
        line-height: 1.15;
        @media(max-width: 1199px) {
          font-size: 44px;
        }
        @media(max-width: 899px) {
          font-size: 36px;
        }
        @media(max-width: 599px) {
          font-size: 28px;
          margin-bottom: 10px;
        }
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 18px;
        line-height: 1.5;
        opacity: 0.9;
        max-width: 600px;
        @media(max-width: 899px) {
          font-size: 16px;
        }
        @media(max-width: 599px) {
          font-size: 14px;
        }
      }
    }
  }

  /* ── 2. Stewardship Section ── */
  .stewardship_row {
    display: flex;
    align-items: center;
    
    .stewardship_quote {
      border-left: 3px solid ${({ theme }) => theme.palette.secondary.light};
      padding-left: 20px;
      margin-top: 28px;
      margin-bottom: 0;
      @media(max-width: 599px){
        margin-top: 15px;
        padding-left: 10px;
      }
      
      p {
        font-family: ${playFair.style.fontFamily};
        font-size: 18px;
        font-style: italic;
        line-height: 1.6;
        color: ${({ theme }) => theme.palette.primary.main};
        margin: 0;
        @media(max-width: 599px) {
          font-size: 16px;
        }
      }
    }

    .stewardship_imgBox {
      position: relative;
      width: 100%;
      border-radius: 20px;
      overflow: visible;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);

      .farmer_img {
        width: 100%;
        height: auto;
        border-radius: 20px;
        object-fit: cover;
        display: block;
        @media(max-width: 599px) {
          border-radius: 12px;
        }
      }

      .floating_badge {
        position: absolute;
        bottom: -20px;
        left: -20px;
        z-index: 3;
        background-color: ${({ theme }) => theme.palette.primary.dark};
        color: ${({ theme }) => theme.palette.warning.light};
        padding: 20px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        max-width: 180px;

        @media(max-width: 599px) {
          padding: 14px 16px;
          bottom: -15px;
          left: -10px;
          max-width: 140px;
        }

        .badge_num {
          font-family: ${playFair.style.fontFamily};
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 4px;
          @media(max-width: 599px) {
            font-size: 20px;
          }
        }

        .badge_txt {
          font-family: ${outFit.style.fontFamily};
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          line-height: 1.3;
          opacity: 0.9;
          @media(max-width: 599px) {
            font-size: 9px;
            letter-spacing: 1px;
          }
        }
      }
    }
  }

  /* ── 3. Artisanal Journey ── */
  .artisanal_journey {
    background-color: ${({ theme }) => theme.palette.customColors.lightPaperBg};
    text-align: center;

    .title_box {
      max-width: 600px;
      margin: 0 auto 56px;
      @media(max-width: 599px) {
        margin-bottom: 32px;
      }
    }

    .journey_card {
      text-align: left;
      
      .journey_imgBox {
        position: relative;
        width: 100%;
        aspect-ratio: 1.2 / 1;
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 24px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};
        @media(max-width: 1199px) {
          border-radius: 12px;
        }
        @media(max-width: 599px) {
          border-radius: 8px;
          margin-bottom: 8px;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
      }

      &:hover {
        .journey_imgBox img {
          transform: scale(1.05);
        }
      }

      h3 {
        font-family: ${playFair.style.fontFamily};
        font-size: 22px;
        font-weight: 600;
        color: ${({ theme }) => theme.palette.primary.main};
        margin-bottom: 12px;
        @media(max-width: 599px) {
          font-size: 18px;
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
  }

  /* ── 4. Quote Section ── */
  .quote_banner {
    position: relative;
    background-color: ${({ theme }) => theme.palette.primary.dark};
    color: ${({ theme }) => theme.palette.common.white};
    text-align: center;
    padding: 100px 0;
    overflow: hidden;
    @media(max-width: 899px) {
      padding: 72px 0;
    }
    @media(max-width: 599px) {
      padding: 56px 0;
    }

    .quote_symbol {
      font-size: 80px;
      line-height: 1;
      font-family: ${playFair.style.fontFamily};
      color: ${({ theme }) => theme.palette.warning.light};
      margin-bottom: 24px;
      display: inline-block;
      @media(max-width: 599px) {
        font-size: 56px;
        line-height: 1;
        margin-bottom: 2px;
      }
    }

    h2 {
      font-family: ${playFair.style.fontFamily};
      color: ${({ theme }) => theme.palette.common.white};
      font-size: 28px;
      font-weight: 500;
      line-height: 1.5;
      font-style: italic;
      max-width: 840px;
      margin: 0 auto 32px;
      padding: 0 24px;
      @media(max-width: 1199px) {
        font-size: 24px;
      }
      @media(max-width: 899px) {
        font-size: 20px;
      }
      @media(max-width: 599px) {
        font-size: 18px;
        margin-bottom: 20px;
        line-height: 1.6;
      }
    }

    .quote_author {
      font-family: ${outFit.style.fontFamily};
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.warning.light};
    }
  }

  /* ── 5. Sustainability Charter ── */
  .charter_section {
    .charter_header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 48px;
      @media(max-width: 899px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 36px;
      }
      @media(max-width: 599px) {
        gap: 6px;
        margin-bottom: 24px;
      }
      
      .header_text {
        max-width: 600px;
      }
    }

    .charter_card {
      background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};
      padding: 32px 24px;
      border-radius: 16px;
      height: 100%;
      transition: all 0.3s ease;
      @media(max-width: 1199px) {
        padding: 24px 20px;
      }
      @media(max-width: 599px) {
        padding: 20px 16px;
        border-radius: 12px;
      }

      .card_icon_box {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.palette.customColors.lightYellow};
        color: ${({ theme }) => theme.palette.secondary.light};
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;

        svg {
          width: 20px;
          height: 20px;
        }
      }

      h4 {
        font-family: ${outFit.style.fontFamily};
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.palette.primary.main};
        margin-bottom: 10px;
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 14px;
        line-height: 1.6;
        color: ${({ theme }) => theme.palette.customColors.textColor};
        margin: 0;
      }

      &:hover {
        background-color: ${({ theme }) => theme.palette.customColors.lightPaperBg};
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        transform: translateY(-3px);
      }
    }
  }
`;
