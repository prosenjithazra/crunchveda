import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const CuratedCategoriesWrapper = styled("section")`
  position: relative;
  padding: 80px 0;
  background: ${({ theme }) => theme.palette.customColors.headerBg};
  @media (max-width: 1199px) {
    padding: 60px 0;
  }
  @media (max-width: 599px) {
    padding: 40px 0;
  }
  .wrapper_titleBox {
    text-align: center;
    margin-bottom: 48px;
    h2 {
      position: relative;
      padding-bottom: 16px;
      &::before {
        position: absolute;
        content: "";
        left: 50%;
        transform: translateX(-50%);
        background: ${({ theme }) => theme.palette.warning.light};
        height: 4px;
        width: 100px;
        bottom: 0;
        border-radius: 5px;
      }
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
      margin-top: 24px;
      gap: 8px;

      .splide__pagination__page {
        background: ${({ theme }) => theme.palette.grey[300]};
        width: 8px;
        height: 8px;
        opacity: 1;
        transition: all 0.3s ease;

        &.is-active {
          background: ${({ theme }) => theme.palette.primary.main};
          width: 24px;
          border-radius: 4px;
        }
      }
    }
  }

  .category_card {
    text-align: center;
    width: 100%;

    a {
      display: block;
      text-decoration: none;
      color: inherit;
    }
  }

  .category_imgBox {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    transition:
      transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
      box-shadow 0.4s ease;
    background: ${({ theme }) => theme.palette.grey[100]};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }
  }

  .category_card {
    &:hover {
      .category_imgBox {
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
      }
      .category_img {
        transform: scale(1.06);
      }
      .category_title {
        color: ${({ theme }) => theme.palette.primary.main};
      }
    }
  }

  .category_title {
    font-family: ${playFair.style.fontFamily};
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 4px;
    transition: color 0.3s ease;
    color: ${({ theme }) => theme.palette.primary.light};
  }

  .category_count {
    font-family: ${outFit.style.fontFamily};
    font-weight: 500;
    font-size: 11px;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.palette.text.secondary};
    text-transform: uppercase;
  }
`;
