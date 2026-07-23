'use client';

import React from 'react';
import { Container, Box, CircularProgress } from '@mui/material';
import { toast } from 'react-hot-toast';

import { SavePageWrapper } from '@/styles/StyledComponents/SavePageWrapper';
import CuratedSelectionList, { SavedItem } from './CuratedSelectionList';
import RecommendationList from './RecommendationList';
import { useSavedProducts } from '@/hooks/useSavedProducts';
import { useCart } from '@/contexts/CartContext';

export default function SavePageUI() {
  const { savedProducts, isLoading, removeSave } = useSavedProducts();
  const { updateItem } = useCart();

  const handleRemoveItem = (id: string) => {
    removeSave(id);
  };

  const handleClearAll = () => {
    if (savedProducts.length === 0) return;
    savedProducts.forEach((item) => {
      removeSave(item.id);
    });
    toast.success('Cleared all items from your selection.');
  };

  const handleAddSingleToBasket = async (item: SavedItem) => {
    try {
      const defaultSize = item.rawProduct?.defaultSize || '500g';
      await updateItem(item.id, 1, defaultSize, item.price);
      toast.success(`Added ${item.name} to harvest basket!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add item to basket');
    }
  };

  const handleMoveAllToBasket = async () => {
    if (savedProducts.length === 0) return;
    try {
      for (const item of savedProducts) {
        const defaultSize = item.rawProduct?.defaultSize || '500g';
        await updateItem(item.id, 1, defaultSize, item.price);
      }
      toast.success('Moved all saved items to basket!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to move items to basket');
    }
  };

  return (
    <SavePageWrapper>
      <Container fixed>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress color="primary" size={40} />
          </Box>
        ) : (
          <CuratedSelectionList
            items={savedProducts}
            onRemoveItem={handleRemoveItem}
            onClearAll={handleClearAll}
            onMoveAllToBasket={handleMoveAllToBasket}
            onAddSingleToBasket={handleAddSingleToBasket}
          />
        )}
        <RecommendationList />
      </Container>
    </SavePageWrapper>
  );
}
