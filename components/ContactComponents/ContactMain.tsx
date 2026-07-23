'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ContactMainWrapper } from '@/styles/StyledComponents/ContactMainWrapper';
import WhatsAppIcon from '@/ui/Icons/WhatsAppIcon';
import { useContactStore } from './useContactStore';
import { useStoreConfigStore } from '@/store/useStoreConfigStore';

interface ContactFormValues {
  fullName: string;
  email: string;
  enquiryType: string;
  message: string;
}

const isBlockedEmailDomain = (email: string) => {
  const blockedDomains = [
    "yopmail.com",
    "yopmail.net",
    "yopmail.fr",
    "mailinator.com",
    "mailer.com",
    "tempmail.com",
    "tempmail.net",
    "dispostable.com",
    "guerrillamail.com",
    "sharklasers.com",
    "10minutemail.com",
  ];
  const domain = email.split("@")[1]?.toLowerCase().trim() || "";
  return blockedDomains.some((blocked) => domain === blocked || domain.endsWith("." + blocked));
};

export default function ContactMain() {
  const {
    isSubmitting,
    isSuccess,
    errorMessage,
    setSubmitting,
    setSuccess,
    setErrorMessage,
    reset
  } = useContactStore();

  const { config, fetchConfig } = useStoreConfigStore();
  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const {
    register,
    handleSubmit,
    control,
    reset: resetForm,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      enquiryType: "General Concierge",
      message: "",
    },
  });

  // Reset store on mount
  useEffect(() => {
    reset();
  }, [reset]);

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitting(true);
    setErrorMessage(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.fullName,
          email: values.email,
          enquiryType: values.enquiryType,
          message: values.message,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(
          "Thank you! Your message has been sent successfully. We've also sent a confirmation email to your inbox. Our team will contact you within 24–48 business hours."
        );
        setSuccess(true);
        resetForm();
      } else {
        const err = data.message || 'Failed to send enquiry. Please try again.';
        toast.error(err);
        setErrorMessage(err);
      }
    } catch (err) {
      const errMsg = 'An unexpected error occurred. Please try again.';
      toast.error(errMsg);
      setErrorMessage(errMsg);
    } finally {
      setSubmitting(false);
    }
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
                {config.address || `42 Savile Row,\nMayfair, London\nW1S 3QR, UK`}
              </Typography>
              
              <Link href="https://maps.google.com" target="_blank" className="map_link">
                View on map ↗
              </Link>

              <Grid container spacing={2} className="details_grid">
                <Grid size={{ xs: 6 }}>
                  <Typography className="details_title">Enquiries</Typography>
                  <Box className="details_content">
                    <Link href={`mailto:${config.supportEmail || 'info@crunchvedastore.com'}`}>
                      {config.supportEmail || 'info@crunchvedastore.com'}
                    </Link>
                    {config.phoneNumber && (
                      <Link href={`tel:${config.phoneNumber}`}>
                        {config.phoneNumber}
                      </Link>
                    )}
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography className="details_title">Social</Typography>
                  <Box className="social_links">
                    {config.instagramLink && (
                      <Link href={config.instagramLink} target="_blank" rel="noopener noreferrer">
                        INSTAGRAM
                      </Link>
                    )}
                    {config.facebookLink && (
                      <Link href={config.facebookLink} target="_blank" rel="noopener noreferrer">
                        FACEBOOK
                      </Link>
                    )}
                    {config.twitterLink && (
                      <Link href={config.twitterLink} target="_blank" rel="noopener noreferrer">
                        TWITTER / X
                      </Link>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Link
                href={config.whatsappNo ? `https://wa.me/${config.whatsappNo.replace(/\D/g, '')}` : 'https://wa.me/'}
                target="_blank"
                rel="noopener noreferrer"
                className="live_concierge_card"
              >
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
              {isSuccess ? (
                <Box sx={{ py: 6, px: 2, textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      bgcolor: "rgba(143, 94, 21, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      color: "#8F5E15",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </Box>
                  <Typography variant="h3" sx={{ color: "#0B2013", fontFamily: "Georgia, serif", fontWeight: 700, mb: 2 }}>
                    Inquiry Received
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#4A5568", lineHeight: 1.7, mb: 4 }}>
                    Thank you! Your message has been sent successfully. We've also sent a confirmation email to your inbox. Our team will contact you within 24–48 business hours.
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      reset();
                    }}
                    sx={{ textTransform: "none", borderRadius: "8px" }}
                  >
                    Send Another Message
                  </Button>
                </Box>
              ) : (
                <>
                  <Typography variant="h2" className="form_title">
                    Send a Message
                  </Typography>
                  
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={{md:2, xs:0}}>
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
                          error={!!errors.fullName}
                          helperText={errors.fullName?.message}
                          {...register("fullName", {
                            required: "Full name is required",
                            minLength: { value: 2, message: "Name must be at least 2 characters" },
                          })}
                        />
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 6 }} className="form_group">
                        <Typography component="label" htmlFor="email" className="form_label">
                          Email Address
                        </Typography>
                        <TextField
                          id="email"
                          type="text"
                          className="form_input"
                          placeholder="julian@example.com"
                          variant="outlined"
                          fullWidth
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          {...register("email", {
                            required: "Email address is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                            validate: {
                              noTempMail: (val) =>
                                !isBlockedEmailDomain(val) ||
                                "Temporary or disposable emails (e.g. yopmail, mailer, mailinator) are not allowed.",
                            },
                          })}
                        />
                      </Grid>
                    </Grid>

                    <Box className="form_group">
                      <Typography component="label" htmlFor="enquiry-type" className="form_label">
                        Nature of Enquiry
                      </Typography>
                      <Controller
                        name="enquiryType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            id="enquiry-type"
                            className="form_select"
                            variant="outlined"
                            fullWidth
                          >
                            <MenuItem value="General Concierge">General Concierge</MenuItem>
                            <MenuItem value="Product Inquiry">Product Inquiry</MenuItem>
                            <MenuItem value="Bulk & Custom Gifting">Bulk & Custom Gifting</MenuItem>
                            <MenuItem value="Feedback">Feedback</MenuItem>
                          </Select>
                        )}
                      />
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
                        error={!!errors.message}
                        helperText={errors.message?.message}
                        {...register("message", {
                          required: "Message is required",
                          minLength: { value: 10, message: "Message must be at least 10 characters" },
                        })}
                      />
                    </Box>

                    {errorMessage && (
                      <Typography color="error" sx={{ mb: 2, fontSize: "14px", fontWeight: 600 }}>
                        {errorMessage}
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      color="primary"
                      disableRipple
                      type="submit"
                      disabled={isSubmitting}
                      fullWidth
                    >
                      {isSubmitting ? 'Sending...' : 'Submit Request'}
                    </Button>
                  </form>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ContactMainWrapper>
  );
}
