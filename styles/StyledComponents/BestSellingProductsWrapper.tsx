import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const BestSellingProductsWrapper = styled("section")`
  position: relative;
  padding: 56px 0;
  background: ${({ theme }) => theme.palette.common?.white};
  @media (max-width: 1199px) {
    padding: 44px 0;
  }
  @media (max-width: 599px) {
    padding: 28px 0;
  }
  .best_selling_header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 28px;

    @media (max-width: 599px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 16px;
    }
  }

  .cmnSmallTitle {
    font-family: ${outFit.style.fontFamily};
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 2.2px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.secondary?.dark};
    margin-bottom: 6px;

    @media (max-width: 599px) {
      font-size: 11px;
      letter-spacing: 1.2px;
      margin-bottom: 4px;
    }
  }

  .view_all_link {
    font-family: ${outFit.style.fontFamily};
    font-weight: 600;
    font-size: 13px;
    color: ${({ theme }) => theme.palette.text.primary};
    text-decoration: underline;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.palette.warning.light};
      text-decoration: none;
    }
  }

  .desktop_grid {
    display: block;
    @media (max-width: 599px) {
      display: none;
    }
  }

  .mobile_slider {
    display: none;
    @media (max-width: 599px) {
      display: block;
    }

    .splide__pagination {
      position: relative;
      bottom: auto;
      margin-top: 16px;
      gap: 6px;

      .splide__pagination__page {
        background: ${({ theme }) => theme.palette.grey[300]};
        width: 6px;
        height: 6px;
        opacity: 1;
        transition: all 0.3s ease;

        &.is-active {
          background: ${({ theme }) => theme.palette.primary.main};
          width: 20px;
          border-radius: 3px;
        }
      }
    }
  }

  .product_card {
    background: ${({ theme }) => theme.palette.customColors.headerBg};
    border-radius: 18px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;

    @media (max-width: 599px) {
      border-radius: 14px;
      padding: 10px;
    }

    &:hover {
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
    }
  }

  .product_imgBox {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 12px;
    background: ${({ theme }) => theme.palette.common.white};
    @media (max-width: 599px) {
      margin-bottom: 8px;
      border-radius: 10px;
    }
    a {
      width: 100%;
      height: 100%;
      line-height: 0;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  .product_badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
    padding: 3px 10px;
    border-radius: 16px;
    font-family: ${outFit.style.fontFamily};
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: uppercase;

    &.badge_organic {
      background: ${({ theme }) => theme.palette.success.light};
      color: ${({ theme }) => theme.palette.common.white};
    }

    &.badge_bestseller {
      background: ${({ theme }) => theme.palette.secondary.light};
      color: ${({ theme }) => theme.palette.common.white};
    }

    &.badge_discount {
      background: ${({ theme }) => theme.palette.info.main};
      color: ${({ theme }) => theme.palette.common.black};
    }

    &.badge_toprated {
      background: ${({ theme }) => theme.palette.error.main};
      color: ${({ theme }) => theme.palette.common.white};
    }
  }

  .product_title {
    font-family: ${playFair.style.fontFamily};
    font-weight: 600;
    font-size: 17px;
    color: ${({ theme }) => theme.palette.primary.light};
    margin-bottom: 6px;
    line-height: 1.25;
    min-height: 44px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: 599px) {
      font-size: 14px;
      min-height: 36px;
      margin-bottom: 4px;
    }
  }

  .product_price {
    font-family: ${outFit.style.fontFamily};
    font-weight: 700;
    font-size: 17px;
    color: ${({ theme }) => theme.palette.warning.dark};
    margin-bottom: 12px;

    @media (max-width: 599px) {
      font-size: 15px;
      margin-bottom: 8px;
    }
  }

  .product_sizes {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    @media(max-width: 599px){
      margin-bottom: 12px;
    }
  }

  .size_btn {
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.palette.grey[300]};
    background: ${({ theme }) => theme.palette.common.white};
    font-family: ${outFit.style.fontFamily};
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.text.secondary};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: ${({ theme }) => theme.palette.primary.main};
    }

    &.selected {
      background: ${({ theme }) => theme.palette.customColors.lightGreen};
      border-color: ${({ theme }) => theme.palette.primary.main};
      color: ${({ theme }) => theme.palette.primary.dark};
    }
  }

  .card_buttons {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .add_cart_btn {
    background: ${({ theme }) => theme.palette.primary.dark};
    color: ${({ theme }) => theme.palette.common.white};
    border-radius: 10px;
    padding: 12px;
    text-transform: none;
    font-weight: 600;
    font-family: ${outFit.style.fontFamily};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.palette.secondary.dark};
    }

    &:disabled {
      background: ${({ theme }) => theme.palette.action.disabledBackground};
      color: ${({ theme }) => theme.palette.text.disabled};
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .whatsapp_btn {
    background: ${({ theme }) => theme.palette.customColors.footerBg};
    color: ${({ theme }) => theme.palette.primary.dark};
    border-radius: 10px;
    padding: 12px;
    text-transform: none;
    font-weight: 600;
    font-family: ${outFit.style.fontFamily};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    cursor: pointer;
    transition: background 0.3s ease;

    svg {
      width: 18px;
      height: 18px;
    }

    &:disabled {
      background: ${({ theme }) => theme.palette.grey[400]};
      opacity: 0.5;
    }

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.palette.grey[300]};
    }
  }
`;
