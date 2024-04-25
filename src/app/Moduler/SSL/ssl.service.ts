import axios from "axios";
import config from "../../config";
import AppError from "../../Error/AppError";
import httpStatus from "http-status";

const initPaymentSSL = async (initPaymentData: any) => {
    try {
        const data = {
            store_id: config.ssl.store_id,
            store_passwd: config.ssl.store_password,
            total_amount: initPaymentData.amount,
            currency: 'BDT',
            tran_id: initPaymentData.transactionId,
            success_url: config.ssl.success_url,
            fail_url: config.ssl.fail_url,
            cancel_url: config.ssl.cancel_url,
            ipn_url: config.ssl.ipn_url,
            shipping_method: 'N/A',
            product_name: 'Appointment',
            product_category: 'Service',
            product_profile: 'general',
            cus_name: initPaymentData.name,
            cus_email: initPaymentData.email,
            cus_add1: initPaymentData.address,
            cus_add2: initPaymentData.address,
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: initPaymentData.contactNumber,
            cus_fax: 'N/A',
            ship_name: 'N/A',
            ship_add1: 'N/A',
            ship_add2: 'N/A',
            ship_city: 'N/A',
            ship_state: 'N/A',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };

        const response = await axios({
            method: 'post',
            url: config.ssl.ssl_payment_api,
            data: data,
            headers: { 'content-Type': 'application/x-www-form-urlencoded' }
        })

        return response.data
    } catch (error) {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment initiate failed")
    }
}

const validatePayment = async (payload: any) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${config.ssl.ssl_validation_api}?val_id=${payload.val_id}&store_id=${config.ssl.store_id}&store_passwd=${config.ssl.store_password}&format=json`
        })
        return response.data
    } catch (error) {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment validation failed")
    }
}

export const SSLService = {
    initPaymentSSL,
    validatePayment
}