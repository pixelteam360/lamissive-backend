export type TPurchasedSubscription = {
  id: string;
  paymentId: string;
  amount: number;
  activeSubscription: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  subscriptionId: string;
};
