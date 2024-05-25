import { Component } from './base/Component';
import { CategoryTitle, categoryChoicing } from '../types'; //
import { ensureElement, formatPrice } from '../utils/utils';
import { CDN_URL } from '../utils/constants';

// Интерфейс для оболочки карточки
export interface ICard {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: CategoryTitle; // @ поменяли название
  image: string;
  selected: boolean;
}

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

//@ добавляем стили к карточкам
export const categoryChoice: categoryChoicing = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_additional',
  другое: 'card__category_other',
  дополнительное: 'card__category_additional',
  кнопка: 'card__category_button',
};

export class Card extends Component<ICard> {
  // Ссылки на внутренние элементы карточки

  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _button: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский контейнер
  // и объект с колбэк функциями
  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ICardActions
  ) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._price = container.querySelector(`.${blockName}__price`);
    this._category = container.querySelector(`.${blockName}__category`);
    this._image = ensureElement<HTMLImageElement>(
      `.${blockName}__image`,
      container
    );
    this._button = container.querySelector(`.${blockName}__button`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }
  // set и get для id
  set id(value: string) {
    this.container.dataset.id = value;
  }
  get id(): string {
    return this.container.dataset.id || '';
  }

  // set и get для названия
  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || '';
  }

  // set для изображения

  set image(value: string) {
    this.setImageWithCDN(this._image, value);
  }

  private setImageWithCDN(element: HTMLImageElement, imagePath: string) {
    element.src = CDN_URL + imagePath;
  }

  // set для определения выбрали данный товар или нет
  set selected(value: boolean) {
    if (!this._button.disabled) {
      this._button.disabled = value;
    }
  }
  set price(value: number | null) {
    if (value !== null) {
      this._price.textContent = formatPrice(value) + ' синапсов';
      if (this._button) {
        this._button.disabled = false;
      }
    } else {
      this._price.textContent = 'Бесценно';
      if (this._button) {
        this._button.disabled = true;
      }
    }
  }

  // Сеттер для категории
  set category(value: CategoryTitle) {
    this._category.textContent = value;
    this._category.classList.add(categoryChoice[value]); //@ добавляем стили к карточкам
  }
}
export class StoreItem extends Card {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
  }
}

export class StoreItemPreview extends Card {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);

    this._description = container.querySelector(`.${this.blockName}__text`);
    this._category.classList.remove('card__category_other'); //@ удаляем стиль card__category_other
  }

  set description(value: string) {
    this._description.textContent = value;
  }
}

