'use client';

import React, { useState } from 'react';
import { Container } from '@mui/material';
import { toast } from 'react-hot-toast';

import { assets } from '@/json/assest';
import { SavePageWrapper } from '@/styles/StyledComponents/SavePageWrapper';
import CuratedSelectionList, { SavedItem } from './CuratedSelectionList';
import RecommendationList from './RecommendationList';

const mockSavedItems: SavedItem[] = [
  {
    id: 'dates-1',
    category: 'DESERT HARVEST',
    name: 'Premium Medjool Dates',
    description: 'Hand-selected for honey-like sweetness.',
    price: 32.00,
    image: assets.dates
  },
  {
    id: 'dates-2',
    category: 'DESERT HARVEST',
    name: 'Premium Medjool Dates',
    description: 'Hand-selected for honey-like sweetness.',
    price: 32.00,
    image: assets.dates
  },
  {
    id: 'dates-3',
    category: 'DESERT HARVEST',
    name: 'Premium Medjool Dates',
    description: 'Hand-selected for honey-like sweetness.',
    price: 32.00,
    image: assets.dates
  }
];

export default function SavePageUI() {
  const [items, setItems] = useState<SavedItem[]>(mockSavedItems);

  const handleRemoveItem = (id: string) => {
    const itemToRemove = items.find((item) => item.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (itemToRemove) {
      toast.success(`Removed ${itemToRemove.name} from your selection.`);
    }
  };

  const handleClearAll = () => {
    setItems([]);
    toast.success('Cleared all items from your selection.');
  };

  const handleMoveAllToBasket = () => {
    toast.success('Moved all saved items to basket!');
    setItems([]);
  };

  const handleAddSingleToBasket = (item: SavedItem) => {
    toast.success(`Added ${item.name} to harvest basket!`);
  };

  return (
    <SavePageWrapper>
      <Container fixed>
        <CuratedSelectionList
          items={items}
          onRemoveItem={handleRemoveItem}
          onClearAll={handleClearAll}
          onMoveAllToBasket={handleMoveAllToBasket}
          onAddSingleToBasket={handleAddSingleToBasket}
        />
        <RecommendationList />
      </Container>
    </SavePageWrapper>
  );
}
