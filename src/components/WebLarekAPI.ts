import { Api, ApiListResponse } from './base/api';

import { ICard } from '../components/Card';
import { ApiPostResponse } from '../types';
import { IOrder } from './Order';

export interface IWebLarekAPI {
  getCardList: () => Promise<ICard[]>;
  // getCard: (id: string) => Promise<ICard[]>;
  createOrder: (order: IOrder) => Promise<ApiPostResponse>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
  constructor(baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
  }

  getCardList(): Promise<ICard[]> {
    return this.get('/product').then(
      (data: ApiListResponse<ICard>) => data.items
    );
  }

  // getCard(id: string): Promise<ICard> {
  // 	return this.get(`/product/${id}`).then((item: ICard) => ({
  // 	}));
  // }

  createOrder(order: IOrder): Promise<ApiPostResponse> {
    return this.post('/order', order).then((data: ApiPostResponse) => data);
  }
}
