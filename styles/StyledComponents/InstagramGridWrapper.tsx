import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const InstagramGridWrapper = styled("section")`
  position: relative;
  padding: 80px 0;
  background: ${({ theme }) => theme.palette.customColors?.lightCream};

  @media (max-width: 1199px) {
    padding: 60px 0;
  }
  @media (max-width: 599px) {
    padding: 40px 0;
  }

  .instagram_header {
    text-align: center;
    margin-bottom: 48px;
    @media (max-width: 1199px) {
      margin-bottom: 32px;
    }
    @media (max-width: 599px) {
      margin-bottom: 24px;
    }
    h2 {
      font-family: ${playFair.style.fontFamily};
      font-weight: 600;
      color: ${({ theme }) => theme.palette.primary.dark};
      margin-bottom: 12px;
      @media (max-width: 599px) {
        margin-bottom: 8px;
      }
      span.at_symbol {
        font-style: italic;
        font-family: ${playFair.style.fontFamily};
        margin-right: 2px;
      }
    }

    p {
      font-family: ${outFit.style.fontFamily};
      font-weight: 400;
      font-size: 15px;
      color: ${({ theme }) => theme.palette.text.secondary};

      @media (max-width: 599px) {
        font-size: 14px;
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

  .instagram_card {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.02);
    transition:
      transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
      box-shadow 0.4s ease;
    background: ${({ theme }) => theme.palette.common.white};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    &:hover {
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);

      img {
        transform: scale(1.05);
      }
    }

    @media (max-width: 599px) {
      border-radius: 16px;
    }
  }
`;
