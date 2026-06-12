import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const GiftsWrapper = styled("div")`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};
  padding: 80px 0;
  
  @media(max-width: 1199px) {
    padding: 60px 0;
  }
  @media(max-width: 599px) {
    padding: 40px 0;
  }

  /* ── Typography and Base ── */
  .section_subtitle {
    font-family: ${outFit.style.fontFamily};
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.secondary.light};
    margin-bottom: 12px;
    
    @media(max-width: 599px) {
      font-size: 11px;
      margin-bottom: 8px;
    }
  }

  .section_title {
    font-family: ${playFair.style.fontFamily};
    font-size: 48px;
    font-weight: 700;
    line-height: 1.2;
    color: ${({ theme }) => theme.palette.primary.main};
    margin-bottom: 24px;
    
    @media(max-width: 899px) {
      font-size: 38px;
    }
    @media(max-width: 599px) {
      font-size: 30px;
      margin-bottom: 16px;
    }
  }

  /* ── Header Intro ── */
  .header_section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 64px;
    gap: 48px;
    
    @media(max-width: 899px) {
      flex-direction: column;
      gap: 24px;
      margin-bottom: 40px;
    }

    .header_left {
      flex: 1;
      max-width: 600px;
    }

    .header_right {
      flex: 1;
      max-width: 480px;
      
      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 15px;
        line-height: 1.7;
        color: ${({ theme }) => theme.palette.customColors.textColor};
        @media(max-width: 599px) {
          font-size: 14px;
        }
      }
    }
  }

  /* ── The Executive Section ── */
  .executive_header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    padding-bottom: 16px;

    h2 {
      font-family: ${playFair.style.fontFamily};
      font-size: 32px;
      font-weight: 600;
      color: ${({ theme }) => theme.palette.primary.main};
      margin: 0;

      @media(max-width: 599px) {
        font-size: 24px;
      }
    }

    .explore_link {
      font-family: ${outFit.style.fontFamily};
      font-size: 13px;
      font-weight: 600;
      color: ${({ theme }) => theme.palette.primary.main};
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: color 0.3s ease;

      &:hover {
        color: ${({ theme }) => theme.palette.secondary.light};
      }
    }
  }

  .executive_grid {
    margin-bottom: 80px;
    
    @media(max-width: 899px) {
      margin-bottom: 60px;
    }
  }

  /* Large Left Card */
  .large_gift_card {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 520px;
    border-radius: 24px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
    
    @media(max-width: 1199px) {
      min-height: 460px;
    }
    @media(max-width: 899px) {
      min-height: 400px;
    }

    .card_bg_img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
      }
    }

    .card_overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      background: linear-gradient(180deg, rgba(11, 32, 19, 0.0) 40%, rgba(11, 32, 19, 0.85) 100%);
    }

    .card_content {
      position: relative;
      z-index: 3;
      padding: 40px;
      width: 100%;
      color: ${({ theme }) => theme.palette.common.white};

      @media(max-width: 599px) {
        padding: 24px;
      }

      .card_badge {
        display: inline-block;
        font-family: ${outFit.style.fontFamily};
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.palette.warning.light};
        margin-bottom: 12px;
      }

      h3 {
        font-family: ${playFair.style.fontFamily};
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 12px;
        color: ${({ theme }) => theme.palette.common.white};

        @media(max-width: 599px) {
          font-size: 22px;
        }
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 15px;
        line-height: 1.6;
        opacity: 0.9;
        margin-bottom: 24px;
        max-width: 480px;

        @media(max-width: 599px) {
          font-size: 13px;
        }
      }
    }

    &:hover {
      .card_bg_img img {
        transform: scale(1.04);
      }
    }
  }

  /* Right Side Horizontal Stacked Cards */
  .right_cards_col {
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 100%;
    justify-content: space-between;
  }

  .small_gift_card {
    position: relative;
    width: 100%;
    border-radius: 24px;
    overflow: hidden;
    display: flex;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    min-height: 248px;
    background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    @media(max-width: 599px) {
      flex-direction: column-reverse;
      min-height: auto;
    }

    &.dark_bg {
      background-color: ${({ theme }) => theme.palette.primary.light};
      color: ${({ theme }) => theme.palette.common.white};
      
      .small_card_content {
        h3 {
          color: ${({ theme }) => theme.palette.common.white};
        }
        p {
          color: ${({ theme }) => theme.palette.common.white};
          opacity: 0.85;
        }
        .small_card_link {
          color: ${({ theme }) => theme.palette.warning.light};
        }
      }
    }

    .small_card_content {
      flex: 1;
      padding: 32px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      @media(max-width: 1199px) {
        padding: 24px;
      }

      h3 {
        font-family: ${playFair.style.fontFamily};
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 8px;
        color: ${({ theme }) => theme.palette.primary.main};
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 14px;
        line-height: 1.5;
        color: ${({ theme }) => theme.palette.customColors.textColor};
        margin-bottom: 16px;
      }

      .small_card_link {
        font-family: ${outFit.style.fontFamily};
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: ${({ theme }) => theme.palette.primary.main};
        text-decoration: underline;
        cursor: pointer;
        transition: opacity 0.3s ease;

        &:hover {
          opacity: 0.8;
        }
      }
    }

    .small_card_img {
      width: 40%;
      position: relative;
      
      @media(max-width: 599px) {
        width: 100%;
        height: 200px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
      }
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.06);

      .small_card_img img {
        transform: scale(1.04);
      }
    }
  }

  /* ── Custom Chest Banner Section ── */
  .custom_chest_banner {
    position: relative;
    width: 100%;
    border-radius: 32px;
    overflow: hidden;
    background-color: ${({ theme }) => theme.palette.primary.dark};
    padding: 80px;
    display: flex;
    align-items: center;
    min-height: 440px;
    margin-bottom: 96px;
    box-shadow: 0 12px 40px rgba(11, 32, 19, 0.15);

    @media(max-width: 900px) {
      padding: 60px 40px;
      min-height: auto;
      flex-direction: column-reverse;
      align-items: stretch;
      gap: 40px;
    }

    @media(max-width: 599px) {
      border-radius: 20px;
      padding: 40px 24px;
      margin-bottom: 64px;
    }

    .banner_img_overlay {
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 100%;
      z-index: 1;

      @media(max-width: 900px) {
        position: relative;
        width: 100%;
        height: 280px;
        border-radius: 16px;
        overflow: hidden;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, rgba(11, 32, 19, 1) 0%, rgba(11, 32, 19, 0.3) 100%);
        
        @media(max-width: 900px) {
          background: linear-gradient(180deg, rgba(11, 32, 19, 0) 50%, rgba(11, 32, 19, 0.6) 100%);
        }
      }
    }

    .banner_content {
      position: relative;
      z-index: 2;
      max-width: 480px;
      color: ${({ theme }) => theme.palette.common.white};

      @media(max-width: 900px) {
        max-width: 100%;
      }

      .banner_subtitle {
        font-family: ${outFit.style.fontFamily};
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.palette.warning.light};
        margin-bottom: 16px;
      }

      h2 {
        font-family: ${playFair.style.fontFamily};
        font-size: 40px;
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 20px;

        span {
          font-style: italic;
          font-weight: 400;
        }

        @media(max-width: 599px) {
          font-size: 30px;
        }
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 15px;
        line-height: 1.7;
        opacity: 0.9;
        margin-bottom: 32px;

        @media(max-width: 599px) {
          font-size: 14px;
          margin-bottom: 24px;
        }
      }
    }
  }

  /* ── Columns Gifting (The Heritage & The Seasonal) ── */
  .collections_grid {
    margin-bottom: 80px;

    @media(max-width: 899px) {
      margin-bottom: 60px;
    }

    .column_header {
      font-family: ${playFair.style.fontFamily};
      font-size: 28px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.main};
      margin-bottom: 32px;
      border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
      padding-bottom: 12px;

      @media(max-width: 599px) {
        font-size: 22px;
        margin-bottom: 20px;
      }
    }

    .column_cards {
      display: flex;
      flex-direction: column;
      gap: 48px;

      @media(max-width: 599px) {
        gap: 32px;
      }
    }

    .product_card {
      text-decoration: none;
      display: block;

      .product_img_box {
        position: relative;
        width: 100%;
        aspect-ratio: 1.1 / 1;
        border-radius: 20px;
        overflow: hidden;
        margin-bottom: 20px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
        background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};

        @media(max-width: 599px) {
          border-radius: 12px;
          margin-bottom: 12px;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
      }

      .product_title {
        font-family: ${playFair.style.fontFamily};
        font-size: 22px;
        font-weight: 600;
        color: ${({ theme }) => theme.palette.primary.main};
        margin-bottom: 6px;
        
        @media(max-width: 599px) {
          font-size: 18px;
        }
      }

      .product_desc {
        font-family: ${outFit.style.fontFamily};
        font-size: 14px;
        line-height: 1.5;
        color: ${({ theme }) => theme.palette.customColors.textColor};
        margin-bottom: 10px;
      }

      .product_price {
        font-family: ${outFit.style.fontFamily};
        font-size: 15px;
        font-weight: 700;
        color: ${({ theme }) => theme.palette.secondary.light};
      }

      &:hover {
        .product_img_box img {
          transform: scale(1.03);
        }
      }
    }
  }

  /* ── Gift Concierge Section ── */
  .concierge_section {
    width: 100%;
    
    .concierge_card {
      width: 100%;
      background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};
      border-radius: 24px;
      padding: 64px;
      text-align: center;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.02);

      @media(max-width: 899px) {
        padding: 40px 24px;
      }

      h2 {
        font-family: ${playFair.style.fontFamily};
        font-size: 36px;
        font-weight: 700;
        color: ${({ theme }) => theme.palette.primary.main};
        margin-bottom: 16px;

        @media(max-width: 599px) {
          font-size: 26px;
        }
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 15px;
        line-height: 1.6;
        color: ${({ theme }) => theme.palette.customColors.textColor};
        max-width: 560px;
        margin: 0 auto 32px auto;

        @media(max-width: 599px) {
          font-size: 14px;
          margin-bottom: 24px;
        }
      }

      .inquiry_form {
        display: flex;
        max-width: 480px;
        margin: 0 auto;
        gap: 12px;

        @media(max-width: 599px) {
          flex-direction: column;
          gap: 12px;
        }

        input {
          flex: 1;
          background-color: ${({ theme }) => theme.palette.common.white};
          border: 1px solid ${({ theme }) => theme.palette.divider};
          padding: 14px 20px;
          border-radius: 12px;
          font-family: ${outFit.style.fontFamily};
          font-size: 15px;
          outline: none;
          color: ${({ theme }) => theme.palette.text.primary};
          transition: border-color 0.3s ease;

          &:focus {
            border-color: ${({ theme }) => theme.palette.primary.main};
          }

          &::placeholder {
            color: ${({ theme }) => theme.palette.customColors.placeText};
          }
        }

        button {
          background-color: ${({ theme }) => theme.palette.primary.main};
          color: ${({ theme }) => theme.palette.common.white};
          font-family: ${outFit.style.fontFamily};
          font-weight: 600;
          font-size: 14px;
          padding: 14px 32px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;

          &:hover {
            background-color: ${({ theme }) => theme.palette.secondary.dark};
          }
        }
      }
    }
  }
`;
