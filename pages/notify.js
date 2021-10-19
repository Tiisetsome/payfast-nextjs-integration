import React from "react";
import { parse } from "querystring";
import md5 from "md5";
import dns from "dns";
import axios from "axios";

const Notify = () => {
  return <div></div>;
};

export default Notify;

const getIpAddress = async (url) => {
  return new Promise((resolve, reject) => {
    dns.lookup(url, (err, address) => {
      if (err) reject(err);
      resolve(address);
    });
  });
};

const verifyPayfastSignature = (
  payfastParamStr,
  payFastSignature,
  payfastPassphrase = null
) => {
  let tempPayfastParamStr;
  if (payfastPassphrase === null) {
    tempPayfastParamStr = payfastParamStr;
  } else {
    tempPayfastParamStr = `${payfastParamStr}&passphrase=${encodeURIComponent(
      payfastPassphrase
    )}`;
  }

  const signature = md5(tempPayfastParamStr);

  return signature === payFastSignature;
};

const verifyPayfastValidIP = async (urlReferer) => {
  const validHosts = [
    "www.payfast.co.za",
    "sandbox.payfast.co.za",
    "w1w.payfast.co.za",
    "w2w.payfast.co.za",
  ];

  try {
    let hostsIpAddress = [];
    for (let i = 0; i < validHosts.length; i++) {
      const address = await getIpAddress(validHosts[i]);
      hostsIpAddress = [...new Set(hostsIpAddress)];
      hostsIpAddress.push(address);
    }
    const refererIpAddress = await getIpAddress(
      urlReferer.replace("https://", "")
    );
    if (hostsIpAddress.length > 0 && refererIpAddress)
      return hostsIpAddress.includes(refererIpAddress);
  } catch (err) {
    console.error(err);
    return false;
  }
  return false;
};

const verifyPayfastPaymentData = (cartTotal, totalAmountCustomerPaid) => {
  return !(cartTotal - totalAmountCustomerPaid > 0.01);
};

const payfastServerConfirmation = async (payfastHost, postData) => {
  const { data } = await axios.post(
    `https://${payfastHost}/eng/query/validate`,
    { ...postData }
  );
  if (data === "VALID") {
    return true;
  }
  return false;
};

export async function getServerSideProps({ req, res }) {
  if (req.headers.referer !== "https://www.payfast.co.za") {
    return {
      notFound: true,
    };
  }

  if (req.method === "POST") {
    const payfastHost = process.env.SANDBOXMODE
      ? "sandbox.payfast.co.za"
      : "www.payfast.co.za";
    let responseDataChuncks = "";
    let responseData;

    req.on("data", (data) => {
      responseDataChuncks += data.toString();

      if (responseDataChuncks.length > 1e6) {
        req.connection.destroy();
      }
    });

    req.on("end", async function () {
      responseData = parse(responseDataChuncks);
      let payFastParamsString = "";

      for (let key in responseData) {
        if (key !== "signature") {
          payFastParamsString += `${key}=${encodeURIComponent(
            responseData[key]
          )}&`;
        }
      }

      payFastParamsString = payFastParamsString
        .slice(0, payFastParamsString.length - 1)
        .trim();

      const isSignatureValid = verifyPayfastSignature(
        payFastParamsString,
        responseData.signature
      );
      const isIpAddressValid = await verifyPayfastValidIP(req.headers.referer);
      const isPaymentDataValid = verifyPayfastPaymentData(
        20.0,
        responseData.amount_gross
      );
      const isServerConfirmationValid = await payfastServerConfirmation(
        payfastHost,
        responseData
      );
      console.log("signature verificaiton :" + isSignatureValid);
      console.log("ip-address verificaiton :" + isIpAddressValid);
      console.log("payment verificaiton :" + isPaymentDataValid);
      console.log("server verificaiton :" + isServerConfirmationValid);
      if (
        isSignatureValid &&
        isIpAddressValid &&
        isPaymentDataValid &&
        isServerConfirmationValid
      ) {
        // All checks have passed, the payment is successful
      } else {
        // Some checks have failed, check payment manually and log for investigation
      }
    });
  }
  return {
    props: {},
  };
}
