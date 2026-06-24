import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
const API_BASE_URL = extra?.apiBaseUrl ?? 'http://localhost:3000';

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type EstimatePayload = {
  store: string;
  items: Array<{ id: string; quantity: number }>;
};

export type EstimateResponse = {
  subtotal: number;
  estimatedTotal: number;
};

export async function estimateTotal(payload: EstimatePayload): Promise<EstimateResponse> {
  const response = await fetch(`${API_BASE_URL}/api/planner/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseJson<EstimateResponse>(response);
}

export type ScanReceiptResponse = {
  receiptId: string;
  status: string;
};

type ReceiptUploadFile = {
  uri: string;
  name: string;
  type: string;
};

export async function scanReceipt(imageUri: string): Promise<ScanReceiptResponse> {
  if (!imageUri) {
    throw new Error('A receipt image is required.');
  }

  const formData = new FormData();
  const receiptUpload: ReceiptUploadFile = {
    uri: imageUri,
    name: 'receipt.jpg',
    type: 'image/jpeg',
  };

  formData.append('receipt', receiptUpload as never);

  const response = await fetch(`${API_BASE_URL}/api/receipts/scan`, {
    method: 'POST',
    body: formData,
  });

  return parseJson<ScanReceiptResponse>(response);
}
