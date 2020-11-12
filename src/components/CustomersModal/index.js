import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash.isempty';
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from 'prop-types';
import ArrowLine from '../../assets/ArrowLine.png';
import CustomersModalCustomer from './CustomersModalCustomer';
import './style.css';
import VoucherifyLogo from '../../assets/VoucherifyLogo.png';
import GitHubIcon from '@material-ui/icons/GitHub';
import IconButton from '@material-ui/core/IconButton';

const CustomersModal = ({ customers, campaigns }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	/* eslint-disable */
	const herokuLink =
		'https://dashboard.heroku.com/new?button-url=https%3A%2F%2Fgithub.com%2F&template=https%3A%2F%2Fgithub.com%2Fvoucherifyio%2Fvoucherify-showcase-store%2F';
	/* eslint-enable */

	useEffect(() => {
		if (!_isEmpty(customers) && !_isEmpty(campaigns)) {
			setIsLoaded(true);
		}
	}, [campaigns, customers]);
	return (
		<div className="customersModalWrapper">
			{!isLoaded ? (
				<Spinner animation="grow" role="status">
					<span className="sr-only">Loading...</span>
				</Spinner>
			) : (
				<div className="customersModal">
					<img className="customersModalArrowLine" alt="" src={ArrowLine} />
					<div className="customersModalDescWrapper">
						<h1 className="customersModalTitle">
							Welcome to Hot Beans — Voucherify demo store
						</h1>
						<p className="customersModalDesc">
							Log in to explore various promotional and referral workflows we
							have predefined in Voucherify dashboard. You can enable and
							disable active promotions in the control panel on your right.{' '}
							<span className="customersModalDescBold">
								Remember to switch between customers to learn how promotion
								personalization works!
							</span>
						</p>
					</div>
					<div className="customersModalCustomers">
						{customers.map((customer) => (
							<CustomersModalCustomer key={customer.name} customer={customer} />
						))}
					</div>
					<div className="customersModalSourceLinks">
						<div className="sourceLinkWrapper">
							<p className="sourceLinkText">Connect to Voucherify</p>
							<a href={herokuLink}>
								<img
									src="https://www.herokucdn.com/deploy/button.svg"
									alt="Deploy"
								/>
							</a>
						</div>
						<div className="sourceLinkWrapper">
							<p className="sourceLinkText">Source code</p>
							<a href="https://github.com/voucherifyio/voucherify-showcase-store">
								<IconButton>
									<GitHubIcon />
								</IconButton>
							</a>
						</div>
					</div>

					<div className="customersModalFooter">
						<div className="voucherifyLogoWrapper">
							<a href="https://voucherify.io">
								<img
									className="voucherifyLogo"
									alt="Voucherify logo"
									src={VoucherifyLogo}
								/>
							</a>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		customers: state.userReducer.customers,
		campaigns: state.userReducer.campaigns,
	};
};

export default connect(mapStateToProps)(React.memo(CustomersModal));

CustomersModal.propTypes = {
	customers: PropTypes.array,
	campaigns: PropTypes.array,
};
