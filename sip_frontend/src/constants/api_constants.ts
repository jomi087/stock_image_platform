export const API_ROUTES = {
  AUTH: {
    SIGNIN: '/auth/signin',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },

  STORAGE: {
    GETIMAGE: '/image/',
    EDITIMAGE: (id:string) => `/image/${id}`,
    DELETEIMAGE:(id:string) => `/image/${id}`,
    UPLOADIMAGE: '/image/upload',
    RE_ARRANGEIMAGE: '/image/reorder'
  }
} as const;