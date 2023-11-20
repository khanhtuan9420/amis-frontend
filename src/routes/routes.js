import EmpoyeeList from '@/views/employee/EmployeeList.vue'
import UserConfig from '@/views/user-config/UserConfig.vue'
import CashIndex from '@/views/cash/CashIndex.vue'
import ProcedureIndex from '@/views/cash/procedure/ProcedureIndex.vue'
import AccountList from '@/views/account/AccountList.vue'
import PaymentIndex from '@/views/cash/payment/PaymentIndex.vue'
import PaymentDetail from '@/views/cash/payment/PaymentDetail.vue'
import DefaultLayout from '@/layout/DefaultLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
    {
        path: "/", name: "HomeRoute", component: EmpoyeeList, redirect: '/cash/procedure',
    },
    {
        path: "/employee", name: "EmployeeRoute", component: EmpoyeeList
    },
    {
        path: "/config", name: "UserConfigRoute", component: UserConfig
    },
    {
        path: '/cash',
        name: 'CashLayout',
        component: DefaultLayout,
        // redirect: '/cash/procedure',
        children: [
            {
                path: '',
                name: 'CashRoute',
                component: CashIndex,
                redirect: '/cash/procedure',
                children: [
                    {
                        path: 'procedure',
                        name: 'ProcedureRoute',
                        component: ProcedureIndex,
                    },
                    {
                        path: 'payment',
                        name: 'PaymentRoute',
                        component: PaymentIndex,
                    },
                ]
            }
        ],
    },
    {
        path: "/account", name: "AccountLayout", component: DefaultLayout,
        children: [
            {
                path: '',
                name: 'AccountRoute',
                component: AccountList,
            },
        ]
    },
    {
        path: "/paymentDetail", name: "PaymentDetailRoute", component: PaymentDetail, props: true,
        children: [
            {
                path: ":slug", name: "PaymentDetailRouteId", component: PaymentDetail, props: true,
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
})


export default router