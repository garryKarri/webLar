export type CategoryTitle =
  | 'софт-скил'
  | 'хард-скил'
  | 'другое'
  | 'дополнительное'
  | 'кнопка';

// export type Category = {
//   title: CategoryTitle;
//   color: 'green' | 'orange' | 'blue' | 'yellow' | 'purple';
// };

export type categoryChoicing = {
  [Key in CategoryTitle]: string;
};

//описание самого товара, Card - оболочка

import { Pill } from '../components/AppData';
export interface IPill {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: CategoryTitle;
  image: string;
  // был данный товар добавлен в корзину или нет
  selected: boolean;
}

export type Cart = {
  store: Pill[];
};

//ICart - описывает всю кщрзину (список товаров + цена)

// Счётчик товаров в корзине
export type IPage = {
  counter: number;
};

export type IContacts = {
  email: string;
  phone: string;
};

type PaymentType = 'cash' | 'card';

interface IOrder {
  items: string[];
  payment: PaymentType;
  total: number | null;
  address: string;
  email: string;
  phone: string;
}

export type IOrderForm = {
  payment?: boolean;
  address?: string;
  email?: string;
  phone?: string;
};

// export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export type IGlobalState = {
  cart: Pill[];
  store: Pill[];
  order: IOrder;
};

export interface IAppState {
  cart: Pill[];
  store: Pill[];
  order: IOrder;
  total: number | null;
  // Ошибки при заполнении форм
  // formErrors: FormErrors;

  // Методы
  addItemToCart(value: Pill): void;
  removeItemFromCart(id: string): void;
  clearCart(): void;
  getCartItems(): number;
  getTotalCartPrice(): number;
}

export type ApiAnswer = {
  items: IPill[];
};
export type ApiPostResponse = {
  id: string;
  total: number;
};
