import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { estimateTotal } from '@/src/api/client';

type GroceryItem = {
  id: string;
  name: string;
};

const STORES = ['Walmart', 'Target', 'Costco', 'Aldi'];
const ITEMS: GroceryItem[] = [
  { id: 'milk', name: 'Milk' },
  { id: 'bread', name: 'Bread' },
  { id: 'eggs', name: 'Eggs' },
  { id: 'apples', name: 'Apples' },
];

export default function GroceryPlannerScreen() {
  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [subtotal, setSubtotal] = useState<number | null>(null);
  const [estimatedTotal, setEstimatedTotal] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedItems = useMemo(
    () => ITEMS.filter((item) => quantities[item.id] > 0).map((item) => ({ id: item.id, quantity: quantities[item.id] })),
    [quantities],
  );

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities((current) => ({
      ...current,
      [itemId]: Math.max(0, (current[itemId] ?? 0) + delta),
    }));
  };

  const handleEstimate = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSubtotal(null);
    setEstimatedTotal(null);

    try {
      const response = await estimateTotal({
        store: selectedStore,
        items: selectedItems,
      });

      setSubtotal(response.subtotal);
      setEstimatedTotal(response.estimatedTotal);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to estimate total right now.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Grocery Planner</Text>
      <Text style={styles.subHeading}>Choose store</Text>
      <View style={styles.storeRow}>
        {STORES.map((store) => (
          <Pressable
            key={store}
            style={[styles.storeChip, selectedStore === store && styles.storeChipActive]}
            onPress={() => setSelectedStore(store)}>
            <Text style={[styles.storeChipText, selectedStore === store && styles.storeChipTextActive]}>{store}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.subHeading}>Items</Text>
      {ITEMS.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <Text style={styles.itemLabel}>{item.name}</Text>
          <View style={styles.quantityControls}>
            <Pressable style={styles.quantityButton} onPress={() => updateQuantity(item.id, -1)}>
              <Text style={styles.quantityButtonText}>-</Text>
            </Pressable>
            <TextInput
              editable={false}
              style={styles.quantityInput}
              value={String(quantities[item.id])}
              accessibilityLabel={`${item.name} quantity`}
            />
            <Pressable style={styles.quantityButton} onPress={() => updateQuantity(item.id, 1)}>
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Pressable style={styles.estimateButton} onPress={handleEstimate} disabled={isLoading || selectedItems.length === 0}>
        <Text style={styles.estimateText}>Estimate Total</Text>
      </Pressable>

      {isLoading ? <ActivityIndicator style={styles.feedbackSpacing} /> : null}
      {errorMessage ? <Text style={[styles.feedbackText, styles.errorText]}>{errorMessage}</Text> : null}
      {subtotal !== null ? <Text style={styles.feedbackText}>Subtotal: ${subtotal.toFixed(2)}</Text> : null}
      {estimatedTotal !== null ? <Text style={styles.feedbackText}>Estimated Total: ${estimatedTotal.toFixed(2)}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
  },
  storeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  storeChip: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  storeChipActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  storeChipText: {
    color: '#1F2937',
  },
  storeChipTextActive: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  itemLabel: {
    fontSize: 16,
    color: '#111827',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  quantityInput: {
    minWidth: 40,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: '#111827',
  },
  estimateButton: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    paddingVertical: 12,
  },
  estimateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackSpacing: {
    marginTop: 8,
  },
  feedbackText: {
    fontSize: 16,
    color: '#111827',
  },
  errorText: {
    color: '#B91C1C',
  },
});
