export interface OptionItem {
    key: string,
    value: string
}

export interface EnvVarItem {
    key: string,
    value: string,
    is_secret: string
}

export interface PortItem {
    host_port: string,
    container_port: string,
    publish_mode: string
}