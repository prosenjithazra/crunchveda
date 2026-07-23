import { styled } from "@mui/material";
import { playFair, outFit } from "@/mui-theme/_muiTheme";

export const ContactMainWrapper = styled("section")`
  position: relative;
  width: 100%;
  padding-bottom: 48px;
  background-color: ${({ theme }) => theme.palette.customColors.lightCream};

  @media (max-width: 1199px) {
    padding-bottom: 36px;
  }
  @media (max-width: 599px) {
    padding-bottom: 24px;
  }

  /* Left side (Global Presence) */
  .presence_box {
    padding-right: 40px;
    @media(max-width: 899px) {
      padding-right: 0;
      margin-bottom: 48px;
    }
  }

  .section_tag {
    font-family: ${outFit.style.fontFamily};
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2.6px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.palette.secondary.light};
    margin-bottom: 12px;
    display: inline-block;
    @media(max-width: 599px) {
      font-size: 11px;
      margin-bottom: 8px;
    }
  }

  .section_title_large {
    font-family: ${playFair.style.fontFamily};
    font-size: 44px;
    font-weight: 700;
    line-height: 1.2;
    color: ${({ theme }) => theme.palette.primary.main};
    margin-bottom: 24px;
    @media(max-width: 1199px) {
      font-size: 36px;
      margin-bottom: 18px;
    }
    @media(max-width: 599px) {
      font-size: 28px;
      margin-bottom: 8px;
    }
  }

  .flagship_title {
    font-family: ${playFair.style.fontFamily};
    font-size: 28px;
    font-weight: 700;
    line-height: 1.3;
    color: ${({ theme }) => theme.palette.primary.main};
    margin-top: 8px;
    margin-bottom: 12px;
    white-space: pre-line;
    @media(max-width: 599px) {
      font-size: 22px;
    }
  }

  .map_link {
    font-family: ${outFit.style.fontFamily};
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.palette.primary.main};
    text-decoration: underline;
    text-underline-offset: 4px;
    letter-spacing: 0.5px;
    display: inline-flex;
    align-items: center;
    transition: opacity 0.2s ease;
    margin-bottom: 40px;

    &:hover {
      opacity: 0.8;
    }
  }

  .details_grid {
    margin-bottom: 40px;
  }

  .details_title {
    font-family: ${outFit.style.fontFamily};
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${({ theme }) => theme.palette.secondary.light};
    margin-bottom: 8px;
  }

  .details_content {
    font-family: ${outFit.style.fontFamily};
    font-size: 14px;
    line-height: 1.6;
    color: ${({ theme }) => theme.palette.primary.main};
    
    a {
      color: inherit;
      text-decoration: none;
      display: block;
      transition: opacity 0.2s ease;
      &:hover {
        opacity: 0.8;
      }
    }
  }

  .social_links {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    a {
      font-family: ${outFit.style.fontFamily};
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.primary.main};
      text-decoration: none;
      letter-spacing: 1.2px;
      transition: opacity 0.2s ease;
      &:hover {
        opacity: 0.7;
      }
    }
  }

  .live_concierge_card {
    background-color: ${({ theme }) => theme.palette.customColors.greyLightBg};
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid ${({ theme }) => theme.palette.customColors.lightGray};
    transition: all 0.3s ease;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
    }

    .card_info {
      h4 {
        font-family: ${playFair.style.fontFamily};
        font-size: 20px;
        font-weight: 600;
        color: ${({ theme }) => theme.palette.primary.main};
        margin-bottom: 4px;
      }
      p {
        font-family: ${outFit.style.fontFamily};
        font-size: 12px;
        color: ${({ theme }) => theme.palette.customColors.textColor};
        margin: 0;
      }
    }

    .whatsapp_badge {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.palette.primary.main};
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
      
      svg {
        width: 22px;
        height: 22px;
      }
    }

    &:hover .whatsapp_badge {
      background-color: #25D366;
    }
  }

  /* Right side (Send a Message Form) */
  .form_card {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 48px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.03);
    @media(max-width: 1199px) {
      padding: 32px;
    }
    @media(max-width: 599px) {
      padding: 24px 20px;
    }

    .form_title {
      font-family: ${playFair.style.fontFamily};
      font-size: 32px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.main};
      margin-bottom: 32px;
      @media(max-width: 599px) {
        font-size: 26px;
        margin-bottom: 24px;
      }
    }
  }

  .form_group {
    margin-bottom: 24px;
  }

  .form_label {
    font-family: ${outFit.style.fontFamily};
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: ${({ theme }) => theme.palette.primary.main};
    margin-bottom: 8px;
    display: block;
  }

  .form_input {
    width: 100%;
    background-color: #ffffff;
    
    .MuiInputBase-root {
      background-color: #ffffff;
      border: 1px solid #E2E2DF;
      border-radius: 4px;
      min-height: 48px;
      padding: 10px 16px;
      transition: border-color 0.2s ease;

      &:hover {
        border-color: #E2E2DF;
      }

      &.Mui-focused {
        border-color: #E2E2DF;
        box-shadow: none;
        outline: none;
      }

      input {
        font-family: ${outFit.style.fontFamily};
        font-size: 14px;
        padding: 0;
        color: ${({ theme }) => theme.palette.primary.main};

        &::placeholder {
          color: #A3A39E;
          opacity: 1;
        }
      }
    }

    fieldset {
      display: none;
    }
  }

  .form_select {
    width: 100%;
    
    &.MuiInputBase-root {
      background-color: #ffffff;
      border: 1px solid #E2E2DF;
      border-radius: 4px;
      min-height: 48px;
      transition: border-color 0.2s ease;

      &:hover {
        border-color: #E2E2DF;
      }

      &.Mui-focused {
        border-color: #E2E2DF;
        box-shadow: none;
        outline: none;
      }
    }
    
    .MuiSelect-select {
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      color: ${({ theme }) => theme.palette.primary.main};
      padding: 12px 16px;
    }

    fieldset {
      display: none;
    }
  }

  .form_textarea {
    width: 100%;
    
    .MuiInputBase-root {
      background-color: #ffffff;
      border: 1px solid #E2E2DF;
      border-radius: 4px;
      padding: 12px 16px;
      min-height: 120px;
      align-items: flex-start;

      &:hover {
        border-color: #E2E2DF;
      }

      &.Mui-focused {
        border-color: #E2E2DF;
        box-shadow: none;
        outline: none;
      }

      textarea {
        font-family: ${outFit.style.fontFamily};
        font-size: 14px;
        padding: 0;
        color: ${({ theme }) => theme.palette.primary.main};

        &::placeholder {
          color: #A3A39E;
          opacity: 1;
        }
      }
    }

    fieldset {
      display: none;
    }
  }
`;
