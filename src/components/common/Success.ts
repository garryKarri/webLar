import { Component } from '../base/Component';
import { formatPrice } from '../../utils/utils';

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected _button: HTMLButtonElement;
  protected _total: HTMLElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ISuccessActions
  ) {
    super(container);

    this._button = container.querySelector(`.${blockName}__close`);
    this._total = container.querySelector(`.${blockName}__description`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      }
    }
  }

  set total(value: number) {
    this._total.textContent = 'Списано ' + formatPrice(value) + ' синапсов';
  }
}
