# E-commerce Micro Frontend - Webpack 5 Module Federation

Demo nay refactor tu mo hinh `home/about` thanh case study E-commerce Micro Frontend.

Muc tieu cua demo la minh hoa cach mot ung dung thuong mai dien tu co the tach frontend thanh nhieu micro frontend doc lap, duoc ghep lai tai runtime bang Webpack 5 Module Federation.

## Ten Bai Toan

Xay dung E-commerce Micro Frontend theo huong Client-side Composition.

He thong gom mot App Shell lam host va bon remote app theo tung business capability:

- `shell`: App Shell/Host, quan ly layout, navigation, routing va runtime event bridge.
- `product`: Product MFE, hien thi danh sach san pham va phat event `cart:add`.
- `cart`: Cart MFE, hien thi gio hang, lang nghe cart events va phat event `checkout:start`.
- `profile`: Profile MFE, hien thi user gia lap va phat event `user:login`.
- `checkout`: Checkout MFE, hien thi don hang va form thanh toan mo phong.

## Cong Nghe Tich Hop

- React.js: xay dung UI bang component.
- React DOM: render React app vao DOM.
- React Router DOM: routing trong Shell voi cac route `/products`, `/cart`, `/profile`, `/checkout`.
- Webpack 5: bundler cho tung app rieng.
- Webpack Module Federation: runtime integration giua Shell va Remote apps.
- React.lazy va Suspense: lazy load cac remote apps trong Shell.
- CustomEvent: giao tiep runtime giua cac MFE qua browser event.
- localStorage: luu trang thai demo cho cart, checkout order va user gia lap.
- Tailwind CSS/PostCSS: pipeline CSS.
- Babel: bien dich JSX va JavaScript hien dai.
- Webpack Dev Server: chay moi app tren mot port rieng.

## Cau Truc Ung Dung

```txt
micro-frontend-demo/
+-- shell/       Host/App Shell     http://localhost:3000
+-- product/     Remote Product     http://localhost:3001/remoteEntry.js
+-- cart/        Remote Cart        http://localhost:3002/remoteEntry.js
+-- profile/     Remote Profile     http://localhost:3003/remoteEntry.js
+-- checkout/    Remote Checkout    http://localhost:3004/remoteEntry.js
+-- Readme.md
```

## Kien Truc Runtime

```txt
Browser
  |
  v
Shell App - Host - http://localhost:3000
  |
  +-- product@http://localhost:3001/remoteEntry.js  -> ProductApp
  +-- cart@http://localhost:3002/remoteEntry.js     -> CartApp
  +-- profile@http://localhost:3003/remoteEntry.js  -> ProfileApp
  +-- checkout@http://localhost:3004/remoteEntry.js -> CheckoutApp
```

Shell la diem vao chinh. Nguoi dung truy cap `http://localhost:3000`, Shell se render layout chung, dieu huong route va lazy load remote app tuong ung.

## Module Federation

Shell khai bao remotes trong `shell/webpack.config.js`:

```js
remotes: {
  product: 'product@http://localhost:3001/remoteEntry.js',
  cart: 'cart@http://localhost:3002/remoteEntry.js',
  profile: 'profile@http://localhost:3003/remoteEntry.js',
  checkout: 'checkout@http://localhost:3004/remoteEntry.js'
}
```

Product expose `./ProductApp`:

```js
exposes: {
  './ProductApp': './src/ProductApp.jsx'
}
```

Cart expose `./CartApp`:

```js
exposes: {
  './CartApp': './src/CartApp.jsx'
}
```

Profile expose `./ProfileApp`:

```js
exposes: {
  './ProfileApp': './src/ProfileApp.jsx'
}
```

Checkout expose `./CheckoutApp`:

```js
exposes: {
  './CheckoutApp': './src/CheckoutApp.jsx'
}
```

Tat ca app dung shared singleton cho `react` va `react-dom`:

```js
shared: {
  react: {
    singleton: true,
    requiredVersion: deps.react
  },
  'react-dom': {
    singleton: true,
    requiredVersion: deps['react-dom']
  }
}
```

## Routing Trong Shell

Shell dung React Router:

```txt
/products  -> ProductApp
/cart      -> CartApp
/profile   -> ProfileApp
/checkout  -> CheckoutApp
```

Remote apps duoc load bang `React.lazy` va `Suspense`:

```js
const ProductApp = React.lazy(() => import("product/ProductApp"));
const CartApp = React.lazy(() => import("cart/CartApp"));
const ProfileApp = React.lazy(() => import("profile/ProfileApp"));
const CheckoutApp = React.lazy(() => import("checkout/CheckoutApp"));
```

## Thiet Ke Giao Tiep

Demo dung browser `CustomEvent` de giao tiep runtime giua cac app.

### Product -> Cart

Khi bam `Add to Cart`, Product MFE phat event:

```txt
cart:add
```

Payload:

```js
{
  id: "keyboard",
  name: "Mechanical Keyboard",
  price: 1590000
}
```

Shell lang nghe `cart:add`, cap nhat cart trong `localStorage`, sau do phat tiep:

```txt
cart:updated
```

Cart MFE lang nghe `cart:add` va `cart:updated` de refresh gio hang.

### Cart -> Shell -> Checkout

Khi bam `Checkout`, Cart MFE phat event:

```txt
checkout:start
```

Shell lang nghe event nay, luu order tam thoi va navigate sang:

```txt
/checkout
```

Checkout MFE doc order va hien thi form thanh toan mo phong. Demo khong tich hop payment that.

### Profile -> Shell

Khi bam `Simulate Login`, Profile MFE phat event:

```txt
user:login
```

Shell lang nghe event nay va cap nhat ten user tren header.

## Flow Runtime

1. Browser mo `http://localhost:3000`.
2. Shell duoc load va render layout chung.
3. Nguoi dung vao `/products`.
4. Shell dung Webpack runtime de tai `product@http://localhost:3001/remoteEntry.js`.
5. Shell lay exposed module `product/ProductApp`.
6. Product MFE render danh sach san pham.
7. Nguoi dung bam `Add to Cart`.
8. Product MFE phat `cart:add`.
9. Shell cap nhat cart state va phat `cart:updated`.
10. Nguoi dung vao `/cart`.
11. Cart MFE duoc load tu `cart@http://localhost:3002/remoteEntry.js` va hien thi gio hang.
12. Nguoi dung bam `Checkout`.
13. Cart MFE phat `checkout:start`.
14. Shell navigate sang `/checkout`.
15. Checkout MFE hien thi order va form thanh toan mo phong.

## Cach Chay Demo

Can cai Node.js truoc khi chay.

Mo 5 terminal rieng:

```bash
cd product
npm install
npm start
```

```bash
cd cart
npm install
npm start
```

```bash
cd profile
npm install
npm start
```

```bash
cd checkout
npm install
npm start
```

```bash
cd shell
npm install
npm start
```

Sau do mo:

```txt
http://localhost:3000
```

Luu y: cac remote app nen chay truoc hoac chay song song voi Shell, vi Shell can tai cac file `remoteEntry.js`.

## Mapping Voi Bao Cao

- Frontend architecture: tach theo business capability Product, Cart, Profile, Checkout.
- Module Federation: Shell khai bao remotes, Remote expose module qua `remoteEntry.js`.
- Runtime integration: Shell load remote apps khi route duoc truy cap.
- CustomEvent: cac MFE giao tiep qua `cart:add`, `cart:updated`, `checkout:start`, `user:login`.
- Fault tolerance: Shell co `Suspense` loading state va Error Boundary neu remote app khong tai duoc.
