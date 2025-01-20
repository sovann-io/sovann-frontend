import { NavGroup, NavItem } from '@/types/nav-item';

export const navGroups: NavGroup[] = [
    {
        label: 'Main Navigation',
        items: [
            {
                title: 'Projects',
                url: '/projects/overview',
                icon: 'project',
                isActive: false,
                shortcut: ['d', 'd'],
                items: []
            },
            {
                title: 'Create MySQL',
                url: '/new/mysql',
                icon: 'project',
                isActive: false,
                shortcut: ['d', 'd'],
                items: []
            },
            {
                title: 'Account',
                url: '#',
                icon: 'billing',
                isActive: true,
                items: [
                    {
                        title: 'Profile',
                        url: '/dashboard/profile',
                        icon: 'userPen',
                        shortcut: ['m', 'm']
                    },
                    {
                        title: 'Login',
                        shortcut: ['l', 'l'],
                        url: '/',
                        icon: 'login'
                    }
                ]
            }
        ]
    }
];

export const postgreSQLNavGroups: NavGroup[] = [
    {
        label: 'PostgreSQL',
        items: [
            {
                title: 'Databases',
                url: '/databases/overview',
                icon: 'billing',
                isActive: false,
                shortcut: ['d', 'd'],
                items: []
            },
            {
                title: 'Create Database',
                url: '/databases/create',
                icon: 'add',
                isActive: true,
                items: []
            }
        ]
    },
    {
        label: 'Settings',
        items: [
            {
                title: 'Environment Variables',
                url: '/databases/env-vars',
                icon: 'billing',
                isActive: false,
                shortcut: ['e', 'e'],
                items: []
            }
        ]
    }
];