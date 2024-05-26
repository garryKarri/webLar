import './scss/styles.scss';

import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Cart, StoreItemCart } from './components/common/Cart';
import { IPill } from './types';
import { Order, Contacts, IOrder } from './components/Order';
import { Success } from './components/common/Success';
import { StoreItemPreview, StoreItem } from './components/Card';
import { WebLarekAPI } from './components/WebLarekAPI';

const events = new EventEmitter();
const api = new WebLarekAPI(API_URL);

// Все шаблоны
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const cart = new Cart('basket', cloneTemplate(basketTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
  onClick: () => {
    events.emit('modal:close');
    modal.close();
  },
});
const order = new Order('order', cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

// Получение картинок с сервера
api
  .getCardList()
  .then((data) => {
    appData.setStore(data);
  })
  .catch((err) => {
    console.error(err);
  });

// Изменились элементы каталога
events.on('items:changed', () => {
  page.store = appData.store.map((item) => {
    const pill = new StoreItem(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item),
    });
    return pill.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});

// Открытие карточки
events.on('card:select', (item: IPill) => {
  page.locked = true;
  const pill = new StoreItemPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit('card:toBasket', item);
    },
  });
  modal.render({
    content: pill.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      description: item.description,
      price: item.price,
      selected: item.selected,
    }),
  });
});

// // Добавление товара в корзину
events.on('card:toBasket', (item: IPill) => {
  item.selected = true;
  appData.addItemToCart(item);
  page.counter = appData.getCartItems();
  modal.close();
});

// Открытие корзины
events.on('basket:open', () => {
  page.locked = true;
  const cartItems = appData.cart.map((item, index) => {
    const storeItem = new StoreItemCart(
      'card',
      cloneTemplate(cardBasketTemplate),
      {
        onClick: () => events.emit('basket:delete', item),
      }
    );

    return storeItem.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  cart.list = cartItems;
  // Получаем сумму всех товаров в корзине
  const totalCartPrice = appData.getTotalCartPrice();

  modal.render({
    content: cart.render({
      total: totalCartPrice,
    }),
  });
});

// // Удалить товар из корзины
events.on('basket:delete', (item: IPill) => {
  appData.removeItemFromCart(item.id);
  item.selected = false;
  cart.total = appData.getTotalCartPrice();
  page.counter = appData.getCartAmount();
  cart.refreshIndices();
  if (!appData.cart.length) {
    cart.disableButton();
  }
});

events.on('basket:order', () => {
  console.log(
    'appData in modalOrder открытие модалки для оформления заказа',
    appData
  );
  modal.render({
    content: order.render({
      address: appData.order.address || '',
      valid: false,
      errors: [],
    }),
  });

  order.checkButtonState();
});

events.on('order.payment:change', (data: { field: string; value: string }) => {
  appData.order.payment = data.value;
});

events.on('order.address:change', (data: { field: string; value: string }) => {
  appData.order.address = data.value;
});

events.on('order.email:change', (data: { field: string; value: string }) => {
  appData.order.email = data.value;
});

events.on('order.phone:change', (data: { field: string; value: string }) => {
  appData.order.phone = data.value;
});

events.on('order:submit', (order: IOrder) => {
  console.log('appData в окне введения адреса', appData);

  appData.order.total = appData.getTotalCartPrice();
  appData.order.payment = order.payment;
  appData.order.address = order.address;
  appData.setItems();
  modal.render({
    content: contacts.render({
      valid: false,
      errors: [],
    }),
  });
  
  contacts.checkButton();
});

// отправка формы на бэк и открытие окна успешной покупки
events.on('order:success', (orderData: IOrder) => {
  appData.order.total = appData.getTotalCartPrice();
  appData.order.phone = orderData.phone;
  appData.order.email = orderData.email;

  appData.setItems();
  appData.clearCart(); // очистка корзины
  appData.setAllItemsButtonEvalableForOder(); // доступность кнопки оформления заказа
  // отправка заказа на бэк
  api
    .createOrder(appData.order)
    .then((data) => {
      modal.render({
        content: success.render({
          total: data.total,
        }),
      });
    })
    .catch((err) => {
      console.error(err);
    });
  appData.clearOder(); // очистка заказа
  order.clearInputs();
  contacts.clearInputs();

  console.log('appData in Success', appData);
});

//  Закрытие модального окна
events.on('modal:close', () => {
  page.locked = false;
  page.counter = appData.getCartAmount(); // обновление количества позиций в корзине
});
