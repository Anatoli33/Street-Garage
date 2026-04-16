export interface Car{
    id?: string,
    brand: string,
    model: string,
    year: number,
    description: string,
    image: string,
    tags?: string;
    createdAt: Date | any; 
    ownerId?: string;
    likes?: number;
    likedBy?: string[];
}
