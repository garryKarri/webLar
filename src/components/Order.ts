import { IEvents } from './base/events';
import { Form } from './common/Form';

/*
 * Интерфейс, описывающий окошко заказа товара
 * */
export interface IOrder {
  address: string;
  // Способ оплаты
  typeOfPay: string;
  items: [];
  total: null | number;
  email: string;
  phone: string;
}

/*
 * Класс, описывающий окошко заказа товара
 * */
export class Order extends Form<IOrder> {
  // Сссылки на внутренние элементы
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский элемент и обработчик событий
  constructor(
    protected blockName: string,
    container: HTMLFormElement,
    protected events: IEvents
  ) {
    super(container, events);

    this._card = container.elements.namedItem('card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

    if (this._cash) {
      this._cash.addEventListener('click', () => {
        this._cash.classList.add('button_secondary');
        this._card.classList.remove('button_secondary');
        this.onInputChange('typeOfPay', 'cash');
      });
    }
    if (this._card) {
      this._card.addEventListener('click', () => {
        this._card.classList.add('button_secondary');
        this._cash.classList.remove('button_secondary');
        this.onInputChange('typeOfPay', 'card');
      });
    }
  }

  // Метод, отключающий подсвечивание кнопок
  disableButtons() {
    this._cash.classList.remove('button_secondary');
    this._card.classList.remove('button_secondary');
  }
}

/*
 * Интерфейс, описывающий окошко контакты
 * */
export interface IContacts {
  phone: string;
  email: string;
}

/*
 * Класс, описывающий окошко контакты
 * */
export class Contacts extends Form<IContacts> {
  // Конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }
}
