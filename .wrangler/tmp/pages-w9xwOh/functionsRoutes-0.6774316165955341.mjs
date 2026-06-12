import { onRequestPost as __api_cart_abandonment_ts_onRequestPost } from "C:\\Users\\ejerc\\DLS-Belle1\\functions\\api\\cart-abandonment.ts"
import { onRequestPost as __api_contact_ts_onRequestPost } from "C:\\Users\\ejerc\\DLS-Belle1\\functions\\api\\contact.ts"
import { onRequestPost as __api_project_inquiry_ts_onRequestPost } from "C:\\Users\\ejerc\\DLS-Belle1\\functions\\api\\project-inquiry.ts"
import { onRequestPost as __api_send_email_ts_onRequestPost } from "C:\\Users\\ejerc\\DLS-Belle1\\functions\\api\\send-email.ts"

export const routes = [
    {
      routePath: "/api/cart-abandonment",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_cart_abandonment_ts_onRequestPost],
    },
  {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_contact_ts_onRequestPost],
    },
  {
      routePath: "/api/project-inquiry",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_project_inquiry_ts_onRequestPost],
    },
  {
      routePath: "/api/send-email",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_send_email_ts_onRequestPost],
    },
  ]