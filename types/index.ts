/**
 * Core type definitions for the Real Estate Image Editor
 */

export interface Brokerage {
  id: string;
  name: string;
  logo?: string;
  domain?: string;
  primaryColor?: string;
  creditsBalance: number;
  createdAt: Date;
}

export interface Agent {
  id: string;
  brokerageId: string;
  email: string;
  name: string;
  role: 'admin' | 'agent';
  avatar?: string;
  createdAt: Date;
}

export interface Listing {
  id: string;
  brokerageId: string;
  agentId: string;
  address: string;
  mlsNumber?: string;
  status: 'active' | 'pending' | 'sold' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id: string;
  listingId: string;
  originalUrl: string;
  currentUrl: string;
  width: number;
  height: number;
  format: string;
  createdAt: Date;
}

export type EditType = 
  | 'floor_change'
  | 'wall_change'
  | 'furniture_staging'
  | 'object_removal'
  | 'exterior_edit'
  | 'enhancement'
  | 'masking';

export interface Edit {
  id: string;
  imageId: string;
  agentId?: string;
  buyerSession?: string;
  editType: EditType;
  parameters: Record<string, any>;
  maskData?: string;
  resultUrl: string;
  creditsUsed: number;
  createdAt: Date;
}

export interface ShareLink {
  id: string;
  listingId: string;
  agentId: string;
  token: string;
  expiresAt: Date;
  isActive: boolean;
  accessCount: number;
  createdAt: Date;
}

export interface CreditTransaction {
  id: string;
  brokerageId: string;
  imageId?: string;
  editId?: string;
  amount: number;
  type: 'deduction' | 'purchase' | 'refund';
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestedActions?: string[];
}

export interface CanvasState {
  currentImageId: string;
  layers: Layer[];
  history: HistoryItem[];
  historyIndex: number;
  zoom: number;
  pan: { x: number; y: number };
}

export interface Layer {
  id: string;
  type: 'image' | 'mask' | 'overlay';
  url: string;
  opacity: number;
  visible: boolean;
  zIndex: number;
}

export interface HistoryItem {
  id: string;
  action: string;
  editType: EditType;
  timestamp: Date;
  canvasState: CanvasState;
}
