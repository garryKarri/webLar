import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppData';
import { Page } from './components/Page';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Cart, StoreItemCart } from './components/common/Cart';
import { ApiAnswer, IOrderForm, IPill } from './types';
import { Order, Contacts } from './components/Order';
import { Success } from './components/common/Success';
import { Api, ApiListResponse } from './components/base/api';
import { StoreItemPreview, StoreItem } from './components/Card';
// import {WebLarekAPI} from "./components/WebLarekAPI"

const events = new EventEmitter();
const api = new Api(API_URL);

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

// Получение картинок с сервера
api
  .get('/product')
  .then((response: ApiAnswer) => {
    // // Перебираем элементы ответа и обновляем URL изображений
    // const updatedItems = response.items.map((item: IPill) => ({
    //     ...item,
    //     imgUrl: CDN_URL + item.imgUrl
    appData.setStore(response.items as IPill[]);

    // appData.setStore(updatedItems); // Устанавливаем обновленные элементы в объект appData
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
  console.log('appData', appData);

  const cartItems = appData.cart.map((item, index) => {
    const storeItem = new StoreItemCart(
      'card',
      cloneTemplate(cardBasketTemplate),
      {
        onClick: () => events.emit('basket:delete', item),
      }
    );
    console.log('storeItem', storeItem);

    return storeItem.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  cart.list = cartItems;
  // Получаем сумму всех товаров в корзине
  const totalCartPrice = appData.getTotalCartPrice();
  console.log(totalCartPrice);

  cart.price = totalCartPrice;
  modal.render({
    content: cart.render({
      // total: totalCartPrice, // Передаем сумму в шаблон корзины
    }),
  });
  // modal.render({
  //   content: cart.render({
  //     // list: cartItems,
  //     // total: appData.getTotalCartPrice(),
  //   }),
  // });
});

// // Удалить товар из корзины
events.on('basket:delete', (item: IPill) => {
  appData.removeItemFromCart(item.id);
  item.selected = false;
  // cart.total = appData.getTotalCartPrice();
  page.counter = appData.getCartAmount();
  cart.refreshIndices();
  if (!appData.cart.length) {
    cart.disableButton();
  }
});

// // Оформить заказ
events.on('basket:order', () => {
  modal.render({
    content: order.render({
      address: '',
      valid: false,
      errors: [],
    }),
  });
});

// // Изменилось состояние валидации заказа
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
  const { typeOfPay, address } = errors;
  order.valid = !typeOfPay && !address;
  order.errors = Object.values({ typeOfPay, address })
    .filter((i) => !!i)
    .join('; ');
});

// // Изменилось состояние валидации контактов
// events.on('contactsFormErrors:change', (errors: Partial<IOrderForm>) => {
//   const { email, phone } = errors;
//   contacts.valid = !email && !phone;
//   contacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
// });

// // Изменились введенные данные
// events.on('orderInput:change', (data: { field: keyof IOrderForm, value: string }) => {
//   appData.setOrderField(data.field, data.value);
// });

// // // Заполнить телефон и почту
// events.on('order:submit', () => {
//   appData.order.total = appData.getTotalBasketPrice()
//   appData.setItems();
//   modal.render({
//     content: contacts.render(
//       {
//         valid: false,
//         errors: []
//       }
//     ),
//   });
// })

// // Покупка товаров
// events.on('contacts:submit', () => {
//   api.post('/order', appData.order)
//     .then((res) => {
//       events.emit('order:success', res);
//       appData.clearCart();
//       appData.refreshOrder();
//       order.disableButtons();
//       page.counter = 0;
//       appData.resetSelected();
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// })

// // Окно успешной покупки
events.on('order:success', (res: ApiListResponse<string>) => {
  modal.render({
    content: success.render({
      total: res.total,
    }),
  });
});

// // Закрытие модального окна
events.on('modal:close', () => {
  page.locked = false;
});
