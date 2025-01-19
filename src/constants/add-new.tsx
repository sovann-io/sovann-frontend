import { FolderKanban } from "lucide-react";
import { LayoutTemplate } from "lucide-react";
import { Database } from "lucide-react";
import { SquareStack } from "lucide-react";

export const addNewItems = [
    {
        icon: <FolderKanban />, label: "Project", href: "/new/project"
    },
    {
        icon: <LayoutTemplate />, label: "Static", href: "/new/static"
    },
    {
        icon: <Database />, label: "MySQL", href: "/new/mysql"
    },
    {
        icon: <Database />, label: "PostgreSQL", href: "/new/postgresql"
    },
    { icon: <SquareStack />, label: "Stack", href: "/new/stack" },
];
