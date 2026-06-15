import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

export type AdminNavigationItem = {
  label: string;
  href?: string;
  icon: SvgIconComponent;
  children?: {
    label: string;
    href: string;
    icon: SvgIconComponent;
  }[];
};

export const adminNavigation: AdminNavigationItem[] = [
  { label: "Dashboard", href: "/admin", icon: DashboardOutlinedIcon },
  { label: "Products", href: "/admin/products", icon: Inventory2OutlinedIcon },
  { label: "Categories", href: "/admin/categories", icon: CategoryOutlinedIcon },
  { label: "Bestsellers", href: "/admin/bestsellers", icon: StarBorderOutlinedIcon },
  {
    label: "Pages",
    icon: ArticleOutlinedIcon,
    children: [
      { label: "Homepage", href: "/admin/content/home", icon: StorefrontOutlinedIcon },
      { label: "Categories", href: "/admin/content/categories", icon: CategoryOutlinedIcon },
      { label: "Product Page", href: "/admin/content/products", icon: Inventory2OutlinedIcon },
      { label: "Product Details", href: "/admin/content/product-detail", icon: Inventory2OutlinedIcon },
      { label: "Best Seller", href: "/admin/content/best-seller", icon: StarBorderOutlinedIcon },
      { label: "Gifts", href: "/admin/content/gifts", icon: LocalMallOutlinedIcon },
      { label: "About Us", href: "/admin/content/about-us", icon: ArticleOutlinedIcon },
      { label: "Our Story", href: "/admin/content/our-story", icon: ArticleOutlinedIcon },
      { label: "Sustainability", href: "/admin/content/sustainability", icon: SpaOutlinedIcon },
      { label: "Contact", href: "/admin/content/contact-us", icon: ContactSupportOutlinedIcon },
      { label: "Cart", href: "/admin/content/cart", icon: ShoppingCartOutlinedIcon },
      { label: "Saved Items", href: "/admin/content/saved", icon: FavoriteBorderOutlinedIcon },
      { label: "Policies", href: "/admin/content/privacy-policy", icon: GavelOutlinedIcon },
      { label: "Terms", href: "/admin/content/terms-condition", icon: GavelOutlinedIcon },
    ],
  },
  { label: "Media", href: "/admin/media", icon: PhotoLibraryOutlinedIcon },
  { label: "Settings", href: "/admin/settings", icon: SettingsOutlinedIcon },
];
