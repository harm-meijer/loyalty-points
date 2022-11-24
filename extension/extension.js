//when a cart is created it will replace price with external
//  price if applicable
import fetch from "../commercetools/auth.js";
import prices from "../proxy/prices.js";

export default (req, res) => {
  if (!req.body.resource?.obj?.customerId) {
    res.status(200).end();
    return;
  }
  return fetch(
    `/customers/${req.body.resource?.obj?.customerId}`
  )
    .then((response) => response.json())
    .then((customer) => {
      console.log("customer", JSON.stringify(customer));
      const type = customer?.custom?.fields?.tipoUsuario;
      if (!type) {
        res.status(200).end();
        return;
      }
      console.log("extension", JSON.stringify(req.body));
      const actions = req.body.resource.obj.lineItems
        .filter(({ priceMode }) => priceMode === "Platform")
        .map((lineItem) => {
          const price = prices.find(
            (p) =>
              p.sku === lineItem.variant.sku &&
              p.group === type
          )?.price;
          return price
            ? {
                action: "setLineItemTotalPrice",
                lineItemId: lineItem.id,
                externalTotalPrice: {
                  price: {
                    centAmount: price.value.centAmount,
                    currencyCode:
                      lineItem.totalPrice.currencyCode,
                  },
                  totalPrice: {
                    centAmount:
                      price.value.centAmount *
                      lineItem.quantity,
                    currencyCode:
                      lineItem.totalPrice.currencyCode,
                  },
                },
              }
            : false;
        })
        .filter((x) => x);
      if (actions.length) {
        res.status(200).json({ actions });
      } else {
        res.status(200).end();
      }
    });
};
