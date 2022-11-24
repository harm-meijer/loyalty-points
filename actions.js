import fetch from "./commercetools/auth.js";
import { decode } from "js-base64";
const getMessage = (req) =>
  JSON.parse(decode(req?.body?.message?.data));
// const getMessage = (req) => req?.body;
const actions = [
  (req) =>
    Promise.resolve().then(() => {
      const message = getMessage(req);
      console.log("message:", JSON.stringify(message));
      if (!message.order?.customerId) {
        return;
      }
      return fetch(`/customers/${message.order.customerId}`)
        .then((response) => response.json())
        .then((customer) => {
          const price = message.order.totalPrice;
          const points =
            Math.ceil(
              price.centAmount / 10 ** price.fractionDigits
            ) + (customer?.custom?.fields?.points || 0);
          const PRODUCT_TYPE =
            "9598aa94-2994-4f43-8471-69f65f46c7e3";
          const CUSTOMER_GROUP =
            "9d4f125f-67c6-4817-89eb-4e904b3c3774";
          const actions = [
            // add total amount to customer points
            {
              action: "setCustomType",
              type: {
                key: "customerPoints",
                typeId: "type",
              },
            },
            // add total amount to customer points
            {
              action: "setCustomField",
              name: "points",
              value: points,
            },
            // add customer to customer group if an order line has certain product type
            message.order?.customerId &&
            (message.order?.lineItems || []).some(
              //if product is of type ... then do this
              ({ productType }) =>
                productType?.id === PRODUCT_TYPE
            )
              ? {
                  action: "setCustomerGroup",
                  customerGroup: {
                    id: CUSTOMER_GROUP,
                    typeId: "customer-group",
                  },
                }
              : false,
          ].filter((action) => action);
          return fetch(
            `/customers/${message.order.customerId}`,
            {
              method: "POST",
              body: JSON.stringify({
                version: customer.version,
                actions,
              }),
            }
          ).then((result) => result.json());
        });
    }),
];
export default (req) =>
  actions.reduce(
    (acc, action) => acc.then(() => action(req)),
    Promise.resolve()
  );
