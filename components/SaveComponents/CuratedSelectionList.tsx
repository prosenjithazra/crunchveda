import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Button, Grid, Typography } from '@mui/material';
import CloseIcon from '@/ui/Icons/CloseIcon';

export interface SavedItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Props {
  items: SavedItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onMoveAllToBasket: () => void;
  onAddSingleToBasket: (item: SavedItem) => void;
}

export default function CuratedSelectionList({
  items,
  onRemoveItem,
  onClearAll,
  onMoveAllToBasket,
  onAddSingleToBasket
}: Props) {
  return (
    <Box className="saved_grid">
      {/* Header section */}
      <Box className="header_section">
        <Box className="header_text">
          <Typography variant="h1">
            Your Curated Selection
          </Typography>
          <Typography variant="body1">
            A refined collection of your personal favorites from our heritage estate, ready for your next harvest.
          </Typography>
        </Box>
        
        {items.length > 0 && (
          <Box className="header_actions">
            <button className="clear_btn" onClick={onClearAll}>
              Clear All
            </button>
            <Button
              variant="contained"
              color="primary"
              disableRipple
              onClick={onMoveAllToBasket}
            >
              Move All to Basket
            </Button>
          </Box>
        )}
      </Box>

      {/* Grid List */}
      {items.length > 0 ? (
        <Grid container spacing={{ lg: 3, md: 2, xs: 1.5 }}>
          {items.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <Box className="saved_card">
                <Box className="image_container">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={360}
                    sizes="(max-width: 900px) 100vw, 30vw"
                  />
                  <button
                    className="remove_btn"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Remove item"
                  >
                    <CloseIcon />
                  </button>
                </Box>
                <Typography variant="body2" className="card_category">
                  {item.category}
                </Typography>
                <Typography variant="h3" className="card_title">
                  {item.name}
                </Typography>
                <Typography variant="body2" className="card_desc">
                  {item.description}
                </Typography>
                <Typography variant="h4" className="card_price">
                  ${item.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="info"
                  disableRipple
                  onClick={() => onAddSingleToBasket(item)}
                  fullWidth
                >
                  Add to Harvest
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box className="empty_state">
          <Typography variant="h3">Your selection is empty</Typography>
          <Typography variant="body1">
            Explore our collections and save your favorite organic selections.
          </Typography>
          <Link href="/product" className="explore_btn">
            Explore Collections
          </Link>
        </Box>
      )}
    </Box>
  );
}
