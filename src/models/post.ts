export class Post{
    _id: string;
    title: string;
    body: string;
    tags: string[];
    thumbnail: string;

    constructor(id?:string, title?:string, body?:string, tags?: string[], thumbnail?: string){
        this._id = id || '';
        this.title = title || '';
        this.body = body || '';
        this.thumbnail = thumbnail || '';

        this.tags = tags || new Array();
    }
}