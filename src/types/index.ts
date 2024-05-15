export type CategoryTitle = 
  
  'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка';

export type Category = {
  title: CategoryTitle;
  color: 'green' | 'orange' | 'blue' | 'yellow' | 'purple';
};

//описание самого товара, Card - оболочка 
// export type Pill = {
  
//   title: string;
//   description: string;
//   synapse: number | null;
//   category: Category;
//   image: string;
// };

import { Pill } from "../components/AppData";
export interface IPill {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: Category;
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
}

export type IContacts = {
  email: string;
  phone: string;
}

type PaymentType = 'cash' | 'card';

interface IOrder {
  items?: string[];
  typeOfPay: PaymentType;
  total: number | null;
  address: string;
  email: string;
  phone: string;
}


export type IOrderForm = {
  typeOfPay?: boolean;
  address?: string;
  email?: string;
  phone?: string;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export type IGlobalState = {
   cart: Pill[];
   store: Pill[];
   order: IOrder;
}

export interface IAppState {
  cart: Pill[];
  store: Pill[];
  order: IOrder;
  // Ошибки при заполнении форм
  formErrors: FormErrors;
  // Методы

  addItemToCart(value: Pill): void;
  removeItemFromCart(id: string): void;
  clearCart(): void;
  getCartItems(): number;
  getTotalCartPrice(): number;
  // setStore(items: IPill[]): void;
  
  // Валидация заказа
  validateOrder(): boolean;
   // Валидация контактной информации
   validateForContacts(): boolean;
}


export type ApiAnswer = {
  items:IPill[]
}
