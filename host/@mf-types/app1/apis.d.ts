
    export type RemoteKeys = 'app1/App';
    type PackageType<T> = T extends 'app1/App' ? typeof import('app1/App') :any;