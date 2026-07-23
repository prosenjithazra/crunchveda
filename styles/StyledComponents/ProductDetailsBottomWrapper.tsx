import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const ProductDetailsBottomWrapper = styled("div")`
  /* ─── Heritage Banner ─── */
  .heritage_banner {
    position: relative;
    padding: 48px 0;
    @media (max-width: 1199px) {
      padding: 36px 0;
    }
    @media (max-width: 599px) {
      padding: 24px 0;
    }
    .wrapperOuter_heritage {
      background: ${({ theme }) => theme.palette.primary.dark};
      padding: 48px 32px;
      position: relative;
      overflow: hidden;
      border-radius: 28px;
      @media (max-width: 1199px) {
        padding: 36px 20px;
        border-radius: 20px;
      }
      @media (max-width: 599px) {
        padding: 28px 14px;
        border-radius: 16px;
      }
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(
          ellipse at 70% 50%,
          rgba(255, 198, 65, 0.07) 0%,
          transparent 65%
        );
        pointer-events: none;
      }
    }
  }

  .heritage_inner {
    text-align: center;
    max-width: 720px;
    margin: 0 auto;
  }

  .heritage_eyebrow {
    font-family: ${outFit.style.fontFamily};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.warning.light};
    margin-bottom: 20px;

    @media (max-width: 599px) {
      font-size: 10px;
      margin-bottom: 14px;
    }
  }

  .heritage_title {
    font-family: ${playFair.style.fontFamily};
    font-weight: 700;
    font-size: 48px;
    line-height: 1.15;
    color: ${({ theme }) => theme.palette.common.white};
    margin: 0 0 20px 0;

    @media (max-width: 1199px) {
      font-size: 40px;
    }
    @media (max-width: 899px) {
      font-size: 32px;
    }
    @media (max-width: 599px) {
      font-size: 26px;
      margin-bottom: 14px;
    }
  }

  .heritage_desc {
    font-family: ${outFit.style.fontFamily};
    font-size: 16px;
    font-weight: 400;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.65);
    margin: 0 0 56px 0;

    @media (max-width: 599px) {
      font-size: 14px;
      margin-bottom: 36px;
    }
  }

  .heritage_stats {
    display: flex;
    justify-content: center;
    gap: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 48px;
    flex-wrap: wrap;

    @media (max-width: 599px) {
      padding-top: 32px;
      gap: 0;
    }
  }

  .stat_item {
    flex: 1;
    min-width: 120px;
    text-align: center;
    padding: 0 24px;
    border-right: 1px solid rgba(255, 255, 255, 0.08);

    &:last-child {
      border-right: none;
    }

    @media (max-width: 599px) {
      padding: 0 16px;
    }

    .stat_number {
      font-family: ${playFair.style.fontFamily};
      font-size: 36px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.common.white};
      line-height: 1;
      margin-bottom: 6px;

      @media (max-width: 899px) {
        font-size: 28px;
      }
      @media (max-width: 599px) {
        font-size: 24px;
      }
    }

    .stat_label {
      font-family: ${outFit.style.fontFamily};
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.45);

      @media (max-width: 599px) {
        font-size: 10px;
        letter-spacing: 1px;
      }
    }
  }

  /* ─── Nutritional Clarity ─── */
  .nutrition_section {
    padding: 48px 0;
    background: ${({ theme }) => theme.palette.customColors?.lightCream};

    @media (max-width: 1199px) {
      padding: 36px 0;
    }
    @media (max-width: 599px) {
      padding: 24px 0;
    }
  }

  .section_eyebrow {
    font-family: ${outFit.style.fontFamily};
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.secondary.dark};
    margin-bottom: 10px;
  }

  .section_title {
    font-family: ${playFair.style.fontFamily};
    font-weight: 700;
    font-size: 36px;
    line-height: 1.2;
    color: ${({ theme }) => theme.palette.primary.dark};
    margin: 0 0 10px 0;

    @media (max-width: 1199px) {
      font-size: 30px;
    }
    @media (max-width: 599px) {
      font-size: 24px;
    }
  }

  .section_sub {
    font-family: ${outFit.style.fontFamily};
    font-size: 15px;
    font-weight: 400;
    line-height: 1.65;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin: 0 0 36px 0;

    @media (max-width: 599px) {
      font-size: 14px;
      margin-bottom: 24px;
    }
  }

  /* Nutrition Table */
  .nutrition_table {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid ${({ theme }) => theme.palette.grey[200]};
    border-radius: 16px;
    overflow: hidden;
    background: ${({ theme }) => theme.palette.common.white};
  }

  .nutrition_row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[100]};
    transition: background 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: ${({ theme }) => theme.palette.customColors?.lightCream};
    }

    .nutr_name {
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.palette.primary.dark};
    }

    .nutr_value {
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      font-weight: 500;
      color: ${({ theme }) => theme.palette.text.secondary};
    }
  }

  /* Quote Card */
  .quote_card {
    background: ${({ theme }) => theme.palette.primary.dark};
    border-radius: 20px;
    padding: 36px 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    position: relative;
    overflow: hidden;

    &::before {
      content: '"';
      position: absolute;
      top: -20px;
      left: 20px;
      font-size: 160px;
      font-family: ${playFair.style.fontFamily};
      color: rgba(255, 255, 255, 0.04);
      line-height: 1;
      pointer-events: none;
    }

    @media (max-width: 899px) {
      padding: 28px 24px;
    }

    .quote_icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;

      svg {
        width: 22px;
        height: 22px;
        color: ${({ theme }) => theme.palette.warning.light};
      }
    }

    .quote_text {
      font-family: ${playFair.style.fontFamily};
      font-size: 22px;
      font-weight: 600;
      line-height: 1.4;
      color: ${({ theme }) => theme.palette.common.white};
      margin-bottom: 20px;

      @media (max-width: 1199px) {
        font-size: 19px;
      }
    }

    .quote_author {
      font-family: ${outFit.style.fontFamily};
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.45);
    }
  }

  /* ─── Pairs Well With ─── */
  .pairs_section {
    padding: 48px 0;
    background: ${({ theme }) => theme.palette.common.white};

    @media (max-width: 1199px) {
      padding: 36px 0;
    }
    @media (max-width: 599px) {
      padding: 24px 0;
    }
  }

  .pairs_header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 32px;
    gap: 12px;

    @media (max-width: 599px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 20px;
    }

    .pairs_title {
      font-family: ${playFair.style.fontFamily};
      font-weight: 700;
      font-size: 34px;
      line-height: 1.15;
      color: ${({ theme }) => theme.palette.primary.dark};
      margin: 0;

      @media (max-width: 1199px) {
        font-size: 28px;
      }
      @media (max-width: 599px) {
        font-size: 22px;
      }
    }

    .explore_link {
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.palette.text.secondary};
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      transition: color 0.2s ease;

      &:hover {
        color: ${({ theme }) => theme.palette.primary.main};
      }
    }
  }

  .pairs_grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    @media (max-width: 1199px) {
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    @media (max-width: 899px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: 479px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }

  .pair_card {
    display: flex;
    flex-direction: column;

    .pair_img_box {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 16px;
      overflow: hidden;
      background: ${({ theme }) => theme.palette.customColors?.lightCream};
      margin-bottom: 12px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      &:hover img {
        transform: scale(1.05);
      }

      @media (max-width: 599px) {
        border-radius: 12px;
      }
    }

    .pair_name {
      font-family: ${outFit.style.fontFamily};
      font-size: 13px;
      font-weight: 600;
      color: ${({ theme }) => theme.palette.primary.dark};
      margin-bottom: 2px;
      line-height: 1.3;
    }

    .pair_price {
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.dark};
      margin-bottom: 10px;
    }

    .pair_add_btn {
      width: 100%;
      padding: 9px 12px;
      border-radius: 10px;
      border: 1.5px solid ${({ theme }) => theme.palette.grey[200]};
      background: transparent;
      font-family: ${outFit.style.fontFamily};
      font-size: 13px;
      font-weight: 600;
      color: ${({ theme }) => theme.palette.primary.dark};
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: ${({ theme }) => theme.palette.primary.dark};
        border-color: ${({ theme }) => theme.palette.primary.dark};
        color: ${({ theme }) => theme.palette.common.white};
      }
    }
  }
`;
