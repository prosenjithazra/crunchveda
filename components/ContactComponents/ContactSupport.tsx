import Link from 'next/link';
import { Box, Container, Grid, Typography } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import { ContactSupportWrapper } from '@/styles/StyledComponents/ContactSupportWrapper';

export default function ContactSupport() {
  
  return (
    <ContactSupportWrapper>
      <Container fixed>
        <Box className="support_header">
          <Box>
            <Typography variant="h6" className="section_tag">
              Knowledge Base
            </Typography>
            <Typography variant="h2" className="section_title_large" sx={{ mb: 0 }}>
              Support Center
            </Typography>
          </Box>
          <Link href="/help-support" className="browse_link">
            Browse All Topics
          </Link>
        </Box>

        <Grid container spacing={4}>
          {/* Logistics Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box className="support_card">
              <Box className="card_icon">
                <LocalShippingOutlinedIcon />
              </Box>
              <Typography variant="h3">Logistics</Typography>
              <Typography variant="body1">
                Global carbon-neutral shipping routes and delivery timelines.
              </Typography>
            </Box>
          </Grid>

          {/* Authenticity Card (Highlighted) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box className="support_card highlighted">
              <Box className="card_icon">
                <ShieldOutlinedIcon />
              </Box>
              <Typography variant="h3">Authenticity</Typography>
              <Typography variant="body1">
                Trace your harvest back to its original organic soil.
              </Typography>
            </Box>
          </Grid>

          {/* Returns Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box className="support_card">
              <Box className="card_icon">
                <LoopOutlinedIcon />
              </Box>
              <Typography variant="h3">Returns</Typography>
              <Typography variant="body1">
                Our uncompromising policy on quality and artisanal satisfaction.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ContactSupportWrapper>
  );
}
