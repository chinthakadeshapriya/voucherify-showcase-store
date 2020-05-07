import React from "react";
import { storeCustomers } from "../data";
import { CustomerConsumer } from "./CustomerContext";

export default function SidebarContent() {
  return (
    <div className="side-menu-container">
      <CustomerConsumer>
        {(ctx) => {
          return (
            <>
              <select
                id="storeCustomers"
                onChange={(e) => ctx.setCustomer(e.target.value)}
                value={(ctx.customer || {}).name || "DEFAULT"}
              >
                <option value="DEFAULT" disabled>
                  Select customer
                </option>
                {storeCustomers.map((customer) => (
                  <option key={customer.name} value={customer.name}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {ctx.customer && (
                <div>
                  <pre className="pre-scrollable" style={{ fontSize: "10px" }}>
                    <code>{JSON.stringify(ctx.customer, null, 1)}</code>
                  </pre>
                </div>
              )}
            </>
          );
        }}
      </CustomerConsumer>
    </div>
  );
}