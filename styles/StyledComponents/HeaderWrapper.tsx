import { outFit } from "@/mui-theme/_muiTheme";
import { Box, Drawer, styled } from "@mui/material";

export const HeaderWrapper = styled("header")`
  position: sticky;
  top: 0;
  z-index: 99;
  padding: 16px 0;
  background: ${({ theme }) => theme.palette.customColors?.headerBg};
  box-shadow: 0px 20px 40px rgba(6, 27, 14, 0.03);
  backdrop-filter: blur(12px);
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    padding 0.3s,
    background-color 0.3s,
    box-shadow 0.3s;
  transform: translateY(0);

  &.scroll-top {
    background: ${({ theme }) => theme.palette.customColors?.headerBg};
    box-shadow: 0px 20px 40px rgba(6, 27, 14, 0.03);
  }

  &.scroll-down {
    transform: translateY(-100%);
    box-shadow: none;
  }

  &.scroll-up {
    transform: translateY(0);
    padding: 10px 0;
    background: ${({ theme }) => {
      const bg = theme.palette.customColors?.headerBg || "#FCF9F2";
      return bg.startsWith("#") ? `${bg}dd` : bg;
    }};
    box-shadow: 0px 10px 30px rgba(6, 27, 14, 0.08);
    backdrop-filter: blur(16px);
  }

  @media (max-width: 1199px) {
    padding: 12px 0;
    &.scroll-up {
      padding: 8px 0;
    }
  }
  .mainHeaderWrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logoBox {
      position: relative;
      a {
        max-width: 180px;
        line-height: 0;
        font-size: 0;

        @media (max-width: 1199px) {
          max-width: 140px;
        }
        @media (max-width: 599px) {
          max-width: 120px;
        }
        img {
          width: 100%;
          height: auto;
          font-size: 0;
        }
      }
    }
    .menulistBox {
      @media (max-width: 899px) {
        display: none;
      }
      ul {
        display: flex;
        align-items: center;
        gap: 30px;

        @media (max-width: 1199px) {
          gap: 16px;
        }
        li {
          width: auto;
          a {
            position: relative;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 1.12px;
            color: ${({ theme }) => theme.palette.customColors.light};
            transition: 0.4s ease-in-out;
            font-family: ${outFit.style.fontFamily};
            &:hover,
            &.active {
              color: ${({ theme }) => theme.palette.primary.main};
              &::before {
                width: 100%;
                opacity: 1;
              }
            }
            &::before {
              position: absolute;
              content: "";
              left: 0;
              bottom: -6px;
              opacity: 0;
              width: 0;
              height: 3px;
              border-radius: 20px;
              background: ${({ theme }) => theme.palette.primary.main};
              transition: 0.4s ease-in-out;
            }
          }
        }
      }
    }
    .wrapper_rightListBox {
      display: flex;
      align-items: center;
      gap: 10px;
      @media(max-width:899px){
        gap:6px;
      }
      .searchBtn {
        padding: 10px;
        border-radius: 50%;
        &:hover {
          background: ${({ theme }) => theme.palette.grey[200]};
        }
      }
      .cartBtn {
        padding: 0;
        position: relative;
        margin-right:10px;
        span {
          position: absolute;
          right: -6px;
          top: -6px;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 500;
          background: ${({ theme }) => theme.palette.secondary.light};
          color: ${({ theme }) => theme.palette.common.white};
          font-family: ${outFit.style.fontFamily};
          border-radius: 50%;
        }
      }
      .whatsAppBtn {
        svg{
          display:none;
        }
        @media (max-width: 1199px) {
          svg{
            display:block;
          }
          font-size:0;
          border-radius:50%;
          font-size:0;
          padding:0;
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
        }
      }
    }
  }
`;

export const MobileMenuWrapper = styled(Box)`
  .mobileMenuListBox {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: 16px;
    background: ${({ theme }) => theme.palette.primary?.main};
    border-radius: 50px;
    padding: 10px 48px;
    display: none;
    z-index: 999;
    @media (max-width: 899px) {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    @media (max-width: 479px) {
      padding: 10px 32px;
    }
    ul {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      li {
        width: auto;
        a {
          color: ${({ theme }) => theme.palette.common?.white};
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 2px;
          &.active,
          &:hover {
            color: ${({ theme }) => theme.palette.secondary?.light};
          }
          i {
            width: 20px;
            height: 20px;
            svg {
              width: 100%;
              height: auto;
              font-size: 0;
            }
          }
        }
      }
    }
  }
`;

export const SearchDrawer = styled(Drawer)`
  .MuiPaper-root {
    height: 100dvh;
    align-items: center;
    justify-content: center;
    display: flex;
    .innerDrawerWrapper {
      width: 100%;
      max-width: 680px;
      margin: 0 auto;
      text-align: center;
      padding: 24px 16px;
    }
    .searchBtn {
      min-height: inherit;
      height: auto;
    }
  }
`;
