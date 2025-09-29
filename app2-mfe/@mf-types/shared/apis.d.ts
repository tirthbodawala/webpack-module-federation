
    export type RemoteKeys = 'shared/Provider' | 'shared/Context';
    type PackageType<T> = T extends 'shared/Context' ? typeof import('shared/Context') :T extends 'shared/Provider' ? typeof import('shared/Provider') :any;