# Binding Selector 

The Binding Selector APP, allows multi-language stores, specifically those with a single account-multiple binding architecture, to switch between their configured bindings.

The App takes the **Canonical** context of the current binding as well as the **Alternate href**  addresses registered for the other bindings, and creates a drop-down menu component to display the possible options on the Store Front.

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
1. on the CLI and run: ```vtex install vtex.binding-selector@1.x```
2. declare the block as a dependency inside your store-theme:

    ```
    "dependencies":{
      "vtex.binding-selector":"1.x"
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
    ]
    }

4. Go to your account Admin Panel and under the Account Settings, there will be a new menu item called **Binding Selector**. Here you will have the following options:

 4.1 Possibility to toggle whether or not the app will change Sales Channels when switching bindings. When the store changes the Sales Channel, the prices of the store and the checkout will also change.

 4.2. Toggle each store individually to be displayed on the front end component.

 4.3 Modify each displayed option labels clicking on the **Customize Store Names** button. This process has to be done for each active or displayed site.

 **if there are no labels configured, the menu won't display any options!!**

 ![adminfunctionality](/docs/admininterface.gif)


## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles |
| --------------------- |
| `container` |
| `relativeContainer` |
| `button` |
| `buttonText` |
| `list` |
| `listElement` |
| `active*` |

_*conditional class when dropdown is open_
