'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Container, Grid, Typography, Button, TextField, Stack, Breadcrumbs, CircularProgress, Card, Divider } from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { toast } from 'react-hot-toast';
import { assets } from '@/json/assest';

interface CollectionItem {
  image: string;
  label: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  _id?: string;
  price?: string;
  stock?: string;
  whatsInside?: string[];
}

interface GiftDetailsMainProps {
  slug: string;
}

export default function GiftDetailsMain({ slug }: GiftDetailsMainProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [giftCollections, setGiftCollections] = useState<CollectionItem[]>([]);
  const [selectedGift, setSelectedGift] = useState<CollectionItem | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    fetch('/api/gifts/gift-collections', { cache: 'no-store' })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data?.giftCollections?.collections) {
          const collections: CollectionItem[] = json.data.giftCollections.collections;
          setGiftCollections(collections);
          
          // Match by slug
          const match = collections.find(item => {
            const itemSlug = item.buttonLink?.split('/').pop() || 
                             item.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
            return itemSlug === slug;
          });
          
          if (match) {
            setSelectedGift(match);
          } else {
            // Fallback match by partial name
            const partialMatch = collections.find(item => 
              item.title.toLowerCase().includes(slug.replace(/-/g, ' '))
            );
            setSelectedGift(partialMatch || collections[0] || null);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load gift collections:', err);
        toast.error('Unable to load gift details.');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const isBlockedEmailDomain = (emailVal: string) => {
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
    const domain = emailVal.split("@")[1]?.toLowerCase().trim() || "";
    return blockedDomains.some((blocked) => domain === blocked || domain.endsWith("." + blocked));
  };

  const validateForm = () => {
    let valid = true;
    
    if (!fullName.trim()) {
      setFullNameError('Full name is required.');
      valid = false;
    } else if (fullName.trim().length < 2) {
      setFullNameError('Full name must be at least 2 characters.');
      valid = false;
    } else {
      setFullNameError('');
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email) {
      setEmailError('Email address is required.');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else if (isBlockedEmailDomain(email)) {
      setEmailError('Temporary or disposable emails (e.g. yopmail, mailer, mailinator) are not allowed.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!message.trim()) {
      setMessageError('Message is required.');
      valid = false;
    } else if (message.trim().length < 10) {
      setMessageError('Message must be at least 10 characters.');
      valid = false;
    } else {
      setMessageError('');
    }

    return valid;
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: email,
          enquiryType: 'Gift Quote',
          message: `Inquiry for Gift Set: "${selectedGift?.title}".\n\nUser Message:\n${message}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(
          "Thank you! Your corporate gifting request has been sent successfully. We will contact you shortly."
        );
        setFullName('');
        setEmail('');
        setMessage('');
        setFullNameError('');
        setEmailError('');
        setMessageError('');
      } else {
        toast.error(data.message || 'Failed to send inquiry. Please try again.');
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!selectedGift) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Gift Set Not Found</Typography>
        <Button variant="contained" component={Link} href="/gifts" startIcon={<ArrowBackOutlinedIcon />}>
          Back to Gifts
        </Button>
      </Container>
    );
  }

  // Generate fallback details based on which gift is selected
  const isFoundersReserve = selectedGift.title.toLowerCase().includes('founder');
  const isRoyalHarvest = selectedGift.title.toLowerCase().includes('royal');

  const giftPrice = selectedGift.price || (isFoundersReserve ? '₹145.00' : isRoyalHarvest ? '₹85.00' : '₹65.00');
  const componentsList = (selectedGift.whatsInside && selectedGift.whatsInside.length > 0)
    ? selectedGift.whatsInside
    : (isFoundersReserve 
      ? [
          'Handmade, engraved premium pinewood keepsake chest.',
          'Wildflower Honey (250g) harvested from clean organic meadows.',
          'Rich Single-Origin Artisanal Dark Chocolate (70% Cacao).',
          'Cold-Pressed Extra Virgin Olive Oil (250ml) pressed in autumn.',
          'Premium Medjool Dates & Dry Fruit selection.'
        ]
      : isRoyalHarvest
      ? [
          'Elegant gold-foiled textured sampling chest.',
          'Raw Wild Forest Honey jar (150g).',
          'Jumbo Medjool Dates premium grade.',
          'Dry Roasted Organic Almonds and Walnuts.'
        ]
      : [
          'Classic linen-bound slide-out botanical chest.',
          'Loose Leaf Organic Herbal Tea blend (Chamomilla & Rose).',
          'Handmade brass tea infuser spoon.',
          'Mini Lavender & Spiced Wildflower Honey jar.'
        ]);

  const relatedGifts = giftCollections.filter(item => item.title !== selectedGift.title).slice(0, 2);

  return (
    <Box sx={{ bgcolor: '#FAF9F6', minHeight: '100vh', pb: 10 }}>
      {/* Top Banner / Hero Image Area */}
      <Box sx={{ position: 'relative', height: { xs: '35vh', md: '50vh' }, width: '100%', overflow: 'hidden' }}>
        <Image
          src={selectedGift.image || assets.customChestBg}
          alt={selectedGift.title}
          fill
          priority
          style={{ objectFit: 'cover', filter: 'brightness(0.85)' }}
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' 
          }} 
        />
        <Container sx={{ position: 'absolute', bottom: 40, left: 0, right: 0 }}>
          <Breadcrumbs sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <Link href="/gifts" style={{ color: 'inherit', textDecoration: 'none' }}>Gifts</Link>
            <Typography sx={{ color: '#fff', fontWeight: 600 }}>{selectedGift.title}</Typography>
          </Breadcrumbs>
          <Typography 
            variant="h1" 
            sx={{ 
              color: '#fff', 
              fontSize: { xs: '2.5rem', md: '4rem' }, 
              fontWeight: 800,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontFamily: 'Playfair Display, serif'
            }}
          >
            {selectedGift.title}
          </Typography>
        </Container>
      </Box>

      <Container sx={{ mt: -6, position: 'relative', zIndex: 10 }}>
        <Grid container spacing={4}>
          {/* Left Column - Product Showcase Details */}
          <Grid size={{ xs: 12, md: 7.5 }}>
            {/* Glassmorphism details card */}
            <Card 
              sx={{ 
                p: { xs: 3, md: 5 }, 
                borderRadius: 4, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                backdropFilter: 'blur(10px)',
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                mb: 4
              }}
            >
              <Stack spacing={3}>
                {selectedGift.label && (
                  <Box 
                    sx={{ 
                      alignSelf: 'flex-start',
                      px: 2, 
                      py: 0.6, 
                      borderRadius: 10, 
                      bgcolor: '#EAE6DF',
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#4A3E3D' }}>
                      {selectedGift.label}
                    </Typography>
                  </Box>
                )}
                
                <Typography variant="body1" sx={{ fontSize: '1.15rem', color: '#5A4D4C', lineHeight: 1.7 }}>
                  {selectedGift.description}
                </Typography>

                <Divider />

                <Typography variant="h5" sx={{ fontWeight: 700, color: '#3A2E2D', fontFamily: 'Playfair Display, serif' }}>
                  What's Inside the Chest:
                </Typography>

                <Stack spacing={1.5}>
                  {componentsList.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#8A9A86', mt: 0.3 }} />
                      <Typography sx={{ color: '#5A4D4C', fontSize: '1.05rem' }}>{item}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Card>

            {/* Related Collections Section */}
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: '#3A2E2D', fontFamily: 'Playfair Display, serif' }}>
              Other Gift Collections
            </Typography>
            <Grid container spacing={3}>
              {relatedGifts.map((item, index) => {
                const itemSlug = item.buttonLink?.split('/').pop() || 
                                 item.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Card 
                      sx={{ 
                        borderRadius: 3, 
                        overflow: 'hidden', 
                        boxShadow: '0 10px 20px rgba(0,0,0,0.03)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.08)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', height: 180 }}>
                        <Image
                          src={item.image || assets.customChestBg}
                          alt={item.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ p: 3, bgcolor: '#fff' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Playfair Display, serif' }}>
                          {item.title}
                        </Typography>
                        <Button 
                          component={Link} 
                          href={`/gifts/${itemSlug}`} 
                          size="small" 
                          sx={{ textTransform: 'none', color: '#8A9A86', fontWeight: 600, p: 0 }}
                        >
                          Explore details →
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>

          {/* Right Column - Buy & Inquiry Side panel */}
          <Grid size={{ xs: 12, md: 4.5 }}>
            <Stack spacing={3}>
              {/* Purchase Card */}
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.04)', bgcolor: '#fff' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                  PRE-CURATED PRICE
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#3A2E2D', mt: 1, mb: selectedGift.stock ? 1 : 3 }}>
                  {giftPrice}
                </Typography>
                {selectedGift.stock && (
                  <Typography 
                    sx={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 600, 
                      color: selectedGift.stock.toLowerCase().includes('out') ? 'error.main' : 'success.main',
                      mb: 3
                    }}
                  >
                    ● {selectedGift.stock}
                  </Typography>
                )}

                <Stack spacing={2}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    component={Link}
                    href="/gifts"
                    size="large"
                    sx={{ py: 1.5, borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                  >
                    Back to Catalog
                  </Button>
                </Stack>
              </Card>

              {/* Inquiry Lead Form Card */}
              <Card sx={{ p: 4, borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.04)', bgcolor: '#3A2E2D', color: '#fff' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Playfair Display, serif' }}>
                  Corporate Gifting
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', mb: 3 }}>
                  Interested in personalizing this gift set for your business partners or guests? Submit an inquiry and our team will get in touch.
                </Typography>

                 <form onSubmit={handleInquirySubmit}>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Your Full Name"
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      error={!!fullNameError}
                      helperText={fullNameError}
                      required
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                        },
                        '& .MuiFormHelperText-root': {
                          color: '#ff8a80',
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Your Email Address"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      error={!!emailError}
                      helperText={emailError}
                      required
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                        },
                        '& .MuiFormHelperText-root': {
                          color: '#ff8a80',
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Message / Details (Required)"
                      multiline
                      minRows={3}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      error={!!messageError}
                      helperText={messageError}
                      required
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                        },
                        '& .MuiFormHelperText-root': {
                          color: '#ff8a80',
                        }
                      }}
                    />
                    <Button 
                      type="submit" 
                      fullWidth 
                      variant="contained" 
                      color="info"
                      size="large"
                      disabled={isSubmitting}
                      startIcon={<EmailOutlinedIcon />}
                      sx={{ 
                        py: 1.5, 
                        borderRadius: 3, 
                        textTransform: 'none', 
                        fontWeight: 700,
                        '&.Mui-disabled': {
                          bgcolor: 'rgba(255, 255, 255, 0.25) !important',
                          color: 'rgba(255, 255, 255, 0.6) !important'
                        }
                      }}
                    >
                      {isSubmitting ? 'Sending...' : 'Inquire'}
                    </Button>
                  </Stack>
                </form>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
