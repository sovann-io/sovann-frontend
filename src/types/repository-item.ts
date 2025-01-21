export interface Repository {
    name: string;
    full_name: string;
    url: string;
    description: string | null;
    private: boolean;
    ssh_url: string;
    commits_url: string;
    branch: string;
    provider: string;
    username: string;
}
