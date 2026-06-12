import { playFair } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const FooterWrapper = styled("footer")`
  position: relative;
  background: ${({ theme }) => theme.palette.customColors?.footerBg};
  border-top: 1px solid rgba(115, 121, 115, 0.1);
  padding-top: 80px;
  padding-bottom: 24px;
    @media(max-width: 1199px){
        padding: 60px 0 20px;
    }
     @media(max-width: 899px){
        padding: 40px 0 100px;
    }
  .footer_grid {
    display: grid;
    gap: 32px;
    grid-template-columns: 1fr;

    

    @media (min-width: 1200px) {
      grid-template-columns: 1.8fr 1fr 1fr 1.6fr;
    }

    @media (max-width: 1199px) {
      gap: 0;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      align-items: flex-start;
      row-gap: 20px;
    }
    .firstClm{
        @media (max-width: 1199px) {
           width: 50%;
        }

    @media(max-width: 599px){
        width: 100%;
    }
    }
    .cmnClm{
        @media (max-width: 1199px) {
           width: 20%;
        }

    @media(max-width: 599px){
        width: 40%;
    }
    }
    .newsLetterClm{
        @media (max-width: 1199px) {
           width: 100%;
        }
    }
  }

  .brand_title {
    font-family: ${playFair.style.fontFamily};
    font-weight: 700;
  }

  .brand_desc {
    color: ${({ theme }) => theme.palette.text.secondary};
    max-width: 360px;
    line-height: 1.8;

        @media (max-width: 1199px) {
            max-width: 100%;
            line-height: 1.5;
        }
  }

  .social_icon {
    align-items: center;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: 50%;
    color: ${({ theme }) => theme.palette.text.secondary};
    display: grid;
    font-size: 10px;
    height: 34px;
    place-items: center;
    width: 34px;
    cursor: pointer;
    transition: all 0.3s ease;
    svg{
        width: 16px;
        height: auto;
    }
    &:hover {
      color: ${({ theme }) => theme.palette.primary.main};
      border-color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  .widget_title {
    font-family: ${playFair.style.fontFamily};
    font-weight: 700;
    font-size: 18px;
  }

  .subscribe_desc {
    color: ${({ theme }) => theme.palette.text.secondary};
    line-height: 1.7;
    @media(max-width: 1199px){
        line-height: 1.5;
    }
  }

  .subscribe_btn {
    min-width: 94px;
  }

  .footer_divider {
    margin-top: 30px;
    margin-bottom: 24px;

    @media (max-width: 900px) {
      margin-top: 24px;
      margin-bottom: 16px;
    }
  }
  .input_wrap{
    @media(max-width: 1199px){
        width: 100%;
    }
  }
  .footer_bottom {
    display: flex;
      align-items: center;
      flex-direction: row;
    gap: 16px;
    justify-content: space-between;

    @media (max-width: 599px) {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  }

  .copyright_text {
    color: ${({ theme }) => theme.palette.text.secondary};
    a{
    color: ${({ theme }) => theme.palette.text.secondary};
    &:hover{
       color: ${({ theme }) => theme.palette.primary.main};
    }

    }
  }

  .payment_icons {
    color: ${({ theme }) => theme.palette.text.disabled};
  }

  .footer_link {
    color: ${({ theme }) => theme.palette.text.secondary};
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }
`;
