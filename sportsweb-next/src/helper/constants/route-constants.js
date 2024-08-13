const routes = {
  login: "/",
  register: "/register",
  reset: "/reset",
  activate: "/activate",
  welcome: "/welcome",
  home: "/user",

  userProfile: (id) => {
    return `/user/profile/${id}`;
  },
  profile: (username) => {
    return `/${username}`;
  },
  editProfile: "/edit-profile",
  editPage: (pageId) => {
    return `/edit-page/${pageId}`;
  },
  userPosts: "/user/posts",
  userPages: "/user/pages",
  userPhotos: "/user/photos",
  userVideos: "/user/videos",
  userFollowers: "/user/followers",
  userEvents: "/user/events",
  userPolls: "/user/polls",
  registerSuccess: (email) => {
    return `/register/${email}`;
  },
  resetSuccess: (email) => {
    return `/reset/${email}`;
  },
  userArticles: "/user/articles",
  userArticleCreate: "/user/articles/create",
  userArticleEdit: (id) => {
    return `/user/articles/${id}`;
  },
  userRewards: "/user/rewards",
  userActivity: "/user/activity",
  userAccountSettings: "/account-settings",
  page: (id) => {
    return `/page/${id}`;
  },
  events: (id) => {
    return `/events/${id}`;
  },
  article: (id) => {
    return `/article/${id}`;
  },
  post: (id) => {
    return `/post/${id}`;
  },
  shop: "/shop",
  vouchers: "/vouchers",
  cart: "/cart",
  checkoutProducts: "/checkout?type=products",
  checkoutService: "/checkout?type=service",
  checkoutEvent: "/checkout?type=event",
  products: "/products",
  services: "/services",
  orders: "/orders",
  order: (id) => {
    return `/orders/${id}`;
  },
  orderPayment: "/orders/payment",
  orderStatus: "/orders/status",
  product: (id) => {
    return `/products/${id}`;
  },
  service: (id) => {
    return `/services/${id}`;
  },
  voucher: (id) => {
    return `/vouchers/${id}`;
  },
  terms: "/terms",
  privacyPolicy: "/privacy-policy",
  shippingPolicy: "/shipping-delivery-policy",
  cancellationPolicy: "/cancellation-refund-policy",
  contact: "/contact",
};

export default routes;
