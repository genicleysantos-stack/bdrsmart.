
export enum OrderStatus {
  PENDING = 'Aguardando',
  ACCEPTED = 'Aceito',
  PICKED_UP = 'Coletado',
  IN_TRANSIT = 'Em Trânsito',
  DELIVERED = 'Entregue',
  CANCELLED = 'Cancelado'
}

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  origin: string;
  destination: string;
  deviceBrand: string;
  deviceModel: string;
  serviceDescription: string;
  status: OrderStatus;
  createdAt: Date;
  estimatedCost: number;
  driverName?: string;
};

export type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
};
