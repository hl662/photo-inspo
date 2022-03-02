// Pexels API key: 563492ad6f917000010000016a7c68b1382748a794ef5327fe258c6c

import {Photo} from "./Photo";

export class PexelsClient {
    private apiKey: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey ? apiKey : "";
    }

    public async searchOnQuery(searchQuery: string): Promise<Photo[]> {
        return fetch(`https://api.pexels.com/v1/search?query=${searchQuery}&orientation=square&per_page=20&page=1`, {
            method: "GET",
            headers: {
                "Authorization": this.apiKey,
            },
        }).then((response: Response) => {
            if (!response.ok) {
                throw new Error(`Error code ${response.status}: ${response.statusText}`);
            }
            return response.json();
        }).then((data) => {
            if (!data.photos) throw new Error(`No photos found`);
            return data.photos.map((photo: any) => {
                let returnBody: Photo = {
                    src: photo.src.large,
                    altText: photo.alt,
                    photographer: photo.photographer,
                    photographerURL: photo.photographer_url,
                    id: photo.id.toString()
                }
                return returnBody;
            });
        }).catch(error => alert(error))
    }
}

export default PexelsClient;