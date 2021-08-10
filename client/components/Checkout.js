import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/products';
import { updateProduct } from '../store/singleProduct';
import UserCheckout from './userCheckoutInfo';

export class Checkout extends React.Component {
	constructor() {
		super();
		this.checkoutHandler = this.checkoutHandler.bind(this);
	}
	componentDidMount() {
		this.props.getProducts();
	}
	async checkoutHandler() {
		let localCart = JSON.parse(localStorage.getItem('cart'));
		this.props.products.map((product) => {
			for (let i = 0; i < localCart.length; i++) {
				if (product.id === localCart[i].id && localCart[i].quantity > 0) {
					product.inventory -= localCart[i].quantity;
					this.props.updateProduct(product, this.props.currentUser);
				}
			}
		});
		localStorage.setItem('cart', '[]');
	}

	// let cartString = JSON.stringify(newCart);

	//subtract each items quantity from each items inventory
	//history.push to a page that says everything about ur order (name,email,order)
	render() {
		console.log(this.props);
		//update our orders db with status completed=false
		const { products, currentUser } = this.props;
		const { checkoutHandler } = this;
		let localCart = JSON.parse(localStorage.getItem('cart'));
		let idOfCart = localCart.map((product) => {
			return product.id;
		});
		// console.log(localCart);
		// console.log('trying to grab', localCart);
		return (
			<div id='user-checkout'>
				{currentUser && currentUser.id ? <UserCheckout /> : null}

				<div>
					{products && products.length ? (
						<div className='user-checkout'>
							{products.map((product) => {
								for (let i = 0; i < idOfCart.length; i++) {
									if (product.id === idOfCart[i]) {
										return (
											<div key={product.id}>
												{product.name}
												{'   '}Quantity: {localCart[i].quantity}
												{'   '}Total: $
												{(localCart[i].quantity * localCart[i].price) /100}
											</div>
										);
									}
								}
							})}
							<div>
								<h5>(+ Cat Tax)</h5>
								Grand Total: $
								{Math.floor((localCart.reduce((total, product) => {
									total += product.price * product.quantity;
									return total;
								}, 0)) *1.08) /100}
							</div>

							{currentUser && currentUser.id ? (
								<Link to='/placeOrder'>
									<button type='submit' onClick={() => checkoutHandler()}>
										Place Order
									</button>
								</Link>
							) : (
								<div>
									<br />
									Please log in in order to check out!
								</div>
							)}
						</div>
					) : (
						<div>Oops! You haven`t added anything to the cart yet!</div>
					)}
				</div>
			</div>
		);
		//(compare localStorage cart with our products)  --- maybe array.filter +
		//only display items inside of cart +
		//button - 'finalize' type='submit' &&
		//update inventory, cc, address
	}
}

const mapState = (state) => ({
	products: state.products,
	currentUser: state.auth,
});

const mapDispatch = (dispatch) => {
	return {
		getProducts: () => dispatch(fetchProducts()),
		updateProduct: (product, user) => dispatch(updateProduct(product, user)),
	};
};

export default connect(mapState, mapDispatch)(Checkout);
