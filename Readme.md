# E-commerce Micro Frontend - Webpack 5 Module Federation

Muc tieu cua demo la minh hoa cach mot ung dung thuong mai dien tu co the tach frontend thanh nhieu micro frontend doc lap, duoc ghep lai tai runtime bang Webpack 5 Module Federation.

## Ten Bai Toan

Xay dung E-commerce Micro Frontend theo huong Client-side Composition.

He thong gom mot App Shell lam host va bon remote app theo tung business capability:

- `shell`: App Shell/Host, quan ly layout, Header/Navbar/Footer, routing cap cao va runtime event bridge.
- `product`: Product MFE, hien thi danh sach san pham, search/filter va phat event `cart:add`.
- `cart`: Cart MFE, hien thi gio hang, tang/giam so luong, remove item, clear cart va phat event `checkout:start`.
- `profile`: Profile MFE, login/logout gia lap va phat event `user:login`, `user:logout`.
- `checkout`: Checkout MFE, hien thi don hang, form thanh toan mo phong, luu order history va clear cart sau payment.

## Cong Nghe Tich Hop

- React.js: xay dung UI bang component.
- React DOM: render React app vao DOM.
- React Router DOM: routing trong Shell voi cac route `/`, `/products`, `/cart`, `/profile`, `/checkout`.
- Webpack 5: bundler cho tung app rieng.
- Webpack Module Federation: runtime integration giua Shell va Remote apps.
- React.lazy va Suspense: lazy load cac remote apps trong Shell.
- CustomEvent: giao tiep runtime giua cac MFE qua browser event.
- localStorage: luu trang thai demo qua cac key `cart:items`, `checkout:order`, `checkout:orders`, `user:profile`.
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

Shell la diem vao chinh. Nguoi dung truy cap `http://localhost:3000`, Shell render layout chung, dieu huong route va lazy load remote app tuong ung.

## Architecture Contract

Demo su dung kien truc Micro Frontend theo mo hinh client-side runtime integration.

| Thanh phan | Quy uoc |
|---|---|
| Host | shell |
| Remote apps | product, cart, profile, checkout |
| Integration | Webpack 5 Module Federation |
| Routing | Shell quan ly route cap cao |
| Communication | Browser CustomEvent |
| Shared data demo | localStorage voi namespace `cart:*`, `checkout:*`, `user:*` |
| Backend/API | Chua trien khai that, chi la conceptual/future extension |
| Auth | Mo phong bang `user:login` va `user:logout` |
| Payment | Mo phong UI, luu `checkout:orders`, khong xu ly giao dich that |

### Main Routes

| Route | Micro Frontend |
|---|---|
| `/` | Shell Home |
| `/products` | Product MFE |
| `/cart` | Cart MFE |
| `/profile` | Profile MFE |
| `/checkout` | Checkout MFE |

### Event Contract

| Event | Phat tu | Xu ly boi | Y nghia |
|---|---|---|---|
| `cart:add` | Product MFE | Shell | Them san pham vao gio |
| `cart:updated` | Shell, Cart MFE, Checkout MFE | Shell/Header, Cart MFE | Gio hang da thay doi |
| `checkout:start` | Cart MFE | Shell | Bat dau thanh toan |
| `user:login` | Profile MFE | Shell | Dang nhap mo phong |
| `user:logout` | Profile MFE | Shell | Dang xuat mo phong |
| `user:updated` | Profile MFE | Shell | Cap nhat user neu mo rong demo |

### Shared Storage Contract

| Key localStorage | Nguon ghi chinh | Muc dich |
|---|---|---|
| `cart:items` | Shell, Cart MFE, Checkout MFE | Danh sach san pham trong gio hang |
| `checkout:order` | Shell | Don hang tam thoi khi bat dau checkout |
| `checkout:orders` | Checkout MFE | Lich su order/payment mo phong |
| `user:profile` | Profile MFE, Shell | User dang nhap mo phong |

## Service And Hook Layer

Moi micro frontend tach logic du lieu ra khoi UI theo luong:

```txt
UI Component -> Custom Hook -> Service -> Mock data/localStorage
```

- Product MFE: `ProductApp` goi `useProducts`, hook goi `productService` de lay danh sach san pham mock, search/filter va phat `cart:add`.
- Cart MFE: `CartApp` goi `useCart`, hook lang nghe `cart:updated`, service doc/ghi `cart:items`, cap nhat so luong va phat `checkout:start`.
- Checkout MFE: `CheckoutApp` goi `useCheckout`, hook goi `checkoutService` de doc `checkout:order`, confirm payment, luu `checkout:orders`, clear `cart:items` va phat `cart:updated`.
- Profile MFE: `ProfileApp` goi `useProfile`, hook goi `profileService` de login/logout mock, ghi/xoa `user:profile` va phat `user:login`, `user:logout`.
- Shell: `ShellEventBridge` tap trung xu ly `cart:add`, `cart:updated`, `checkout:start`, `user:login`, `user:logout`, `user:updated`.

