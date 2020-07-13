# Contacts - Client

## Introduction

This project is a simple contacts management client. It displays a list of contacts and it allows the user to create/modify/delete a contact.

## Instructions

First, install the dependencies with `yarn` or `npm`.

```
$ yarn # or npm i
```

Then, set the backend's base URL in the `.env` file

```
# .env

REACT_APP_BACKEND_BASE_URL="http://localhost:2000"
```

Finally, start the server (on port 3000 by default).

```
$ yarn start
```

## Backend API

### Types

#### `ContactInfos`

| Name           | Type            |
| -------------- | --------------- |
| `name`         | string          |
| `jobTitle`     | string          |
| `address`      | string          |
| `email`        | string          |
| `pictureId`    | string          |
| `phoneNumbers` | Array of string |

#### `Contact`

| Name      | Type           |
| --------- | -------------- |
| `id`      | string         |
| `...rest` | `ContactInfos` |

### Routes

#### `GET /image/:imageId`

> Get an image

##### Parameters

| Name      | Type     |
| --------- | -------- |
| `imageId` | `string` |

##### Return

An image file

##### Errors

| Description          | Status code |
| -------------------- | ----------- |
| Image does not exist | 404         |

---

#### `POST /image`

> Upload an image

##### Return

| Name      | Type   |
| --------- | ------ |
| `imageId` | string |

---

#### `GET /contact`

> Get the complete list of contacts order by alphabetical order

##### Return

| Name       | Type               |
| ---------- | ------------------ |
| `contacts` | Array of `Contact` |

---

#### `POST /contact`

> Create a contact

##### Parameters

| Name           | Type           |
| -------------- | -------------- |
| `contactInfos` | `ContactInfos` |

##### Return

| Name      | Type      |
| --------- | --------- |
| `contact` | `Contact` |

---

#### `GET /contact/:contactId`

> Get the contact `:contactId`

##### Parameters

| Name         | Type     |
| ------------ | -------- |
| `:contactId` | `string` |

##### Return

| Name      | Type      |
| --------- | --------- |
| `contact` | `Contact` |

##### Errors

| Description            | Status code |
| ---------------------- | ----------- |
| Contact does not exist | 404         |

---

#### `PUT /contact/:contactId`

> Modify the contact `:contactId`

##### Parameters

| Name         | Type     |
| ------------ | -------- |
| `:contactId` | `string` |

##### Return

| Name      | Type      |
| --------- | --------- |
| `contact` | `Contact` |

##### Errors

| Description            | Status code |
| ---------------------- | ----------- |
| Contact does not exist | 404         |

---

#### `DELETE /contact/:contactId`

> Delete the contact `:contactId`

##### Parameters

| Name         | Type     |
| ------------ | -------- |
| `:contactId` | `string` |

##### Errors

| Description            | Status code |
| ---------------------- | ----------- |
| Contact does not exist | 404         |

## Client

### Assumptions

- There is only one list of contacts, shared among the users: there are no authentication features to distinguish the users.
- This number of contacts is less than a couple of hundreds: the list of contact should not be too big for a single call.
- Multiple browsers can access the same SPA: the data from an instance may be out of sync

### Frameworks & Libraries

The client is based on `create-react-app` and uses `react@16.13`. It is written using mostly typescript. The client leverages `react-router-dom` as the routing mechanism.

A store built with the easy-to-use `mobx-state-tree` is provided to put some of the app data in a single place.

Most UI components come from `antd`. The styling is done using `scss` module files, and `easy-bem` to enable BEM naming (Block, Element, Modifier).

The contact form is managed by `react-hook-form`.

The REST API calls are done using `axios`.

The unit tests are provided using `jest` and `react-testing-library`.

### How it works?

When the home page is loaded for the first time, all the contacts are fetched and stored by the `ContactStore`.

The `ContactPage` and `CreateContactPage` are responsible for their API calls are for updating the `ContactStore` accordingly. The `ContactPage` fetches the contact with the provided `:contactId` in order to verify the contact is still in sync.

### How to improve it?

**Prevent the download of the whole list of contacts at the beginning**

For now, the SPA downloads the whole list of contact when first loading the home page.
We could separate the contacts in multiple pages or use an infinite lazy loader to only fetch the contacts that are needed.

