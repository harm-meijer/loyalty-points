# Customer points demo (subscription handler)

## Installation

1. After cloning the repo run `yarn install` in `subscription` and in `Deploy/server` run `yarn install` again.

2. Create a .env file in root of the project (.env.local does not [work!](.babelrc#L7)) with the content of an admin api key [generated](https://docs.commercetools.com/getting-started/create-api-client#create-an-api-client) in mc center (export as Sunrise SPA)

3. Run `yarn build` in the `subscription` directory

4. Follow the [deploy](Deploy/Readme.md) instructions to deploy this code on cloud run.

5. Create a Google pub sub topic and create a subscription, make it a push subscription and use the url of the published cloud run project.

6. Use the [subscription.json](commercetools/subscription.json) create a subscription on the [api playground](https://impex.europe-west1.gcp.commercetools.com/playground) (use it as payload) make sure you change the topic to the one you created in step 5.

7. Use the [customerPointsType.json](commercetools/customerPointsType.json) to create a type on the [api playground](https://impex.europe-west1.gcp.commercetools.com/playground) (use it as payload).
