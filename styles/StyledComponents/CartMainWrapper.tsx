import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const CartMainWrapper = styled("section")`
  position: relative;
  padding: 60px 0 100px 0;
  background: ${({ theme }) => theme.palette.customColors?.lightCream || "#FCF9F2"};

  @media (max-width: 1199px) {
    padding: 40px 0 80px 0;
  }
  @media (max-width: 599px) {
    padding: 30px 0 60px 0;
  }

  /* Titles */
  .cart_title {
    font-family: ${playFair.style.fontFamily};
    font-weight: 700;
    line-height: 1.15;
    color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
    margin: 0 0 8px 0;
  }

  .cart_subtitle {
    font-family: ${outFit.style.fontFamily};
    font-size: 16px;
    font-weight: 400;
    line-height: 1.6;
    color: ${({ theme }) => theme.palette.text.secondary || "#5F5E59"};
    margin: 0 0 40px 0;

    @media (max-width: 599px) {
      font-size: 14px;
      margin-bottom: 16px;
    }
  }

  /* Layout Columns */
  .cart_layout {
    display: flex;
    gap: 30px;
    align-items: flex-start;

    @media (max-width: 1199px) {
      gap: 16px;
    }
    @media (max-width: 899px) {
      flex-direction: column;
    }

  }

  .items_column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }

  .summary_column {
    width: 380px;
    flex-shrink: 0;
    
    @media (max-width: 1199px) {
      width: 320px;
    }
    @media (max-width: 899px) {
      width: 100%;
    }
  }

  /* Cart Item Card */
  .cart_item_card {
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.palette.common.white || "#FFF"};
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.03);
    gap: 16px;

    @media (max-width: 1199px) {
      padding: 12px;
      gap: 10px;
      border-radius: 12px;
    }

    @media (max-width: 599px) {
      gap: 8px;
      flex-wrap: wrap;
      align-items: flex-start;
    }
  }

  .item_image {
    width: 100px;
    height: 100px;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
    @media (max-width: 599px) {
      width: 100%;
      height: auto;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .item_details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
  }

  .item_badge {
    font-family: ${outFit.style.fontFamily};
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.secondary.light || "#B88900"};
    margin-bottom: 2px;
  }

  .item_name {
    font-family: ${playFair.style.fontFamily};
    font-weight: 700;
    font-size: 20px;
    line-height: 1.3;
    color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
    margin: 0;
    @media (max-width: 1199px) {
      font-size: 18px;
    }
    @media (max-width: 599px) {
      font-size: 16px;
    }
  }
  .item_price_box{
    @media(max-width: 599px){
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .item_price {
    font-size: 22px;
    font-weight: 700;
    color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
    text-align: right;
    margin-left: auto;

    @media (max-width: 599px) {
      font-size: 18px;
      margin: 0;
    }
  }

  .item_actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    width: 100%;
  }

  /* Quantity Selector in Cart */
  .cart_quantity {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${({ theme }) => theme.palette.common.white || "#FFF"};
    border: 1px solid ${({ theme }) => theme.palette.grey[300] || "#E0E0E0"};
    border-radius: 30px;
    padding: 2px;
    width: 90px;
    height: 32px;

    button {
      border: none;
      background: none;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      transition: background 0.2s ease;

      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.palette.grey[100] || "#F5F5F5"};
      }

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      svg {
        width: 10px;
        height: 10px;
      }
    }

    .qty_text {
      font-family: ${outFit.style.fontFamily};
      font-size: 13px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
    }
  }

  /* Remove Button */
  .remove_btn {
    background: none;
    border: none;
    cursor: pointer;
    font-family: ${outFit.style.fontFamily};
    font-size: 11px;
    font-weight: 600;
    color: ${({ theme }) => theme.palette.text.secondary || "#5F5E59"};
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;

    svg {
      width: 12px;
      height: 12px;
    }

    &:hover {
      color: ${({ theme }) => theme.palette.error.main || "#EA5455"};
      background: rgba(234, 84, 85, 0.05);
    }
  }

  /* Summary Card */
  .summary_card {
    background: ${({ theme }) => theme.palette.customColors?.greyLightBg || "#F6F3EC"};
    border-radius: 24px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.01);

    @media (max-width: 1199px) {
      padding: 20px;
      border-radius: 16px;
    }

    @media (max-width: 599px) {
      padding: 12px;
      border-radius: 12px;
    }

    .summary_title {
      font-family: ${playFair.style.fontFamily};
      font-size: 26px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      margin: 0 0 24px 0;

      @media (max-width: 1199px) {
        font-size: 22px;
        margin-bottom: 16px;
      }
    }

    .summary_row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      font-family: ${outFit.style.fontFamily};

      @media (max-width: 1199px) {
        margin-bottom: 8px;
      }

      .row_label {
        font-size: 14px;
        color: ${({ theme }) => theme.palette.text.secondary || "#5F5E59"};
      }

      .row_value {
        font-size: 15px;
        font-weight: 700;
        color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      }
    }

    .summary_divider {
      height: 1px;
      background: rgba(0, 0, 0, 0.08);
      margin: 8px 0 20px 0;

      @media (max-width: 1199px) {
        margin: 8px 0 12px 0;
      }
    }

    .total_row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      @media (max-width: 1199px) {
        margin-bottom: 16px;
      }

      .total_label {
        font-family: ${playFair.style.fontFamily};
        font-size: 24px;
        font-weight: 700;
        color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};

        @media (max-width: 1199px) {
          font-size: 20px;
        }
        @media (max-width: 599px) {
          font-size: 18px;
        }
      }

      .total_value {
        font-size: 32px;
        font-weight: 700;
        color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};

        @media (max-width: 1199px) {
          font-size: 28px;
        }
        @media (max-width: 599px) {
          font-size: 24px;
        }
      }
    }

    }

    .continue_browsing_btn {
      width: 100%;
      height: 50px;
      background: none;
      border: 1.5px solid rgba(0, 0, 0, 0.1);
      color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      border-radius: 12px;
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;

      @media (max-width: 1199px) {
        height: 48px;
        font-size: 14px;
        margin-bottom: 12px;
      }

      &:hover {
        border-color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
        background: rgba(0, 0, 0, 0.02);
      }
    }

    .secure_badge {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border-radius: 12px;
      background: ${({ theme }) => theme.palette.common.white || "#FFF"};
      border: 1px solid rgba(0, 0, 0, 0.03);

      svg {
        width: 18px;
        height: 18px;
        color: ${({ theme }) => theme.palette.secondary.light || "#B88900"};
        flex-shrink: 0;
      }

      .secure_info {
        display: flex;
        flex-direction: column;
        gap: 1px;

        .secure_title {
          font-family: ${outFit.style.fontFamily};
          font-size: 12px;
          font-weight: 700;
          color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
          line-height: 1.2;
        }

        .secure_sub {
          font-family: ${outFit.style.fontFamily};
          font-size: 10px;
          color: ${({ theme }) => theme.palette.text.secondary || "#5F5E59"};
          line-height: 1.2;
        }
      }
    }
  }

  /* Upsell Section */
  .upsell_section {
    margin-top: 60px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
    padding-top: 50px;

    @media (max-width: 1199px) {
      margin-top: 40px;
      padding-top: 30px;
    }

    @media (max-width: 599px) {
      margin-top: 24px;
      padding-top: 24px;
    }

    .upsell_title {
      font-family: ${playFair.style.fontFamily};
      font-size: 32px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      margin: 0 0 30px 0;

      @media (max-width: 1199px) {
        font-size: 26px;
        margin-bottom: 24px;
      }

      @media (max-width: 599px) {
        font-size: 20px;
        margin-bottom: 12px;
      }
    }

    .upsell_grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;

      @media (max-width: 1199px) {
        gap: 16px;
      }

      @media (max-width: 899px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 599px) {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }
  }

  /* Upsell Card */
  .upsell_card {
    background: ${({ theme }) => theme.palette.common.white || "#FFF"};
    border-radius: 20px;
    padding: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .upsell_img {
    width: 100%;
    aspect-ratio: 1.2 / 1;
    border-radius: 12px;
    overflow: hidden;
    background: ${({ theme }) => theme.palette.grey[100] || "#F5F5F5"};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .upsell_details {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .upsell_name {
      font-family: ${playFair.style.fontFamily};
      font-size: 16px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.dark || "#0B2013"};
      margin: 0;
    }

    .upsell_price {
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.palette.text.secondary || "#5F5E59"};
    }
  }

  }
`;
