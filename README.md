This repository show how you can integrate payfast with your next js application to receive online payments.

## Getting Started

First, run the command to install all the dependencies:

```bash
npm install
```

Then start the development server:
```bash
npm run dev
# or
yarn dev
```
You need to install a tool called NGROK ([https://ngrok.com/download] ) to publicly make your notify_url accessible, this is the page payfast will send the payment notification once they payment has been made. For more details, check the docs : [https://developers.payfast.co.za/docs#onsite_payments].

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

NB: Don't forget to include merchant_id and merchant_key as provided by payfast in your .env file. Visit their site to get those details for testing environment.

## Important!

Payfast documentation only shows how to do the integration in PHP. This code can still be refactored to make it more secure, please feel free to make changes and improve it.
