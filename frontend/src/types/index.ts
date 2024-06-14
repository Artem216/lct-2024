export interface IContextType{
     isLoading: boolean; 
     isAuth: boolean; 
     setIsAuth: React.Dispatch<React.SetStateAction<boolean>>; 
}


export interface INavLink {
    imgURL: string;
    route: string;
    label: string;
};

export interface IUpdateUser {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
};

export interface INewPost {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
};

export interface IUpdatePost {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
};


export interface INewUser {
    name: string;
    email: string;
    username: string;
    password: string;
};


export interface IUser {
    id: number;
    name: string;
    is_admin: boolean;
    email: string;
    good_generated: number;
    bad_generated: number;
    all_generated: number;
}

export interface IUserStatistics {
    x: string[];
    y: number[];
}
