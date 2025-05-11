import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Authentication-related view components
const Login = () => import('@/views/auth/Login.vue')
const ForgotPassword = () => import('@/views/auth/ForgotPassword.vue')
const ResetPassword = () => import('@/views/auth/ResetPassword.vue')
const Register = () => import('@/views/auth/Register.vue')

// Post-auth pages
const Home = () => import('@/views/Home.vue')
const SlotsList = () => import('@/views/SlotsList.vue')
const AudioList = () => import('@/views/AudioList.vue')
const Profile = () => import('@/views/Profile.vue')

const routes = [

    { path: '/login', name: 'Login', component: Login },

    { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },

    { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },

    { path: '/register', name: 'Register', component: Register },

    { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },

    { path: '/slots', name: 'SlotsList', component: SlotsList, meta: { requiresAuth: true } },

    { path: '/audio', name: 'AudioList', component: AudioList, meta: { requiresAuth: true, roles: ['ADMIN','ADVERTISER'] } },

    { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },

    { path: '/', redirect: '/home' },

    { path: '/:pathMatch(.*)*', redirect: '/home' }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach( async (to, from, next) => {
    const userStore = useUserStore()
    if (!userStore.isAuth) {
        await userStore.init()
    }
    const isAuth = userStore.isAuth
    const userRole = userStore.profile?.role

    if (to.meta.requiresAuth && !isAuth) {
        return next({ name: 'Login' })
    }
    if (to.meta.roles && (!userRole || !to.meta.roles.includes(userRole))) {
        return next({ name: 'Home' })
    }
    next()
})
