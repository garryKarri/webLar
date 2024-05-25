import { Model } from './base/Model';
import { IAppState, IPill } from '../types';
import { IOrder } from './Order';

export class Pill extends Model<IPill> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

export class AppState extends Model<IAppState> {
  static getTotalCartPrice(value: number) {}
  // Корзина с товарами
  cart: IPill[] = [];

  // Массив со всеми товарами
  store: IPill[];

  //заказ
  order: IOrder = {
    items: [],
    payment: '',
    total: null,
    address: '',
    email: '',
    phone: '',
    // step: 1,
  };

  addItemToCart(value: IPill) {
    this.cart.push(value);
  }

  removeItemFromCart(id: string) {
    this.cart = this.cart.filter((item) => item.id !== id);
  }

  clearCart() {
    this.cart.length = 0;
  }
  clearOder() {
    this.order = {
      address: '',
      email: '',
      items: [],
      phone: '',
      // step: 1,
      payment: '',
      total: null,
    };
  }

  getCartItems() {
    return this.cart.length;
  }

  getTotalCartPrice() {
    return this.cart.reduce((sum, next) => sum + next.price, 0);
  }

  getCartAmount() {
    return this.cart.length;
  }
  setItems() {
    this.order.items = this.cart.map((item) => item.id);
  }

  setAllItemsButtonEvalableForOder() {
    // this.store = this.store.map((item) => ({
    //   ...item,
    //   selected: false,
    // }));
    for(const item of this.store) {
      item.selected = false;
    }
  }

  setStore(items: IPill[]) {
    // Проверка, что все объекты в массиве items соответствуют интерфейсу IPill
    this.store = items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      selected: false,
    }));
    this.emitChanges('items:changed', { store: this.store });
  }
}