**Allow different users to use this app**

We could implement an authentication feature and send the user's token (`jwt` for instance) with the API calls.

**Keep the list of contacts in sync between browsers and users?**

We could implement a real-time sync system using `WebSocket` or `socket.io`.

**Open a contact in a new tab**

We could embed the contact cell in a `Link` or a `a` tag.

### Files & Directories

| Path                                                  | Description                                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `.env`                                                | Environment file                                                                            |
| `/public`                                             | Public directory (see `create-react-app`                                                    |
| `/src`                                                | Main directory                                                                              |
| `/src/config.js`                                      | Config file that parses `.env`                                                              |
| `/src/types.d.ts`                                     | Setup typescript types                                                                      |
| `/src/index.tsx`                                      | Entry point of the SPA                                                                      |
| `/src/Routes.tsx`                                     | Definitions of routes                                                                       |
| `/src/App.tsx`                                        | App wrapper (useless for now, but could be used to display common components between pages) |
| `/src/pages`                                          | Pages directory                                                                             |
| `/src/pages/HomePage.tsx`                             | Page that displays a list of contacts                                                       |
| `/src/pages/ContactPage.tsx`                          | Page that modifies/deletes a contact                                                        |
| `/src/pages/CreateContactPage.tsx`                    | Page that creates a contact                                                                 |
| `/src/service`                                        | Common services                                                                             |
| `/src/service/request.ts`                             | Setup `axios`                                                                               |
| `/src/service/api.ts`                                 | Declare API calls                                                                           |
| `/src/utils`                                          | Common utillities                                                                           |
| `/src/utils/classname.js`                             | BEM naming utility                                                                          |
| `/src/utils/delay.ts`                                 | Delay module (wait for x msec)                                                              |
| `/src/stores`                                         | `mobx-state-tree` stores                                                                    |
| `/src/stores/init.ts`                                 | Init the stores and provide a context to access the store from anywhere in the hierarchy    |
| `/src/stores/ContactStore.ts`                         | Store that contains the contacts                                                            |
| `/src/stores/UIStore.ts`                              | Store that contains the state of the UI                                                     |
| `/src/contexts`                                       | React contexts                                                                              |
| `/src/contexts/ContactFormContext`                    | Context for children of `ContactForm`                                                       |
| `/src/components`                                     | React components                                                                            |
| `/src/components/common`                              | Common components                                                                           |
| `/src/components/common/LoadingOverlay.tsx`           | Display a loading overlay on top                                                            |
| `/src/components/common/FormComponents.tsx`           | Various components for forms                                                                |
| `/src/components/common/FormRow.tsx`                  | Describes a single row in a form. Has a title, a component and an optional error message    |
| `/src/components/Contact`                             | Components used for the contacts features                                                   |
| `/src/components/Contact/Form`                        | Components used for the contact form                                                        |
| `/src/components/Contact/Form/ContactForm.tsx`        | Manage the contact form                                                                     |
| `/src/components/Contact/Form/NameField.tsx`          | Manage the form's name field                                                                |
| `/src/components/Contact/Form/AddressField.tsx`       | Manage the form's address field                                                             |
| `/src/components/Contact/Form/EmailField.tsx`         | Manage the form's email field                                                               |
| `/src/components/Contact/Form/JobTitleField.tsx`      | Manage the form's job title field                                                           |
| `/src/components/Contact/Form/PictureField.tsx`       | Manage the form's picture field                                                             |
| `/src/components/Contact/Form/PhoneNumbersFields.tsx` | Manage the form's phone numbers field                                                       |
| `/src/components/Contact/List`                        | Components used for the list of contacts                                                    |
| `/src/components/Contact/ContactList.tsx`             | Manage the list of contacts                                                                 |
| `/src/components/Contact/ContactCell.tsx`             | Item in the list of contacts                                                                |

### Routes

#### HomePage `/`

This is the home page that displays the list of contacts. The list is virtualized using `react-window` in order to achieve smooth performance even when the number of contacts is significant.

#### CreateContactPage `/contact/new`

This page allows the user to create a new contact by filling up a form.

#### ContactPage `/contact/:contactId`

This page allows the user to modify or delete a given contact.
