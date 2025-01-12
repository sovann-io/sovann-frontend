export interface RepoItem {
    name: string;
    full_name: string;
    url: string;
    description: string;
    private: boolean;
    ssh_url: string;
    commits_url: string;
    branch: string;
    provider: string;
    username: string;
}