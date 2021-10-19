import React from "react";
import Link from "next/link";

const Success = () => {
  return (
    <div className="success">
      <h2>Thank You!</h2>
      <p>
        Your order has been placed and will be processed very soon. Please check
        your email for payment confirmation
      </p>
      <Link href="/">
        <a>
          <div className="button">Return</div>
        </a>
      </Link>
    </div>
  );
};

export default Success;
