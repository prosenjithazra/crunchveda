import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const SavePageWrapper = styled("div")`
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

  .header_section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 48px;
    
    @media(max-width: 899px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
    }
    
    @media(max-width: 599px) {
      margin-bottom: 32px;
      gap: 16px;
    }

    .header_text {
      max-width: 600px;
      
      h1 {
        font-family: ${playFair.style.fontFamily};
        font-size: 48px;
        font-weight: 700;
        line-height: 1.2;
        color: ${({ theme }) => theme.palette.primary.main};
        margin-bottom: 16px;
        
        @media(max-width: 899px) {
          font-size: 38px;
        }
        @media(max-width: 599px) {
          font-size: 30px;
          margin-bottom: 8px;
        }
      }

      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 15px;
        line-height: 1.6;
        color: ${({ theme }) => theme.palette.customColors.textColor};
        @media(max-width: 599px) {
          font-size: 13px;
        }
      }
    }

    .header_actions {
      display: flex;
      align-items: center;
      gap: 24px;
      
      @media(max-width: 599px) {
        width: 100%;
        justify-content: space-between;
        gap: 16px;
      }

      .clear_btn {
        font-family: ${outFit.style.fontFamily};
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.palette.primary.main};
        text-decoration: underline;
        cursor: pointer;
        background: transparent;
        border: none;
        padding: 8px 0;
        transition: color 0.3s ease;
        
        &:hover {
          color: ${({ theme }) => theme.palette.secondary.light};
        }
      }
    }
  }

  /* ── Items Grid ── */
  .saved_grid {
    margin-bottom: 80px;
    @media(max-width: 599px) {
      margin-bottom: 48px;
    }
  }

  .saved_card {
    position: relative;
    width: 100%;
    
    .image_container {
      position: relative;
      width: 100%;
      aspect-ratio: 1.1 / 1;
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
      background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};
      
      @media(max-width: 1199px) {
        border-radius: 16px;
      }
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

      .remove_btn {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 10;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.palette.common.white};
        color: ${({ theme }) => theme.palette.primary.main};
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        
        &:hover {
          background-color: ${({ theme }) => theme.palette.error.main};
          color: ${({ theme }) => theme.palette.common.white};
          transform: scale(1.05);
        }

        @media(max-width: 599px) {
          width: 32px;
          height: 32px;
          top: 12px;
          right: 12px;
          
          svg {
            width: 12px;
            height: 12px;
          }
        }
      }
    }

    &:hover {
      .image_container img {
        transform: scale(1.04);
      }
    }

    .card_category {
      font-family: ${outFit.style.fontFamily};
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.text.secondary};
      margin-bottom: 6px;
      @media(max-width: 599px) {
        font-size: 10px;
        margin-bottom: 4px;
      }
    }

    .card_title {
      font-family: ${playFair.style.fontFamily};
      font-size: 24px;
      font-weight: 600;
      color: ${({ theme }) => theme.palette.primary.main};
      margin-bottom: 8px;
      @media(max-width: 1199px) {
        font-size: 20px;
      }
      @media(max-width: 599px) {
        font-size: 18px;
        margin-bottom: 4px;
      }
    }

    .card_desc {
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      line-height: 1.5;
      color: ${({ theme }) => theme.palette.customColors.textColor};
      margin-bottom: 12px;
      @media(max-width: 599px) {
        font-size: 13px;
        margin-bottom: 8px;
      }
    }

    .card_price {
      font-family: ${playFair.style.fontFamily};
      font-size: 20px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.main};
      margin-bottom: 16px;
      @media(max-width: 599px) {
        font-size: 18px;
        margin-bottom: 12px;
      }
    }
  }

  .empty_state {
    text-align: center;
    padding: 64px 0;
    
    h3 {
      font-family: ${playFair.style.fontFamily};
      font-size: 28px;
      color: ${({ theme }) => theme.palette.primary.main};
      margin-bottom: 16px;
    }
    
    p {
      font-family: ${outFit.style.fontFamily};
      font-size: 15px;
      color: ${({ theme }) => theme.palette.text.secondary};
      margin-bottom: 24px;
    }
    
    .explore_btn {
      background-color: ${({ theme }) => theme.palette.primary.main};
      color: ${({ theme }) => theme.palette.common.white};
      font-family: ${outFit.style.fontFamily};
      font-weight: 600;
      text-transform: none;
      padding: 12px 32px;
      border-radius: 30px;
      font-size: 14px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      
      &:hover {
        background-color: ${({ theme }) => theme.palette.secondary.dark};
      }
    }
  }

  /* ── Recommendations Section ── */
  .recommendations_wrapper {
    background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};
    padding: 64px 0;
    border-radius: 24px;
    
    @media(max-width: 1199px) {
      padding: 48px 0;
      border-radius: 16px;
    }
    @media(max-width: 599px) {
      padding: 32px 0;
      border-radius: 12px;
    }

    .recommendations_header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 36px;
      padding: 0 24px;
      
      @media(max-width: 599px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 24px;
        padding: 0 16px;
      }

      h2 {
        font-family: ${playFair.style.fontFamily};
        font-size: 32px;
        font-weight: 700;
        color: ${({ theme }) => theme.palette.primary.main};
        @media(max-width: 899px) {
          font-size: 26px;
        }
        @media(max-width: 599px) {
          font-size: 22px;
        }
      }

      .explore_link {
        font-family: ${outFit.style.fontFamily};
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.palette.primary.main};
        text-decoration: underline;
        transition: color 0.3s ease;
        
        &:hover {
          color: ${({ theme }) => theme.palette.secondary.light};
        }
      }
    }

    .recommendation_card {
      text-align: center;
      padding: 0 12px;
      text-decoration: none;
      display: block;
      
      @media(max-width: 599px) {
        padding: 0 8px;
        margin-bottom: 24px;
        &:last-child {
          margin-bottom: 0;
        }
      }

      .rec_img_box {
        position: relative;
        width: 100%;
        aspect-ratio: 1.1 / 1;
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        background-color: ${({ theme }) => theme.palette.customColors.lightPaperBg};
        
        @media(max-width: 599px) {
          border-radius: 10px;
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
        .rec_img_box img {
          transform: scale(1.04);
        }
      }

      .rec_title {
        font-family: ${outFit.style.fontFamily};
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.palette.primary.main};
        margin-bottom: 4px;
      }

      .rec_price {
        font-family: ${outFit.style.fontFamily};
        font-size: 13px;
        color: ${({ theme }) => theme.palette.text.secondary};
      }
    }
  }
`;
