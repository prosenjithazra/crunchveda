import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const StoryWrapper = styled("div")`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};
  padding-bottom: 80px;
  /* ── 1. Hero Banner ── */
  .story_hero {
    position: relative;
    width: 100%;
    height: 640px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;

    @media (max-width: 899px) {
      height: 520px;
      padding-bottom: 60px;
    }
    @media (max-width: 599px) {
      height: 460px;
      padding-bottom: 40px;
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
        width: 100%;
        height: 100%;
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
        180deg,
        rgba(11, 32, 19, 0.4) 0%,
        rgba(11, 32, 19, 0.8) 100%
      );
    }

    .hero_content {
      position: relative;
      z-index: 3;
      color: ${({ theme }) => theme.palette.common.white};
      max-width: 720px;
      padding: 0 24px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .hero_subtitle {
        font-family: ${outFit.style.fontFamily};
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.palette.warning.light};
        margin-bottom: 16px;
      }

      h1 {
        font-family: ${playFair.style.fontFamily};
        font-size: 54px;
        font-weight: 700;
        line-height: 1.15;
        margin-bottom: 20px;
        color: ${({ theme }) => theme.palette.common.white};

        @media (max-width: 1199px) {
          font-size: 44px;
        }
        @media (max-width: 899px) {
          font-size: 36px;
        }
        @media (max-width: 599px) {
          font-size: 28px;
        }
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 16px;
        line-height: 1.6;
        opacity: 0.9;
        margin-bottom: 32px;
        max-width: 540px;

        @media (max-width: 599px) {
          font-size: 14px;
          margin-bottom: 24px;
        }
      }
    }
  }
  /* ── 2. Legacy Section ── */
  .legacy_section {
    padding: 100px 0;

    @media (max-width: 899px) {
      padding: 60px 0;
    }

    .legacy_subtitle {
      font-family: ${outFit.style.fontFamily};
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.secondary.light};
      margin-bottom: 12px;
    }

    h2 {
      font-family: ${playFair.style.fontFamily};
      font-size: 40px;
      font-weight: 700;
      line-height: 1.25;
      color: ${({ theme }) => theme.palette.primary.main};
      margin-bottom: 24px;

      @media (max-width: 899px) {
        font-size: 32px;
      }
      @media (max-width: 599px) {
        font-size: 26px;
      }
    }

    p {
      font-family: ${outFit.style.fontFamily};
      font-size: 15px;
      line-height: 1.7;
      color: ${({ theme }) => theme.palette.customColors.textColor};
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .legacy_image_box {
      position: relative;
      width: 100%;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06);
      aspect-ratio: 1.1 / 1;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  /* ── 3. Philosophy Section ── */
  .philosophy_section {
    background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};
    padding: 100px 0;
    text-align: center;

    @media (max-width: 899px) {
      padding: 60px 0;
    }

    .philosophy_header {
      max-width: 680px;
      margin: 0 auto 56px auto;

      h2 {
        font-family: ${playFair.style.fontFamily};
        font-size: 36px;
        font-weight: 700;
        color: ${({ theme }) => theme.palette.primary.main};
        margin-bottom: 16px;

        @media (max-width: 599px) {
          font-size: 28px;
        }
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 16px;
        line-height: 1.6;
        color: ${({ theme }) => theme.palette.customColors.textColor};

        @media (max-width: 599px) {
          font-size: 14px;
        }
      }
    }

    .philosophy_card {
      background-color: ${({ theme }) => theme.palette.common.white};
      padding: 40px 32px;
      border-radius: 20px;
      height: 100%;
      text-align: left;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;

      @media (max-width: 1199px) {
        padding: 32px 24px;
      }

      .card_icon_box {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background-color: ${({ theme }) =>
          theme.palette.customColors.lightGreen};
        color: ${({ theme }) => theme.palette.primary.main};
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;

        svg {
          width: 24px;
          height: 24px;
        }
      }

      h3 {
        font-family: ${playFair.style.fontFamily};
        font-size: 22px;
        font-weight: 600;
        color: ${({ theme }) => theme.palette.primary.main};
        margin-bottom: 12px;
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
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.05);
      }
    }
  }

  /* ── 4. Timeline Section ── */
  .timeline_section {
    padding: 100px 0;

    @media (max-width: 899px) {
      padding: 60px 0;
    }

    .timeline_header {
      text-align: center;
      margin-bottom: 80px;

      @media (max-width: 599px) {
        margin-bottom: 40px;
      }

      h2 {
        font-family: ${playFair.style.fontFamily};
        font-size: 36px;
        font-weight: 700;
        color: ${({ theme }) => theme.palette.primary.main};
        margin: 0;

        @media (max-width: 599px) {
          font-size: 28px;
        }
      }
    }

    .timeline_container {
      position: relative;
      max-width: 1000px;
      margin: 0 auto;

      /* Center Line */
      &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 1px;
        background-color: ${({ theme }) => theme.palette.divider};
        z-index: 1;

        @media (max-width: 899px) {
          left: 20px;
        }
      }
    }

    .timeline_item {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 96px;

      @media (max-width: 899px) {
        flex-direction: column;
        align-items: flex-start;
        padding-left: 48px;
        margin-bottom: 64px;
      }

      &:last-child {
        margin-bottom: 0;
      }

      /* Alternating logic */
      &:nth-of-type(even) {
        flex-direction: row-reverse;

        @media (max-width: 899px) {
          flex-direction: column;
        }

        .timeline_content_col {
          padding-left: 0;
          padding-right: 64px;

          @media (max-width: 1199px) {
            padding-right: 40px;
          }
          @media (max-width: 899px) {
            padding-right: 0;
          }
        }
      }

      /* Center bullet marker */
      .timeline_node {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.palette.secondary.light};
        border: 4px solid
          ${({ theme }) => theme.palette.customColors.lightCream};
        box-shadow: 0 0 0 1px ${({ theme }) => theme.palette.divider};
        z-index: 2;

        @media (max-width: 899px) {
          left: 20px;
          top: 24px;
          transform: translate(-50%, 0);
        }
      }

      .timeline_content_col {
        width: 45%;
        padding-left: 64px;

        @media (max-width: 1199px) {
          padding-left: 40px;
        }
        @media (max-width: 899px) {
          width: 100%;
          padding-left: 0;
          margin-bottom: 24px;
        }

        .timeline_year {
          font-family: ${outFit.style.fontFamily};
          font-size: 24px;
          font-weight: 700;
          color: ${({ theme }) => theme.palette.secondary.light};
          margin-bottom: 8px;
          line-height: 1;
        }

        .timeline_title {
          font-family: ${playFair.style.fontFamily};
          font-size: 28px;
          font-weight: 600;
          color: ${({ theme }) => theme.palette.primary.main};
          margin-bottom: 16px;

          @media (max-width: 599px) {
            font-size: 22px;
          }
        }

        .timeline_desc {
          font-family: ${outFit.style.fontFamily};
          font-size: 15px;
          line-height: 1.6;
          color: ${({ theme }) => theme.palette.customColors.textColor};
        }
      }

      .timeline_image_col {
        width: 45%;

        @media (max-width: 899px) {
          width: 100%;
          max-width: 480px;
        }

        .timeline_img_box {
          position: relative;
          width: 100%;
          aspect-ratio: 1.5 / 1;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          background-color: ${({ theme }) =>
            theme.palette.customColors.greyLightBg};

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }

  /* ── 5. Provenance Banner CTA ── */
  .provenance_banner {
    position: relative;
    background-color: ${({ theme }) => theme.palette.primary.dark};
    color: ${({ theme }) => theme.palette.common.white};
    border-radius: 32px;
    padding: 80px;
    text-align: center;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(11, 32, 19, 0.15);

    @media (max-width: 899px) {
      padding: 60px 40px;
    }
    @media (max-width: 599px) {
      border-radius: 20px;
      padding: 48px 24px;
    }

    .provenance_content {
      position: relative;
      z-index: 2;
      max-width: 600px;
      margin: 0 auto;

      h2 {
        font-family: ${playFair.style.fontFamily};
        font-size: 40px;
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 16px;
        color: ${({ theme }) => theme.palette.common.white};

        @media (max-width: 599px) {
          font-size: 30px;
        }
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 15px;
        line-height: 1.7;
        opacity: 0.9;
        margin-bottom: 36px;

        @media (max-width: 599px) {
          font-size: 14px;
          margin-bottom: 28px;
        }
      }

      .btn_group {
        display: flex;
        justify-content: center;
        gap: 16px;

        @media (max-width: 599px) {
          flex-direction: column;
          gap: 12px;
          align-items: stretch;
        }
      }
    }
  }
`;
