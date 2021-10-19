import md5 from "md5";
import { useState } from "react";

export default function Home({ payfastFormData }) {
  return (
    <div>
      <h2>Payfast integration with Next Js</h2>
      <div className="payment_confirmation">
        <div>
          <span>Sub Total :</span>
          <span>R {payfastFormData.amount}</span>
        </div>
        <div>
          <span>Shipping Cost :</span>
          <span>R 100.00</span>
        </div>
        <div>
          <span>Total Amount :</span>
          <span>R {payfastFormData.amount + 100.0}</span>
        </div>

        <form action="https://sandbox.payfast.co.za​/eng/process" method="post">
          <input
            type="hidden"
            name="merchant_id"
            value={payfastFormData.merchant_id}
          />
          <input
            type="hidden"
            name="merchant_key"
            value={payfastFormData.merchant_key}
          />
          <input
            type="hidden"
            name="return_url"
            value={payfastFormData.return_url}
          />
          <input
            type="hidden"
            name="cancel_url"
            value={payfastFormData.cancel_url}
          />
          <input
            type="hidden"
            name="notify_url"
            value={payfastFormData.notify_url}
          />
          <input
            type="hidden"
            name="name_first"
            value={payfastFormData.name_first}
          />
          <input
            type="hidden"
            name="email_address"
            value={payfastFormData.email_address}
          />
          <input type="hidden" name="amount" value={payfastFormData.amount} />
          <input
            type="hidden"
            name="item_name"
            value={payfastFormData.item_name}
          />
          <input
            type="hidden"
            name="signature"
            value={payfastFormData.signature}
          />
          <div>
            <input type="submit" value="PAY NOW" />
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const paymentData = {
    merchant_id: process.env.merchantId,
    merchant_key: process.env.merchantKey,
    return_url: "https://yourdomain.com/success", //
    cancel_url: "https://yourdomain.com/cancel",
    notify_url: "https://yourdomain.com/notify",
    name_first: "Katlego",
    email_address: "katlego@gmail.com",
    amount: 20.0, // ampunt should be the cart total amount
    item_name: "#0000001",
    // item_description: description_if_any,
    // custom_int1: custome_integer_value_if_any,
    // custom_str1: custome_string_value_if_any,
    // custom_str2: custome_string_value_if_any,
  };
  const params = new URLSearchParams(paymentData);
  const signature = md5(params.toString());
  return {
    props: {
      payfastFormData: {
        ...paymentData,
        signature,
      },
    },
  };
}
