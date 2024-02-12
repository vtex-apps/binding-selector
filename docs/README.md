# Binding Selector

The Binding Selector APP, allows multi-language stores, specifically those with a single account-multiple binding architecture, to switch between their configured bindings.

The App takes the **Canonical** context of the current binding as well as the **Alternate href** addresses registered for the other bindings, and creates a drop-down menu component to display the possible options on the Store Front.

This allows customers to seamlesly switch between stores without returning to Home or leaving the site.

Example:
If a user arrives to the Spanish Site:
www.testperformancev.com/es/iphone-11-128gb-rojo/p -> Canonical
www.testperformancev.com/pt/iphone-11-128gb-vermelho/p -> Alternate

If a user switches or arrives to the Portuguese Site:
www.testperformancev.com/pt/iphone-11-128gb-vermelho/p -> Canonical
www.testperformancev.com/es/iphone-11-128gb-rojo/p -> Alternate

It has the possibility to update the Session and Cart's Sales Channel, this changes the prices and stock available for each store. It is up to the user to toggle this setting ON of OFF inside the App's settings.

The App is geared towards an improvement on Site Experience for the customer and it will have a direct impact on the store's conversion.

![bindingfunctionality](/docs/bindingfunctionality.gif)

## Configuration

The App consists on **two** main features an **Admin Interface** and a Store Block called **binding-selector** to be declared on the Store-Theme.

The Setup for the app is as follows:

1. on the CLI and run: `vtex install vtex.binding-selector@2.x`
2. declare the block as a peerDependency inside your store-theme manifest.json:

   ```
   "peerDependencies": {
    "vtex.reviews-and-ratings": "3.x"
   }
   ```

3. on the **store-theme** declare the block **binding-selector** where it is intended to be displayed, for example, inside the **header.json** declare the block as follows:

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

   4.1 Possibility to toggle whether or not the app will change Sales Channels when switching bindings. When the store changes the Sales Channel, the prices of the store and the checkout will also change.

   4.2. Toggle each store individually to be displayed on the front end component.

   4.3 Modify each displayed option labels clicking on the **Custom Store Names** button. This process has to be done for each active or displayed site.

    **if there are no labels configured, the menu won't display any options!!**

   4.4 _Advanced Settings_

    4.4.1 External redirect URL
      - When set, user will redirect to the given URL when clicking the binding in the store

    4.4.2 Custom Flag
      - It's possible to customize the flags that represents the bindings. SVG files, with a 24x24px size, is recommended to mantain consistency.

![adminfunctionality](/docs/admininterface.gif)

### `binding-selector` block

Renders a component that allows the user to select a different binding for your store.

| Prop name | Type     | Description                                                                                    | Default value |
| --------- | -------- | ---------------------------------------------------------------------------------------------- | ------------- |
| `layout`  | `string` | How the bindings are grouped. Possible values are: `dropdown` - `list` - `select`            | `dropdown`    |
| `display` | `string` | How the bindings are displayed in the group. Possible values are: `text` - `flag` - `combined`. Please keep in mind that the `select` layout cannot be paired with `flag` or `combined`, as the native HTML tag 'select' can only render text | `text`        |

### `current-binding` block

Renders a component that ONLY shows the current binding as a SVG flag. Useful to use it as modal-trigger

### `binding-challenge` block

Renders an action bar that automatically detects if the user's country is different from the binding locale its browsing.
The bar has a call to action text and is using the `binding-selector` selector.

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
