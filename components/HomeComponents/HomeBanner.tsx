import { assets } from "@/json/assest";
import { HomeBannerWrapper } from "@/styles/StyledComponents/HomeBannerWrapper";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function HomeBanner() {
  return (
    <HomeBannerWrapper>
      <Image
        src={assets.homeBannerImg}
        alt="Premium NutriHarvest dry fruits and organic pantry ingredients"
        title="Premium dry fruits delivered fresh by NutriHarvest"
        width={8000}
        height={6000}
        className="bannerImg"
        priority
      />
      <Container fixed>
        <Box className="bannerTxtBoxWrapper">
          <Typography variant="body1" className="cmnSmallTitle">
            CRAFTING AGRICULTURAL EXCELLENCE
          </Typography>
          <Typography variant="h1">
            Premium Dry Fruits Delivered Fresh
          </Typography>
          <Typography variant="body1">
            Experience the pinnacle of nutrition with our hand- picked selection
            of gourmet dry fruits, sourced directly from the finest organic
            orchards across the globe.
          </Typography>
          <Box className='btnWrapper'>
            <Button variant="contained" color="primary" disableRipple component={Link} href="/product">
              Explore Collection
            </Button>
          </Box>
        </Box>
      </Container>
    </HomeBannerWrapper>
  );
}
