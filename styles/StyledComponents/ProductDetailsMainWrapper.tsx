import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const ProductDetailsMainWrapper = styled("section")`
  position: relative;
  padding: 60px 0 80px 0;
  background: ${({ theme }) => theme.palette.customColors?.lightCream};

  @media (max-width: 1199px) {
    padding: 48px 0 64px 0;
  }
  @media (max-width: 899px) {
    padding: 32px 0 48px 0;
  }
  @media (max-width: 599px) {
    padding: 24px 0 40px 0;
  }

  /* Breadcrumb */
  .breadcrumb_box {
    margin-bottom: 24px;
    font-family: ${outFit.style.fontFamily};
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.text.secondary};
    display: flex;
    align-items: center;
    gap: 6px;

    @media (max-width: 599px) {
      margin-bottom: 16px;
      font-size: 13px;
    }

    a {
      color: ${({ theme }) => theme.palette.text.secondary};
      text-decoration: none;
      transition: color 0.2s ease;
      &:hover {
        color: ${({ theme }) => theme.palette.primary.main};
      }
    }
    span {
      opacity: 0.5;
    }
  }

  /* ─── Gallery ─── */
  .gallery_col {
    display: flex;
    flex-direction: column;
    gap: 14px;

    @media (max-width: 899px) {
      gap: 10px;
    }
  }

  .gallery_main_img {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 28px;
    overflow: hidden;
    background: ${({ theme }) => theme.palette.common.white};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }
    &:hover img {
      transform: scale(1.04);
    }

    @media (max-width: 599px) {
      border-radius: 18px;
    }
  }

  /* Main slider wrapper – Splide */
  .gallery_main_slider {
    border-radius: 28px;
    overflow: hidden;
    margin-bottom: 14px;
    background: ${({ theme }) => theme.palette.common.white};
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);

    @media (max-width: 599px) {
      border-radius: 18px;
      margin-bottom: 10px;
    }

    /* Clip Splide track to rounded corners */
    .splide__track {
      border-radius: inherit;
    }
  }

  .gallery_main_img {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  /* Thumbnail grid */

  .gallery_thumbs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    @media (max-width: 899px) {
      gap: 10px;
    }
  }

  .gallery_thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 14px;
    overflow: hidden;
    background: ${({ theme }) => theme.palette.common.white};
    cursor: pointer;
    border: 2px solid transparent;
    opacity: 0.6;
    transition: border-color 0.25s ease, opacity 0.25s ease;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    &:hover {
      opacity: 0.85;
      img {
        transform: scale(1.05);
      }
    }

    &.active {
      border-color: ${({ theme }) => theme.palette.primary.main};
      opacity: 1;
    }

    @media (max-width: 599px) {
      border-radius: 10px;
    }
  }

  /* ─── Info Column ─── */
  .info_col {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
  }

  .badge_row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .product_badge {
    padding: 5px 14px;
    border-radius: 20px;
    font-family: ${outFit.style.fontFamily};
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;

    &.badge_grade {
      background: ${({ theme }) => theme.palette.customColors?.lightGreen};
      color: ${({ theme }) => theme.palette.primary.dark};
    }
    &.badge_reserve {
      background: ${({ theme }) => theme.palette.customColors?.lightYellow};
      color: ${({ theme }) => theme.palette.secondary.dark};
    }
  }

  .product_name {
    font-family: ${playFair.style.fontFamily};
    font-weight: 700;
    line-height: 1.15;
    color: ${({ theme }) => theme.palette.primary.dark};
    margin: 0 0 12px 0;
  }

  .product_desc {
    font-family: ${outFit.style.fontFamily};
    font-size: 15px;
    font-weight: 400;
    line-height: 1.65;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin: 0 0 24px 0;

    @media (max-width: 599px) {
      font-size: 14px;
      margin-bottom: 18px;
    }
  }

  /* Price block */
  .price_row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
    flex-wrap: wrap;

    .price_main {
      font-family: ${outFit.style.fontFamily};
      font-size: 34px;
      font-weight: 800;
      color: ${({ theme }) => theme.palette.primary.dark};
      line-height: 1;

      @media (max-width: 599px) {
        font-size: 28px;
      }
    }

    .price_original {
      font-family: ${outFit.style.fontFamily};
      font-size: 16px;
      font-weight: 500;
      color: ${({ theme }) => theme.palette.grey[400]};
      text-decoration: line-through;
    }

    .price_savings {
      font-family: ${outFit.style.fontFamily};
      font-size: 13px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.success.dark};
      background: ${({ theme }) => theme.palette.customColors?.lightGreen};
      padding: 3px 10px;
      border-radius: 20px;
    }
  }

  /* Package selector */
  .package_selector {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .package_option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-radius: 14px;
    border: 1.5px solid ${({ theme }) => theme.palette.grey[200]};
    background: ${({ theme }) => theme.palette.common.white};
    cursor: pointer;
    transition: all 0.2s ease;

    &.active {
      border-color: ${({ theme }) => theme.palette.primary.main};
      background: ${({ theme }) => theme.palette.customColors?.lightCream};
    }

    &:hover:not(.active) {
      border-color: ${({ theme }) => theme.palette.grey[400]};
    }

    .option_info {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .option_label {
        font-family: ${outFit.style.fontFamily};
        font-size: 14px;
        font-weight: 600;
        color: ${({ theme }) => theme.palette.primary.dark};
      }
      .option_sub {
        font-family: ${outFit.style.fontFamily};
        font-size: 12px;
        font-weight: 400;
        color: ${({ theme }) => theme.palette.text.secondary};
      }
    }

    .option_price {
      font-family: ${outFit.style.fontFamily};
      font-size: 15px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.dark};
    }

    .option_check {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid ${({ theme }) => theme.palette.grey[300]};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.2s ease;

      &.checked {
        background: ${({ theme }) => theme.palette.primary.main};
        border-color: ${({ theme }) => theme.palette.primary.main};
        svg {
          display: block;
        }
      }

      svg {
        display: none;
        width: 12px;
        height: 12px;
        color: ${({ theme }) => theme.palette.common.white};
      }
    }
    }
  

  /* Action Row & Quantity/Cart Selector */
  .action_row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
    width: 100%;

    @media (max-width: 599px) {
      gap: 10px;
    }
  }

  .quantity_selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${({ theme }) => theme.palette.common.white};
    border: 1.5px solid ${({ theme }) => theme.palette.grey[200]};
    border-radius: 14px;
    padding: 6px;
    width: 130px;
    height: 54px;
    flex-shrink: 0;

    @media (max-width: 599px) {
      width: 110px;
      height: 48px;
      padding: 4px;
    }

    button {
      border: none;
      background: none;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: ${({ theme }) => theme.palette.primary.dark};
      transition: background 0.2s ease;

      @media (max-width: 599px) {
        width: 32px;
        height: 32px;
      }

      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.palette.grey[100]};
      }

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }

    .qty_value {
      font-family: ${outFit.style.fontFamily};
      font-size: 16px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.dark};
      min-width: 24px;
      text-align: center;
      user-select: none;
      
      @media (max-width: 599px) {
        font-size: 15px;
      }
    }
  }

  

  /* WhatsApp CTA */
  

  .response_note {
    text-align: center;
    font-family: ${outFit.style.fontFamily};
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin-bottom: 24px;
    margin-top: 10px;
  }

  /* Trust badges */
  .trust_badges {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;

    @media (max-width: 599px) {
      gap: 14px;
    }
  }

  .trust_item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: ${outFit.style.fontFamily};

    .trust_icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: ${({ theme }) => theme.palette.customColors?.lightGreen};
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg {
        width: 18px;
        height: 18px;
        color: ${({ theme }) => theme.palette.primary.main};
      }
    }

    .trust_text {
      display: flex;
      flex-direction: column;

      .trust_label {
        font-size: 13px;
        font-weight: 700;
        color: ${({ theme }) => theme.palette.primary.dark};
        line-height: 1.2;
      }
      .trust_sub {
        font-size: 11px;
        font-weight: 400;
        color: ${({ theme }) => theme.palette.text.secondary};
        line-height: 1.2;
      }
    }
  }
`;
