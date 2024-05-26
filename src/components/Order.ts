import { IEvents } from './base/events';
import { Form } from './common/Form';

/*
 * Интерфейс, описывающий окошко заказа товара
 * */
export interface IOrder {
  address?: string;
  payment?: string;
  items?: string[];
  total?: null | number;
  email?: string;
  phone?: string;
}

/*
 * Класс, описывающий окошко заказа товара
 * */
export class Order extends Form<IOrder> {
  // Сссылки на внутренние элементы
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;
  protected _address: HTMLInputElement;
  protected _button: HTMLButtonElement;
  protected order: IOrder;

  // Конструктор принимает имя блока, родительский элемент и обработчик событий
  constructor(
    protected blockName: string,
    container: HTMLFormElement,
    protected events: IEvents
  ) {
    super(container, events);
    this.order = {};
    this._card = container.elements.namedItem('card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
    this._button = container.querySelector(
      '.order__button'
    ) as HTMLButtonElement; //далее
    this._address = container.elements.namedItem('address') as HTMLInputElement;

    if (this._cash) {
      this._cash.addEventListener('click', () => {
        this._cash.classList.add('button_alt-active');
        this._card.classList.remove('button_alt-active');
        this.onInputChange('payment', 'cash');
        this.order.payment = 'cash';
        this.checkButtonState();
      });
    }
    if (this._card) {
      this._card.addEventListener('click', () => {
        this._card.classList.add('button_alt-active');
        this._cash.classList.remove('button_alt-active');
        this.onInputChange('payment', 'card');
        this.order.payment = 'card';
        this.checkButtonState();
      });
    }

    this._address.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.onInputChange('address', target.value);
      this.order.address = this._address.value;
      this.checkButtonState();
    });

    if (this._button) {
      this._button.addEventListener('click', () =>
        this.events.emit('order:submit', this.order)
      );
    }
  }
  checkButtonState() {
    console.log('checkButtonState', this.order);
    const isFormValid = !!this.order.payment && !!this.order.address;

    if (isFormValid) {
      this._button.removeAttribute('disabled');
    } else {
      this._button.setAttribute('disabled', 'disabled');
    }
  }

  clearInputs() {
    // Очистка поля адреса
    this._address.value = '';
    // Снятие активного состояния с кнопок выбора способа оплаты
    this._card.classList.remove('button_alt-active');
    this._cash.classList.remove('button_alt-active');

    // Деактивация кнопки отправки
    this._button.setAttribute('disabled', 'disabled');
    this.order = {};
  }
}

/*
 * Интерфейс, описывающий окошко контакты
 * */
export interface IContacts {
  phone?: string;
  email?: string;
}

/*
 * Класс, описывающий окошко контакты
 * */
export class Contacts extends Form<IContacts> {
  protected _phone: HTMLInputElement;
  protected _email: HTMLInputElement;

  protected order: IOrder;

  // Конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.order = {};
    this._phone = container.elements.namedItem('phone') as HTMLInputElement;
    this._email = container.elements.namedItem('email') as HTMLInputElement;
    this._submit = container.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    this._phone.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      // this.order.phone = 'phone';
      this.order.phone = target.value;

      this.onInputChange('phone', target.value);

      this.checkButton();
    });

    this._email.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;

      // this.order.email = 'email';
      this.order.email = target.value;
      this.onInputChange('email', target.value);

      this.checkButton();
    });
    this._submit.addEventListener('click', () => {
      events.emit('order:success', this.order);
    });

    this.checkButton();
  }
  checkButton() {
    const isFormContactValid = !!this.order.email && !!this.order.phone;
    if (isFormContactValid) {
      this._submit.removeAttribute('disabled');
    } else {
      this._submit.setAttribute('disabled', 'disabled');
    }
  }
  clearInputs() {
    // Очистка поля номера телефона
    this._phone.value = '';
    // очистка поля почты
    this._email.value = '';
    // Снятие активного состояния с кнопки отправки
    this._submit.setAttribute('disabled', 'disabled');

    this.order = {};
  }
}
