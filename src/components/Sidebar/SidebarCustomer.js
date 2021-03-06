import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash.isempty';

const SidebarCustomer = ({ currentCustomer }) => {
  const customerDate = new Date(currentCustomer.summary.orders.last_order_date);

  const dateText = `${('0' + customerDate.getDate()).slice(-2)}.
    ${('0' + (customerDate.getMonth() + 1)).slice(-2)}.
    ${customerDate.getFullYear()} @ 
    ${('0' + customerDate.getHours()).slice(-2)}:${(
    '0' + customerDate.getMinutes()
  ).slice(-2)}`;

  return (
    <>
      <div className="sidebarSection">
        <div className="sidebarSectionHeading">
          <span className="sidebarSectionTitle">Customer</span>
        </div>

        <div className="sidebarSectionBody">
          <p className="sidebarSectionCustomerData">
            Customer:{' '}
            <span className="sidebarSectionCustomerDataContent">
              {currentCustomer.name}
            </span>
          </p>
          <p className="sidebarSectionCustomerData">
            Location:{' '}
            <span className="sidebarSectionCustomerDataContent">
              {currentCustomer.address.country}
            </span>
          </p>
          <p className="sidebarSectionCustomerData">
            Amount spent:{' '}
            <span className="sidebarSectionCustomerDataContent">
              ${(currentCustomer.summary.orders.total_amount / 100).toFixed(2)}
            </span>
          </p>
          <p className="sidebarSectionCustomerData">
            Last order:{' '}
            <span className="sidebarSectionCustomerDataContent">
              {dateText}
            </span>
          </p>
          <p className="sidebarSectionCustomerData">
            Email:{' '}
            <span className="sidebarSectionCustomerDataContent">
              {_isEmpty(currentCustomer.email)
                ? 'Not submitted'
                : currentCustomer.email}
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    currentCustomer: state.userReducer.currentCustomer,
  };
};

export default connect(mapStateToProps)(SidebarCustomer);

SidebarCustomer.propTypes = {
  currentCustomer: PropTypes.object,
};
