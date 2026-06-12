import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const ProductDetailsSectionWrapper = styled("section")`
  position: relative;
  padding: 100px 0;
  background: ${({ theme }) => theme.palette.customColors?.lightCream};

  @media (max-width: 1199px) {
    padding: 80px 0;
  }
  @media (max-width: 899px) {
    padding: 60px 0;
  }

  .details_container {
    display: flex;
    flex-direction: column;
    gap: 120px;

    @media (max-width: 1199px) {
      gap: 80px;
    }
    @media (max-width: 899px) {
      gap: 60px;
    }
  }

  .detail_imgBox {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 48px;
    overflow: hidden;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.03);
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
      border-radius: 24px;
    }
  }

  .detail_content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;

    .cmnSmallTitle {
      font-family: ${outFit.style.fontFamily};
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 2.8px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.secondary?.dark};
      margin-bottom: 12px;

      @media (max-width: 599px) {
        font-size: 12px;
        letter-spacing: 1.5px;
        margin-bottom: 8px;
      }
    }

    h2 {
      font-family: ${playFair.style.fontFamily};
      font-weight: 600;
      font-size: 40px;
      line-height: 1.25;
      color: ${({ theme }) => theme.palette.primary.dark};
      margin-bottom: 20px;

      @media (max-width: 1199px) {
        font-size: 34px;
      }
      @media (max-width: 899px) {
        font-size: 28px;
      }
      @media (max-width: 599px) {
        font-size: 24px;
        margin-bottom: 12px;
      }
    }

    p {
      font-family: ${outFit.style.fontFamily};
      font-weight: 400;
      font-size: 16px;
      line-height: 1.7;
      color: ${({ theme }) => theme.palette.customColors?.textColor};
      margin-bottom: 24px;

      @media (max-width: 599px) {
        font-size: 14px;
        margin-bottom: 16px;
      }
    }
  }

  .bullet_list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    @media (max-width: 599px) {
      gap: 12px;
    }
  }

  .bullet_item {
    display: flex;
    align-items: center;
    gap: 12px;

    span {
      font-family: ${outFit.style.fontFamily};
      font-weight: 600;
      font-size: 15px;
      color: ${({ theme }) => theme.palette.primary.dark};

      @media (max-width: 599px) {
        font-size: 14px;
      }
    }

    svg {
      width: 20px;
      height: 20px;
      color: ${({ theme }) => theme.palette.warning.main};
    }
  }
`;
