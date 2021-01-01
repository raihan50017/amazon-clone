import { Link, useHistory } from 'react-router-dom';
import React, { useState } from 'react';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css';
import { useStateValue } from './StateProvider';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import { useEffect } from 'react';
import axios from './axios';
import { db } from './firebase';

const Payment = () => {

    const history = useHistory();

    const [{ basket, user }, dispatch] = useStateValue();

    const [error, setError] = useState(null)
    const [disabled, setDisabled] = useState(true);
    const [succeded, setSucceded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [clientSecret, setClientSecret] = useState(true);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {

        fetch('http://localhost:5001/clone-8a68d/us-central1/api')
            .then(res => console.log("rabbi", res))

        const getClientSecret = async () => {
            const response = await axios({
                method: 'POST',
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            })
            setClientSecret(response.data.clientSecret);
        }

        getClientSecret();
    }, [basket]);

    console.log(clientSecret);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        })
            .then(({ paymentIntent }) => {
                setSucceded(true);
                setError(null);
                setProcessing(false);

                db
                    .collection('users')
                    .doc(user?.uid)
                    .collection('orders')
                    .doc(paymentIntent.id)
                    .set({
                        basket: basket,
                        amount: paymentIntent.amount,
                        created: paymentIntent.created
                    })

                dispatch({
                    type: 'EMPTY_BASKET'
                })

                history.replace('/orders');

            })

    }

    const handleChange = (event) => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");

    }

    return (
        <div className="payment">
            <div className="payment__container">
                <h1>
                    Checkout (<Link to="/checkout">{basket.length} items</Link>)
                </h1>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__address">
                        <p>{user?.email}</p>
                        <p>123 React Lane</p>
                        <p>Trishal, Mymensingh</p>
                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className="payment__items">
                        {basket.map(item => (
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                </div>
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Payment method</h3>
                    </div>
                    <div className="payment__details">
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange}></CardElement>
                            <div className="payment__priceContainer">
                                <CurrencyFormat
                                    renderText={(value) => (
                                        <>
                                            <h3>Order total: {value}</h3>
                                        </>
                                    )}
                                    value={getBasketTotal(basket)}
                                    decimalScale={2}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                ></CurrencyFormat>
                                <button disabled={processing || disabled || succeded}>
                                    <span>{processing ? <p>processing</p> : "Buy Now"}</span>
                                </button>
                            </div>
                            {
                                error && <div>{error}</div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;