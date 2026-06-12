import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const BestSellerGridWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 60px 0 80px;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};

  @media(max-width: 1199px) {
    padding: 40px 0 60px;
  }

  .collection_header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
    @media(max-width: 599px) {
      margin-bottom: 24px;
    }

    h2 {
      font-family: ${playFair.style.fontFamily};
      font-size: 36px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.main};
      margin: 0;
      @media(max-width: 599px) {
        font-size: 26px;
      }
    }

    .shop_link {
      font-family: ${outFit.style.fontFamily};
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.primary.main};
      text-decoration: underline;
      text-underline-offset: 4px;
      transition: opacity 0.2s ease;
      display: inline-block;
      margin-bottom: 6px;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .collection_card {
    cursor: pointer;
    text-decoration: none;
    display: block;
    
    .card_imgBox {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
      margin-bottom: 20px;
      background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};

      @media(max-width: 599px) {
        margin-bottom: 12px;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
      }

      .limited_badge {
        position: absolute;
        top: 16px;
        left: 16px;
        z-index: 3;
        background-color: ${({ theme }) => theme.palette.warning.light};
        color: ${({ theme }) => theme.palette.primary.dark};
        font-family: ${outFit.style.fontFamily};
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        padding: 6px 12px;
        border-radius: 4px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      }
    }

    .card_details {
      .title_row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 12px;
        margin-bottom: 6px;

        h3 {
          font-family: ${playFair.style.fontFamily};
          font-size: 22px;
          font-weight: 600;
          color: ${({ theme }) => theme.palette.primary.main};
          margin: 0;
          @media(max-width: 599px) {
            font-size: 18px;
          }
        }

        .price {
          font-family: ${playFair.style.fontFamily};
          font-size: 20px;
          font-weight: 600;
          color: ${({ theme }) => theme.palette.primary.main};
          flex-shrink: 0;
          @media(max-width: 599px) {
            font-size: 17px;
          }
        }
      }

      .sub_label {
        font-family: ${outFit.style.fontFamily};
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.palette.customColors.textColor};
        opacity: 0.8;
      }
    }

    &:hover {
      .card_imgBox img {
        transform: scale(1.04);
      }
    }
  }
`;
