# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
### Компоненты модели данных (бизнес-логика)

/**
 * Базовая модель
 * */
 // Принимает данные для хранения, EventEmitter
class Model<T> {
  constructor(data: Partial<T>, protected events: IEvents) {}

  // Вызывает Event
  notifyObservers(event: string, info?: object) {}
}

/*
  * Класс, описывающий состояние приложения
  * */
class GlobalState extends Model<IGlobalState> {
  // Корзина
  Cart: IPill[] = [];

  // Массив со всеми товарами
  store: IPill[];

  // Заказ
   order: IOrder = {
    items?: [],
    typeOfPay?: '',
    address?: '';
    email?: '';
    phone?: '';
    totalSynapse?: '';
  }
  
**Методы:**
  - `addItemToCart(value: Pill): void`: Добавление товара в корзину.
  - `removeItemFromCart(id: string): void`: Удаление товара из корзины.
  - `clearCart(): void`: Полная очистка корзины.
  - `getCartItems(): number`:  Получение списка товаров в корзине.
  - `getTotalCartPrice(): number`: Метод получения суммы цены товаров в корзине.
}

#### Класс EventEmitter

Реализует паттерн "Наблюдатель" и позволяет подписываться на события и уведомлять о наступлении события.

**Методы:**
  - `on<T extends object>(eventName: EventName, callback: (event: T) => void) {}`: Подписка на событие.
    *Описание:* Позволяет подписаться на определенное событие и указать функцию-обработчик.
  - `off(eventName: EventName, callback: Subscriber) {}`: Отписка от события.
    *Описание:* Убирает колбэк с события.
  - `emit<T extends object>(eventName: string, data?: T) {}`: Уведомление подписчиков о наступлении события с передачей аргументов.
    *Описание:* Вызывает событие.

#### Класс Api
/*
  * Класс для работы с Api
  * */

  - `async get(uri: string`: Get запрос.
  - `async post(uri: string, data: object)`: Post запрос.
  - `protected async handleResponse(response: Response): Promise<Partial<object>>`: Обрабатывает запрос и возвращает промис с данными.

### Компоненты представления
***1. Класс Component ***
Базовый класс представления, от которого наследуются все другие классы представления.

class Component<T> {
  protected constructor(protected readonly container: HTMLElement);
}

Cart: Класс представления корзины.

class Cart extends Component<ICart> {

  // constructor принимает имя, родительский элемент и обработчик событий
  constructor(protected blockName: string, container: HTMLElement, protected events: IEvents);

  // set для цены
  set price(price: number);

  // set для списка товаров 
  set list(items: HTMLElement[]);

  // Метод отключающий кнопку "Оформить"
  disableButton(): void;
}

***2. Классы представления без наследников: ***
Page: Класс представления страницы приложения.

class Page extends Component<IPage> {

  // constructor принимает родительский элемент и обработчик событий
  constructor(container: HTMLElement, protected events: IEvents);

  // Сеттер для счётчика товаров в корзине
  set counter(value: number);

  // Сеттер для карточек товаров на странице
  set store(items: HTMLElement[]);
}

Card: Класс представления карточки товара.

class Card extends Component<ICard> {

  // constructor принимает имя, родительский контейнер
  // и объект с колбэк функциями
  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions);

  // set и get для названия
  set title(value: string);
  get title(): string;

   // set для цены
  set price(value: number | null);

  // set для категории
  set category(value: Category);

  // set для кратинки
  set image(value: string);

  // set выбора товара
  set selected(value: boolean);
}

Order: Класс представления информации о заказе.

class Order extends Form<IOrder> {

  // constructor принимает имя, родительский элемент и обработчик событий
  constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents);
}

Contacts: Класс представления контактной информации или страницы контактов.

class Contacts extends Form<IContacts> {
  // constructor принимает родительский элемент и обработчик событий
  constructor(container: HTMLFormElement, events: IEvents);
}

