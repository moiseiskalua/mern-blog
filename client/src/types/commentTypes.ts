export type commentProps = {
    _id: string;
    postId: string;
    userId: string;
    updatedAt: string;
    createdAt: string;
    content: string;
    likes: string[];
    numberOfLikes: number;
}