export interface RepositoryItem {
    name: string;
    full_name: string;
    repo_url: string;
    description: string | null;
    private: boolean;
    ssh_url: string;
    commits_url: string;
    branch: string;
    provider: string;
    username: string;
}
