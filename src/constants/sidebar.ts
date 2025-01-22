import { NavGroup, NavItem } from '@/types/nav-item';

export const navGroups: NavGroup[] = [
    {
        label: 'Projects',
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
                title: 'Domains',
                url: '/domains',
                icon: 'project',
                isActive: false,
                shortcut: ['d', 'd'],
                items: []
            },
        ]
    },
    {
        label: 'Workspaces',
        items: [
            {
                title: 'Settings',
                url: '/new/postgresql',
                icon: 'project',
                isActive: false,
                shortcut: ['d', 'd'],
                items: [
                    // {
                    //     title: 'Environment Variables',
                    //     url: '/databases/env-vars',
                    //     icon: 'billing',
                    //     isActive: false,
                    //     shortcut: ['e', 'e'],
                    //     items: []
                    // },
                    // {
                    //     title: 'Environment Variables',
                    //     url: '/databases/env-vars',
                    //     icon: 'billing',
                    //     isActive: false,
                    //     shortcut: ['e', 'e'],
                    //     items: []
                    // },
                ]
            },
        ]
    }
];

export const dynamicNavGroups = (id: string, serviceType: string = 'db'): NavGroup[] => {
    return [
        {
            label: 'Database',
            items: [
                {
                    title: 'Info',
                    url: `/${serviceType}/${id}/info`,
                    icon: 'billing',
                    isActive: false,
                    shortcut: ['d', 'd'],
                    items: []
                },
            ]
        },
        {
            label: 'Monitoring',
            items: [
                {
                    title: 'Logs',
                    url: ``,
                    icon: 'logs',
                    isActive: true,
                    items: [
                        {
                            title: 'System Logs',
                            url: `/db/${id}/logs/system`,
                            icon: 'logs',
                            isActive: false,
                            items: []
                        },
                        {
                            title: 'Container Logs',
                            url: `/db/${id}/logs/container`,
                            icon: 'logs',
                            isActive: false,
                            items: []
                        }
                    ]
                }
            ]
        },
    ]
}

export const appStaticNavGroups = (id: string): NavGroup[] => {
    return [
        {
            label: 'Application',
            items: [
                {
                    title: 'Info',
                    url: `/app/${id}/info`,
                    icon: 'billing',
                    isActive: false,
                    shortcut: ['d', 'd'],
                    items: []
                },
            ]
        },
        {
            label: 'Monitoring',
            items: [
                {
                    title: 'Logs',
                    url: ``,
                    icon: 'logs',
                    isActive: true,
                    items: [
                        {
                            title: 'System Logs',
                            url: `/app/${id}/logs/system`,
                            icon: 'logs',
                            isActive: false,
                            items: []
                        },
                        {
                            title: 'Container Logs',
                            url: `/app/${id}/logs/container`,
                            icon: 'logs',
                            isActive: false,
                            items: []
                        }
                    ]
                }
            ]
        },
    ]
}

export const postgreSQLNavGroups: NavGroup[] = [
    {
        label: 'PostgreSQL',
        items: [
            {
                title: 'Databases',
                url: '#info',
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