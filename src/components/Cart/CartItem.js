import React from 'react';
import Form from 'react-bootstrap/Form';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeItemFromCart, addItemToCart } from '../../redux/actions/cartActions';

const CartItem = ({ id, dispatch, items }) => {
  const { name, price, count, total } = items.find((item) => item.id === id);
  const quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const handleOnChange = (e) => {
    dispatch(addItemToCart(id, parseInt(e.target.value, 10)));
  };

  return (
    <li
      className="list-group-item d-flex
      flex-row justify-content-between lh-condensed"
    >
      <div className="d-flex flex-column justify-content-center col-4">
        {name}
      </div>
      <div className="d-none d-lg-block my-auto mx-auto col-2">
        <div className="d-flex flex-column justify-content-center">
          <small className="text-muted">Unit price</small>$
          {(price / 100).toFixed(2)}
        </div>
      </div>
      <div className="d-none d-lg-block my-auto mx-auto col-2">
        <div className="d-flex flex-column justify-content-center">
          <Form.Control
            as="select"
            id="productQuantity"
            onChange={(e) => handleOnChange(e)}
            value={count}
          >
            {quantities.map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </Form.Control>
        </div>
      </div>
      <div
        className="d-flex flex-column justify-content-center
        my-auto mx-auto align-items-center col-2"
      >
        <small className="text-muted">Price</small>${(total / 100).toFixed(2)}
      </div>
      <div className="d-flex flex-column justify-content-center">
        <IconButton className="mx-2" onClick={() => dispatch(removeItemFromCart(id))}>
          <DeleteIcon />
        </IconButton>
      </div>
    </li>
  );
};

const mapStateToProps = (state) => {
  return {
    items: state.cartReducer.items,
  };
};

export default connect(mapStateToProps)(CartItem);

CartItem.propTypes = {
  items: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  dispatch: PropTypes.func
};
