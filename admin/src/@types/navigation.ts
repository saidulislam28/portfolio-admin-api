export interface NavigationTree {
    key: string
    path: string
    isExternalLink?: boolean
    title: string
    translateKey?: string | undefined
    icon: string
    type: 'title' | 'collapse' | 'item'
    authority: string[]
    subMenu: NavigationTree[]
}
