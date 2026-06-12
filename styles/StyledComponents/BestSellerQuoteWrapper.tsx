import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const BestSellerQuoteWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding: 40px 0 80px;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};

  @media(max-width: 1199px) {
    padding-bottom: 60px;
  }
  @media(max-width: 599px) {
    padding-bottom: 40px;
  }

  .quote_split_banner {
    width: 100%;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
    display: flex;
    min-height: 480px;

    @media(max-width: 899px) {
      flex-direction: column;
      min-height: auto;
    }
  }

  .left_quote_content {
    background-color: ${({ theme }) => theme.palette.primary.dark};
    color: #ffffff;
    padding: 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
    
    @media(max-width: 1199px) {
      padding: 48px;
    }
    @media(max-width: 899px) {
      width: 100%;
      padding: 48px 32px;
    }

    h2 {
      font-family: ${playFair.style.fontFamily};
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 24px;
      line-height: 1.3;
      @media(max-width: 599px) {
        font-size: 24px;
      }
    }

    .quote_desc {
      font-family: ${outFit.style.fontFamily};
      font-size: 15px;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 24px;
      font-style: italic;
      @media(max-width: 599px) {
        font-size: 14px;
      }
    }

    .quote_author {
      font-family: ${outFit.style.fontFamily};
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.warning.light};
    }
  }

  .right_quote_imgBox {
    position: relative;
    width: 50%;
    
    @media(max-width: 899px) {
      width: 100%;
      height: 320px;
    }
    @media(max-width: 599px) {
      height: 240px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
`;
