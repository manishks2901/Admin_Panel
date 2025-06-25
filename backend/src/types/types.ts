type User ={
    id:string;
}

export type Context = {
    user : User | null
};
export type Meta = {
    authRequired:boolean
}