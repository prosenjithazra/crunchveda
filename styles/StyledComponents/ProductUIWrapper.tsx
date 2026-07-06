import { playFair, outFit } from "@/mui-theme/_muiTheme";
import { styled } from "@mui/material";

export const ProductUIWrapper = styled("div")`
  position: relative;
  padding: 60px 0 100px 0;
  background: ${({ theme }) => theme.palette.customColors?.lightGray};

  @media (max-width: 1199px) {
    padding: 40px 0 80px 0;
  }
  @media (max-width: 599px) {
    padding: 30px 0 60px 0;
  }

  .breadcrumb_box {
    margin-bottom: 10px;
    font-family: ${outFit.style.fontFamily};
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.text.secondary};

    a {
      color: ${({ theme }) => theme.palette.text.secondary};
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: ${({ theme }) => theme.palette.primary.main};
      }
    }

    span {
      margin: 0 8px;
    }
  }

  .collections_header {
    margin-bottom: 40px;
    @media(max-width: 1199px){
      margin-bottom: 32px;
    }
    @media(max-width: 599px){
      margin-bottom: 20px;
    }
    h1 {
      font-family: ${playFair.style.fontFamily};
      font-weight: 700;
      line-height: 1.2;
      color: ${({ theme }) => theme.palette.primary.dark};
      margin: 0 0 16px 0;
    }

    p {
      font-family: ${outFit.style.fontFamily};
      font-weight: 400;
      font-size: 16px;
      line-height: 1.6;
      color: ${({ theme }) => theme.palette.text.secondary};
      max-width: 700px;
      margin: 0;

      @media (max-width: 599px) {
        font-size: 14px;
      }
    }
  }

  /* Sidebar Overlay */
  .sidebar_overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px);
    z-index: 99;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;

    &.active {
      opacity: 1;
      pointer-events: auto;
    }
  }

  /* Sidebar Filters */
  .sidebar_container {
    background: ${({ theme }) => theme.palette.common.white};
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.03);
    position: sticky;
    top: 24px;
    .closeBtn{
      display: none;
      align-items: center;
      position: absolute;
      right: 6px;
      top: 6px;
      @media(max-width: 1199px){
        display: flex;
        align-items: center;
      }
    }
    @media (max-width: 1199px) {
      position: fixed;
      left: 0;
      top: 0;
      margin: 0;
      border-radius: 0 16px 16px 0;
      z-index: 100;
      height: 100dvh;
      overflow-y: auto;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;

      &.active {
        transform: translateX(0);
      }
    }
  }

  .filter_section {
    margin-bottom: 30px;

    &:last-child {
      margin-bottom: 0;
    }

    .filter_title {
      font-family: ${outFit.style.fontFamily};
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.palette.primary.dark};
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      padding-bottom: 8px;
    }
  }

  .category_list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .category_checkbox_label {
    display: flex;
    align-items: center;
    font-family: ${outFit.style.fontFamily};
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.text.primary};
    cursor: pointer;
    user-select: none;
    transition: color 0.2s ease;

    input {
      margin-right: 12px;
      accent-color: ${({ theme }) => theme.palette.primary.main};
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    &:hover {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  /* Price Range Slider */
  .price_slider_container {
    padding: 0 8px;

    .price_labels {
      display: flex;
      justify-content: space-between;
      margin-top: 12px;
      font-family: ${outFit.style.fontFamily};
      font-size: 13px;
      font-weight: 600;
      color: ${({ theme }) => theme.palette.text.secondary};
    }
  }

  /* Dietary Chips */
  .dietary_chips_container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .dietary_chip {
      padding: 8px 16px;
      border-radius: 20px;
      font-family: ${outFit.style.fontFamily};
      font-size: 13px;
      font-weight: 600;
      border: 1px solid ${({ theme }) => theme.palette.grey[300]};
      background: ${({ theme }) => theme.palette.common.white};
      color: ${({ theme }) => theme.palette.text.secondary};
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: ${({ theme }) => theme.palette.primary.main};
        color: ${({ theme }) => theme.palette.primary.main};
      }

      &.active {
        background: ${({ theme }) => theme.palette.primary.main};
        border-color: ${({ theme }) => theme.palette.primary.main};
        color: ${({ theme }) => theme.palette.common.white};
      }
    }
  }

  /* Main Listing Header */
  .listing_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    font-family: ${outFit.style.fontFamily};

    @media (max-width: 599px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .results_count {
      font-size: 14px;
      font-weight: 500;
      color: ${({ theme }) => theme.palette.text.secondary};
    }

    .sort_select_container {
      display: flex;
      align-items: center;
      gap: 8px;

      span {
        font-size: 14px;
        font-weight: 500;
        color: ${({ theme }) => theme.palette.text.secondary};
      }

      .MuiSelect-select {
        padding: 8px 32px 8px 16px;
        border-radius: 10px;
        border: 1px solid ${({ theme }) => theme.palette.grey[300]};
        background: ${({ theme }) => theme.palette.common.white};
        font-family: ${outFit.style.fontFamily};
        font-size: 14px;
        font-weight: 600;
        color: ${({ theme }) => theme.palette.text.primary};
        cursor: pointer;
        outline: none;
      
        &:focus {
          border-color: ${({ theme }) => theme.palette.primary.main};
        }
      }
      fieldset{
        display: none;
      }
    }
  }

  /* Product Grid */
  .products_grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 1199px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    @media (max-width: 479px) {
      grid-template-columns: 1fr;
    }
  }

  /* Product Card */
  .product_card {
    background: ${({ theme }) => theme.palette.common.white};
    border-radius: 24px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
    height: 100%;
    @media(max-width: 1199px){
      border-radius: 20px;
      padding: 14px;
    }
     @media(max-width: 899px){
      border-radius: 16px;
      padding: 12px;
    }
    &:hover {
      box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.06);
    }
  }

  .product_img_box {
    position: relative;
    width: 100%;
    aspect-ratio: 1.1 / 1;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 16px;
    background: ${({ theme }) => theme.palette.customColors?.lightCream || "#FCF9F2"};
         @media(max-width: 899px){
      border-radius: 12px;
    margin-bottom: 10px;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  .card_badge {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 5;
    padding: 6px 12px;
    border-radius: 20px;
    font-family: ${outFit.style.fontFamily};
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;

    &.badge_organic {
      background: ${({ theme }) => theme.palette.primary.main};
      color: ${({ theme }) => theme.palette.common.white};
    }

    &.badge_bestseller {
      background: ${({ theme }) => theme.palette.warning.light};
      color: ${({ theme }) => theme.palette.primary.dark};
    }

    &.badge_discount {
      background: rgba(47, 128, 237, 0.15);
      color: #2F80ED;
    }

    &.badge_toprated {
      background: rgba(224, 82, 82, 0.15);
      color: #e05252;
    }
  }

  .wishlist_btn {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 5;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(6px);
    color: ${({ theme }) => theme.palette.grey[400]};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.25s ease;

    svg {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.98);
      color: #e05252;
      transform: scale(1.1);

      svg {
        transform: scale(1.15);
      }
    }

    &.wishlisted {
      background: rgba(255, 255, 255, 0.98);
      color: #e05252;

      svg {
        transform: scale(1.05);
      }
    }
  }

  .card_title_row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;

    .card_title {
      font-family: ${playFair.style.fontFamily};
      font-weight: 600;
      font-size: 19px;
      color: ${({ theme }) => theme.palette.primary.dark};
      line-height: 1.3;
      margin: 0;
      @media(max-width: 599px){
        font-size: 16px;
      }
    }

    .card_rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: ${outFit.style.fontFamily};
      font-size: 13px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.text.primary};
      flex-shrink: 0;

      svg {
        width: 14px;
        height: 14px;
        color: #FFC641;
      }
    }
  }

  .card_desc {
    font-family: ${outFit.style.fontFamily};
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin: 0 0 16px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 42px;
  }

  .card_size_row {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    @media(max-width: 599px){
      margin-bottom: 10px;
    }
    .size_pill {
      padding: 6px 12px;
      border-radius: 8px;
      font-family: ${outFit.style.fontFamily};
      font-size: 12px;
      font-weight: 600;
      border: 1px solid ${({ theme }) => theme.palette.grey[300]};
      background: ${({ theme }) => theme.palette.common.white};
      color: ${({ theme }) => theme.palette.text.secondary};
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: ${({ theme }) => theme.palette.primary.main};
      }

      &.active {
        background: ${({ theme }) => theme.palette.primary.dark};
        border-color: ${({ theme }) => theme.palette.primary.dark};
        color: ${({ theme }) => theme.palette.common.white};
      }
    }
  }

  .card_footer_row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;

    .card_price {
      font-family: ${outFit.style.fontFamily};
      font-size: 22px;
      font-weight: 700;
      color: ${({ theme }) => theme.palette.primary.dark};
      @media (max-width: 599px) {
        font-size: 18px;
      }
    }

    .card_actions {
      display: flex;
      gap: 8px;

      .action_btn {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        flex-shrink: 0;

        &.btn_cart {
          background: ${({ theme }) => theme.palette.common.white};
          border: 1.5px solid ${({ theme }) => theme.palette.grey[300]};
          color: ${({ theme }) => theme.palette.text.primary};

          svg {
            width: 18px;
            height: 18px;
            stroke-width: 2px;
          }

          &:hover {
            border-color: ${({ theme }) => theme.palette.primary.main};
            color: ${({ theme }) => theme.palette.primary.main};
            background: rgba(32, 53, 39, 0.02);
          }
        }

        &.btn_whatsapp {
          background: ${({ theme }) => theme.palette.success.light};
          color: ${({ theme }) => theme.palette.common.white};
          padding: 0;
          svg {
            width: 100%;
            height: auto;
          }

          &:hover {
            background: #20BA56;
            transform: scale(1.05);
          }
        }
      }
    }
  }

  /* Pagination */
  .pagination_container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 48px;

    .page_btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      font-weight: 600;
      border: 1px solid ${({ theme }) => theme.palette.grey[300]};
      background: ${({ theme }) => theme.palette.common.white};
      color: ${({ theme }) => theme.palette.text.secondary};
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        border-color: ${({ theme }) => theme.palette.primary.main};
        color: ${({ theme }) => theme.palette.primary.main};
      }

      &.active {
        background: ${({ theme }) => theme.palette.primary.dark};
        border-color: ${({ theme }) => theme.palette.primary.dark};
        color: ${({ theme }) => theme.palette.common.white};
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
  .filerIcon_wrapper{
    display: none;
    @media(max-width: 1199px){
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 16px;
    }
  }

  /* Empty State Styles */
  .no_results_box {
    background: ${({ theme }) => theme.palette.common.white};
    border-radius: 24px;
    padding: 60px 40px;
    text-align: center;
    box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.02);
    border: 1px dashed ${({ theme }) => theme.palette.grey[300]};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    margin: 10px auto;
    
    @media (max-width: 599px) {
      padding: 40px 20px;
      margin: 20px auto;
    }

    .icon_container {
      margin-bottom: 24px;
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 100px;
      background: ${({ theme }) => theme.palette.customColors?.lightCream || "#FCF9F2"};
      border-radius: 50%;
      color: ${({ theme }) => theme.palette.primary.main};
      
      svg {
        width: 64px;
        height: 64px;
        color: ${({ theme }) => theme.palette.primary.main};
      }
      
      animation: bobbing 3s ease-in-out infinite;

      .box_lid_group {
        animation: lidHover 3s ease-in-out infinite;
        transform-origin: 32px 20px;
      }

      .magnifier_group {
        animation: searchMotion 4s ease-in-out infinite;
        transform-origin: 44px 40px;
      }

      .sparkle {
        fill: ${({ theme }) => theme.palette.warning.light || "#FFC641"};
        stroke: none;
        
        &.p1 {
          animation: float1 3s ease-in-out infinite;
        }
        &.p2 {
          animation: float2 3.5s ease-in-out infinite 0.7s;
        }
        &.p3 {
          animation: float3 2.8s ease-in-out infinite 1.4s;
        }
      }
    }

    .no_results_title {
      font-family: ${playFair.style.fontFamily};
      font-weight: 700;
      font-size: 22px;
      color: ${({ theme }) => theme.palette.primary.dark};
      margin: 0 0 12px 0;
    }

    .no_results_desc {
      font-family: ${outFit.style.fontFamily};
      font-size: 14px;
      color: ${({ theme }) => theme.palette.text.secondary};
      max-width: 320px;
      margin: 0 auto 24px auto;
      line-height: 1.6;
    }

    .clear_filters_btn {
      font-family: ${outFit.style.fontFamily};
      font-weight: 600;
      font-size: 14px;
      padding: 10px 24px;
      border-radius: 30px;
      border: 1.5px solid ${({ theme }) => theme.palette.primary.main};
      background: transparent;
      color: ${({ theme }) => theme.palette.primary.main};
      cursor: pointer;
      transition: all 0.2s ease;
      outline: none;
      
      &:hover {
        background: ${({ theme }) => theme.palette.primary.main};
        color: ${({ theme }) => theme.palette.common.white};
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
    }
  }

  @keyframes bobbing {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }

  @keyframes lidHover {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-4px) rotate(-4deg);
    }
  }

  @keyframes searchMotion {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    33% {
      transform: translate(-4px, -2px) scale(1.05);
    }
    66% {
      transform: translate(3px, 1px) scale(0.95);
    }
  }

  @keyframes float1 {
    0% {
      transform: translate(0, 0) scale(0.5);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translate(-12px, -20px) scale(1.2);
      opacity: 0;
    }
  }

  @keyframes float2 {
    0% {
      transform: translate(0, 0) scale(0.5);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translate(10px, -24px) scale(1.2);
      opacity: 0;
    }
  }

  @keyframes float3 {
    0% {
      transform: translate(0, 0) scale(0.5);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translate(2px, -16px) scale(1.2);
      opacity: 0;
    }
  }
`;
