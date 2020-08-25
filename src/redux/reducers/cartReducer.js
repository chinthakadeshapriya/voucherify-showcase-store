import {
  INCREMENT_DECREMENT,
  SET_CART,
  GET_DISCOUNT_ERROR,
  CLEAR_CART,
  GET_DISCOUNT_SUCCESS,
  GET_DISCOUNT_REQUEST,
  SET_ORDER_ID,
  GET_TOTALS,
  REMOVE_ITEM,
} from '../constants';
import _ from 'lodash';

export const cartReducer = (
  initialState = {
    items: [],
    totalAmount: 0,
    itemsTotalCount: 0,
    totalAmountAfterDiscount: 0,
    discountedAmount: 0,
    orderId: null,
    discount: null,
  },
  action
) => {
  switch (action.type) {
    case GET_DISCOUNT_REQUEST: {
      return {
        ...initialState,
        fetchingDiscount: true,
      };
    }
    case GET_TOTALS: {
      // eslint-disable-next-line prefer-const
      let { totalAmount, itemsTotalCount } = initialState.items.reduce(
        (items, currentItem) => {
          const { price, count } = currentItem;
          const itemTotalAmount = price * count;
          items.totalAmount += itemTotalAmount;
          items.itemsTotalCount += count;
          return items;
        },
        {
          totalAmount: 0,
          itemsTotalCount: 0,
        }
      );
      let totalAmountAfterDiscount = totalAmount;
      const discountedAmount = 0;

      if (initialState.discount !== null) {
        const discount = initialState.discount;

        if (_.has(discount, 'applicable_to')) {
          const applicableProducts = [];
          let applicableProductInCart = '';
          discount.applicable_to.data.map((e) => applicableProducts.push(e.id));

          for (let i = 0; i < applicableProducts.length; i++) {
            applicableProductInCart = initialState.items.find(
              (item) => item.id === applicableProducts[i]
            );
          }

          if (discount.discount.type === 'PERCENT') {
            const discountedAmount =
              applicableProductInCart.price *
              (discount.discount.percent_off / 100);
            totalAmountAfterDiscount = totalAmount - discountedAmount;
            if (totalAmountAfterDiscount < 0) {
              totalAmountAfterDiscount = 0;
            }
            return {
              ...initialState,
              totalAmount,
              itemsTotalCount,
              totalAmountAfterDiscount,
              discountedAmount,
            };
          } else if (discount.discount.type === 'AMOUNT') {
            const discountedAmount = discount.discount.amount_off;
            totalAmountAfterDiscount =
              applicableProductInCart.totalAmount - discountedAmount;
            if (totalAmountAfterDiscount < 0) {
              totalAmountAfterDiscount = 0;
            }
            return {
              ...initialState,
              totalAmount,
              itemsTotalCount,
              totalAmountAfterDiscount,
              discountedAmount,
            };
          }
        } else if (discount.discount.type === 'PERCENT') {
          const discountedAmount =
            totalAmount * (discount.discount.percent_off / 100);
          totalAmountAfterDiscount = totalAmount - discountedAmount;

          if (totalAmountAfterDiscount < 0) {
            totalAmountAfterDiscount = 0;
          }

          return {
            ...initialState,
            totalAmount,
            itemsTotalCount,
            totalAmountAfterDiscount,
            discountedAmount,
          };
        } else if (discount.discount.type === 'AMOUNT') {
          const discountedAmount = discount.discount.amount_off;
          totalAmountAfterDiscount = totalAmount - discountedAmount;

          if (totalAmountAfterDiscount < 0) {
            totalAmountAfterDiscount = 0;
          }

          return {
            ...initialState,
            totalAmount,
            itemsTotalCount,
            totalAmountAfterDiscount,
            discountedAmount,
          };
        }

        if (totalAmountAfterDiscount < 0) {
          totalAmountAfterDiscount = 0;
        }
      }
      return {
        ...initialState,
        totalAmount,
        itemsTotalCount,
        totalAmountAfterDiscount,
        discountedAmount,
      };
    }
    case GET_DISCOUNT_SUCCESS: {
      return {
        ...initialState,
        fetchingDiscount: false,
        discount: action.payload.discount,
      };
    }
    case INCREMENT_DECREMENT: {
      const tempItems = initialState.items.map((item) => {
        if (item.id === action.payload.id) {
          if (action.payload.type === '+') {
            item = {
              ...item,
              count: item.count + 1,
            };
          } else {
            item = {
              ...item,
              count: item.count - 1,
            };
          }
        }
        return item;
      });
      return { ...initialState, items: tempItems };
    }
    case GET_DISCOUNT_ERROR: {
      return {
        ...initialState,
        fetchingDiscountError: true,
      };
    }
    case REMOVE_ITEM: {
      return {
        ...initialState,
        items: action.payload.items
      }
    }
    case SET_CART: {
      const product = action.payload.product;
      const quantity = parseInt(action.payload.qt, 10);
      const items = [...initialState.items];
      const item = _.cloneDeep(items.find((item) => item.id === product.id));
      if (item) {
        const selectedProduct = items.find((item) => item.id === product.id);
        if (action.payload.type === 'increment_count') {
          selectedProduct.count += quantity;
        } else {
          selectedProduct.count = quantity;
        }
        selectedProduct.total = selectedProduct.price * selectedProduct.count;
        return { ...initialState, items: items };
      } else {
        return {
          ...initialState,
          items: [
            ...initialState.items,
            {
              ...product,
              count: quantity,
              total: product.price * quantity,
            },
          ],
        };
      }
    }
    case SET_ORDER_ID: {
      return {
        ...initialState,
        orderId: action.payload.orderId,
      };
    }
    case CLEAR_CART: {
      return {
        ...initialState,
        items: [],
        totalAmount: 0,
        itemsTotalCount: 0,
        totalAmountAfterDiscount: 0,
        discountedAmount: 0,
        discount: null,
      };
    }
    default: {
      return initialState;
    }
  }
};

export default cartReducer;