Service layer trong demo chi lam viec voi mock data va `localStorage`; khong goi backend/API that.

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
/          -> Shell Home
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

Shell co `RemoteErrorBoundary` de hien thi fallback neu remote app hoac `remoteEntry.js` khong tai duoc.

## Thiet Ke Giao Tiep

Demo dung browser `CustomEvent` de giao tiep runtime giua cac app. Remote apps khong import truc tiep lan nhau.

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

Shell lang nghe `cart:add`, cap nhat `cart:items`, cap nhat state Header va phat tiep:

```txt
cart:updated
```

Cart MFE lang nghe `cart:updated` de refresh gio hang.

### Cart -> Shell -> Checkout

Khi bam `Checkout`, Cart MFE phat event:

```txt
checkout:start
```

Shell lang nghe event nay, luu order tam thoi vao:

```txt
checkout:order
```

Sau do Shell navigate sang:

```txt
/checkout
```

Checkout MFE doc `checkout:order` va hien thi form thanh toan mo phong. Khi confirm payment thanh cong, Checkout MFE:

1. Tao mock order result.
2. Luu order vao `checkout:orders`.
3. Xoa `cart:items`.
4. Xoa `checkout:order`.
5. Phat `cart:updated` voi cart rong de Shell/Header cap nhat badge.

### Profile -> Shell

Khi bam `Simulate Login`, Profile MFE:

1. Luu user vao `user:profile`.
2. Phat `user:login`.
3. Shell cap nhat ten user tren Header.

Khi bam `Logout`, Profile MFE:

1. Xoa `user:profile`.
2. Phat `user:logout`.
3. Shell cap nhat Header ve Guest.

## UI Demo

- Shell co Home page, Header, Navbar, Footer, loading remote va error boundary.
- Product co danh sach san pham, search theo tu khoa va filter theo category.
- Cart co tang/giam so luong, remove item, clear cart va checkout.
- Checkout co order summary, form thong tin giao hang, payment method va success state.
- Profile co login/logout mo phong.

## Flow Runtime

1. Browser mo `http://localhost:3000`.
2. Shell duoc load va render layout chung.
3. Nguoi dung vao `/products`.
4. Shell dung Webpack runtime de tai `product@http://localhost:3001/remoteEntry.js`.
5. Shell lay exposed module `product/ProductApp`.
6. Product MFE render danh sach san pham, search/filter.
7. Nguoi dung bam `Add to Cart`.
8. Product MFE phat `cart:add`.
9. Shell cap nhat `cart:items` va phat `cart:updated`.
10. Header/Shell summary va Cart MFE cap nhat cart state.
11. Nguoi dung vao `/cart`.
12. Cart MFE duoc load tu `cart@http://localhost:3002/remoteEntry.js`.
13. Nguoi dung tang/giam/remove/clear item hoac bam `Checkout`.
14. Cart MFE phat `checkout:start`.
15. Shell luu `checkout:order` va navigate sang `/checkout`.
16. Checkout MFE hien thi order va form thanh toan mo phong.
17. Nguoi dung bam `Confirm Payment`.
18. Checkout MFE luu `checkout:orders`, clear cart/order tam thoi va phat `cart:updated`.
19. Header/Shell summary cap nhat cart ve 0.

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

Neu trinh duyet da tung chay ban cu, co the clear localStorage truoc khi demo de tranh du lieu cu con sot lai.

## Cach Test Nhanh

```bash
cd product && npm run build
cd cart && npm run build
cd profile && npm run build
cd checkout && npm run build
cd shell && npm run build
```

Sau khi chay app, test thu cong:

1. Vao `/products`, search/filter va Add to Cart.
2. Kiem tra Header cart badge tang len.
3. Vao `/cart`, tang/giam/remove/clear item.
4. Bam Checkout, Shell navigate sang `/checkout`.
5. Confirm Payment, kiem tra cart badge ve 0.
6. Vao `/profile`, Simulate Login va Logout, kiem tra Header doi user/Guest.

## Mapping Voi Bao Cao

- Frontend architecture: tach theo business capability Product, Cart, Profile, Checkout.
- Module Federation: Shell khai bao remotes, Remote expose module qua `remoteEntry.js`.
- Runtime integration: Shell load remote apps khi route duoc truy cap.
- Service layer: UI Component -> Custom Hook -> Service -> Mock data/localStorage.
- CustomEvent: cac MFE giao tiep qua `cart:add`, `cart:updated`, `checkout:start`, `user:login`, `user:logout`, `user:updated`.
- Shared state: `cart:items`, `checkout:order`, `checkout:orders`, `user:profile`.
- Resource Coordinator: ShellEventBridge xu ly event va dieu phoi state/session.
- Fault tolerance: Shell co `Suspense` loading state va Error Boundary neu remote app khong tai duoc.
- Backend/API conceptual: demo dung mock data/localStorage, chua goi backend that.
