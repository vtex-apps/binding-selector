# Binding Selector

[<i class="fa-brands fa-github"></i> Source code](https://github.com/vtex-apps/binding-selector)

> ⚠️ This app is no longer maintained by VTEX. This means support and maintenance are no longer provided.

The Binding Selector app allows multi-language stores, specifically those with a single-account, multiple-binding architecture, to switch between their configured bindings.

The App uses the **Canonical** context of the current binding, along with the **Alternate href** addresses registered for the other bindings, to create a drop-down menu component that displays the possible options on the Store Front.

This allows customers to seamlessly switch between stores without returning to Home or leaving the site.

Example:
If a user arrives at the Spanish Site:
- `www.testperformancev.com/es/iphone-11-128gb-rojo/p` -> Canonical
- `www.testperformancev.com/pt/iphone-11-128gb-vermelho/p` -> Alternate

If a user switches or arrives at the Portuguese Site:
- `www.testperformancev.com/pt/iphone-11-128gb-vermelho/p` -> Canonical
- `www.testperformancev.com/es/iphone-11-128gb-rojo/p` -> Alternate

It can update the Session and Cart's Sales Channel, which changes the prices and available stock for each store. It is up to the user to toggle this setting ON or OFF inside the App's settings.

The app is designed to improve the customer's Site Experience and will directly impact the store's conversion rate.

![bindingfunctionality](/docs/bindingfunctionality.gif)

## Configuration

The app consists of two main features: an Admin interface and a store block called `binding-selector`, which is used on the store theme. The setup for the app is as follows:

1. Open the terminal and run: `vtex install vtex.binding-selector@2.x`
2. Declare the block as a `peerDependency` inside your store-theme `manifest.json`:

   ```json
   "peerDependencies": {
    "vtex.binding-selector": "2.x"
   }
   ```

3. On the store theme, declare the block `binding-selector` where it is intended to be displayed. For example, inside the `header.json`, declare the block as follows:

   ```
   "flex-layout.row#4-desktop": {
    "props": {
      "blockClass": "main-header",
      "horizontalAlign": "center",
      "verticalAlign": "center",
      "preventHorizontalStretch": true,
      "preventVerticalStretch": true,
      "fullWidth": true
    },
    "children": [
      "flex-layout.col#logo-desktop",
      "flex-layout.col#category-menu",
      "flex-layout.col#spacer",
      "search-bar",
      "binding-selector",
      "login",
      "minicart.v2"
    ]},
   "binding-selector": {
    "props": {
      "layout": "dropdown",
      "display": "combined"
    }
   }

   ```

4. Go to your account Admin Panel and under the Account Settings, there will be a new menu item called **Binding Selector**. Here you will have the following options:

   4.1 Possibility to toggle whether or not the app will change Sales Channels when switching bindings. When the store changes the Sales Channel, the store's prices and the checkout prices will also change.

   4.2. Toggle each store individually to be displayed on the front-end component.

   4.3 Modify each displayed option label by clicking on the **Custom Store Names** button. This process must be performed for each active or displayed site. If no labels are configured, the menu won't display any options.

   4.4 _Advanced settings_

    4.4.1 External redirect URL
      - When set, the user will be redirected to the given URL when clicking the binding in the store

    4.4.2 Custom Flag
      - It's possible to customize the flags that represent the bindings. SVG files, with a 24x24px size, are recommended to maintain consistency.

![adminfunctionality](/docs/admininterface.gif)

### `binding-selector` block

Renders a component that allows the user to select a different binding for your store.

| Prop name | Type     | Description                                                                                    | Default value |
| --------- | -------- | ---------------------------------------------------------------------------------------------- | ------------- |
| `layout`  | `string` | How the bindings are grouped. Possible values are: `dropdown` - `list` - `select`            | `dropdown`    |
| `display` | `string` | How the bindings are displayed in the group. Possible values are: `text` - `flag` - `combined`. Please keep in mind that the `select` layout cannot be paired with `flag` or `combined`, as the native HTML tag 'select' can only render text | `text`        |

### `current-binding` block

Renders a component that ONLY shows the current binding as an SVG flag. Useful to use it as a modal trigger.

### `binding-challenge` block

Renders an action bar that automatically detects whether the user's country differs from the binding locale when browsing.
The bar includes a call-to-action text and uses the `binding-selector` selector.

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles         |
| ------------------- |
| `container`         |
| `relativeContainer` |
| `button`            |
| `buttonText`        |
| `list`              |
| `listElement`       |
| `active*`           |
| `currentBinding`    |
| `challengeBar`      |
| `actionCTA`         |
| `actionContainer`   |
| `listContainer`     |

_\*conditional class when dropdown is open_
