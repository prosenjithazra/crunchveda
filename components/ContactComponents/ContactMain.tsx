'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button
} from '@mui/material';
import { ContactMainWrapper } from '@/styles/StyledComponents/ContactMainWrapper';
import WhatsAppIcon from '@/ui/Icons/WhatsAppIcon';

export default function ContactMain() {
  const [enquiryType, setEnquiryType] = useState('General Concierge');

  const handleEnquiryChange = (event: SelectChangeEvent) => {
    setEnquiryType(event.target.value as string);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your enquiry. Our concierge team will get back to you shortly.');
  };

  return (
    <ContactMainWrapper>
      <Container fixed>
        <Grid container spacing={{ xs: 4, md: 6, lg: 8 }}>
          {/* Left Column: Info & Live Chat */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box className="presence_box">
              <Typography variant="h2" className="section_title_large">
                Global Presence
              </Typography>
              
              <Typography variant="h6" className="section_tag">
                Flagship Store
              </Typography>
              <Typography variant="h3" className="flagship_title">
                {`42 Savile Row,\nMayfair, London\nW1S 3QR, UK`}
              </Typography>
              
              <Link href="https://maps.google.com" target="_blank" className="map_link">
                View on map ↗
              </Link>

              <Grid container spacing={2} className="details_grid">
                <Grid size={{ xs: 6 }}>
                  <Typography className="details_title">Enquiries</Typography>
                  <Box className="details_content">
                    <Link href="mailto:concierge@nutriharvest.com">
                      concierge@nutriharvest.com
                    </Link>
                    <Link href="tel:+442079460123">
                      +44 (0) 20 7946 0123
                    </Link>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography className="details_title">Social</Typography>
                  <Box className="social_links">
                    <Link href="https://instagram.com" target="_blank">
                      INSTAGRAM
                    </Link>
                    <Link href="https://linkedin.com" target="_blank">
                      LINKEDIN
                    </Link>
                  </Box>
                </Grid>
              </Grid>

              <Link href="https://wa.me/+442079460123" target="_blank" className="live_concierge_card">
                <Box className="card_info">
                  <Typography variant="h4">Live Concierge</Typography>
                  <Typography variant="body2">Real-time assistance via WhatsApp</Typography>
                </Box>
                <Box className="whatsapp_badge">
                  <WhatsAppIcon />
                </Box>
              </Link>
            </Box>
          </Grid>

          {/* Right Column: Message Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box className="form_card">
              <Typography variant="h2" className="form_title">
                Send a Message
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }} className="form_group">
                    <Typography component="label" htmlFor="full-name" className="form_label">
                      Full Name
                    </Typography>
                    <TextField
                      id="full-name"
                      className="form_input"
                      placeholder="E.g. Julian Thorne"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }} className="form_group">
                    <Typography component="label" htmlFor="email" className="form_label">
                      Email Address
                    </Typography>
                    <TextField
                      id="email"
                      type="email"
                      className="form_input"
                      placeholder="julian@example.com"
                      variant="outlined"
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>

                <Box className="form_group">
                  <Typography component="label" htmlFor="enquiry-type" className="form_label">
                    Nature of Enquiry
                  </Typography>
                  <Select
                    id="enquiry-type"
                    value={enquiryType}
                    onChange={handleEnquiryChange}
                    className="form_select"
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value="General Concierge">General Concierge</MenuItem>
                    <MenuItem value="Product Inquiry">Product Inquiry</MenuItem>
                    <MenuItem value="Bulk & Custom Gifting">Bulk & Custom Gifting</MenuItem>
                    <MenuItem value="Feedback">Feedback</MenuItem>
                  </Select>
                </Box>

                <Box className="form_group">
                  <Typography component="label" htmlFor="message" className="form_label">
                    Your Message
                  </Typography>
                  <TextField
                    id="message"
                    className="form_textarea"
                    placeholder="How can we help cultivate your experience?"
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    required
                  />
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  disableRipple
                  type="submit"
                  fullWidth
                >
                  Submit Request
                </Button>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ContactMainWrapper>
  );
}
