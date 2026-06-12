import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const HeritageTimelineWrapper = styled("section")`
  position: relative;
  padding: 100px 0;
  background: ${({ theme }) => theme.palette.customColors?.lightGrey};

  @media (max-width: 1199px) {
    padding: 80px 0;
  }
  @media (max-width: 899px) {
    padding: 60px 0;
  }

  .timeline_header {
    text-align: center;
    margin-bottom: 60px;
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
      margin-bottom: 16px;
    }

    p {
      font-family: ${outFit.style.fontFamily};
      font-weight: 400;
      font-size: 16px;
      color: ${({ theme }) => theme.palette.text.secondary};

      @media (max-width: 599px) {
        font-size: 14px;
      }
    }
  }

  .timeline_container {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px 0;

    &::before {
      content: "";
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 2px;
      background: ${({ theme }) => theme.palette.grey[300]};
      transform: translateX(-50%);

      @media (max-width: 767px) {
        left: 20px;
        transform: none;
      }
    }
  }

  .timeline_event {
    position: relative;
    width: 50%;
    padding: 20px 40px;
    box-sizing: border-box;

    @media (max-width: 767px) {
      width: 100%;
      left: 0 !important;
      text-align: left !important;
      padding-left: 50px;
      padding-right: 0;
      padding-bottom: 30px;
    }

    &.event_left {
      left: 0;
      text-align: right;

      .event_node {
        right: -20px;
      }

      .event_desc {
        margin-left: auto;
      }
    }

    &.event_right {
      left: 50%;
      text-align: left;

      .event_node {
        left: -20px;
      }

      .event_desc {
        margin-right: auto;
      }
    }

    .event_year {
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.palette.text.secondary};
      margin-bottom: 4px;
      display: block;
    }

    .event_title {
      font-family: ${outFit.style.fontFamily};
      font-weight: 700;
      font-size: 18px;
      color: ${({ theme }) => theme.palette.secondary.light};
      margin-bottom: 12px;

      @media (max-width: 599px) {
        font-size: 16px;
        margin-bottom: 8px;
      }
    }

    .event_desc {
      font-family: ${outFit.style.fontFamily};
      font-weight: 400;
      font-size: 14px;
      line-height: 1.6;
      color: ${({ theme }) => theme.palette.customColors?.textColor};
      max-width: 420px;

      @media (max-width: 767px) {
        margin: 0 !important;
      }
    }
  }

  .event_node {
    position: absolute;
    top: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.primary.dark};
    color: ${({ theme }) => theme.palette.common.white};
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${outFit.style.fontFamily};
    font-weight: 700;
    font-size: 16px;
    z-index: 10;
    border: 4px solid ${({ theme }) => theme.palette.customColors?.lightCream};
    box-sizing: border-box;

    @media (max-width: 767px) {
      left: 0 !important;
      right: auto !important;
    }
  }
`;
