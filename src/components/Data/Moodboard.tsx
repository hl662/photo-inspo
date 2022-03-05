import {Photo} from "./Photo";

export interface MoodboardJSON {
    name: string,
    images: Photo[],
    defaultImageId: string
}

class Moodboard {
    public images: Map<string, Photo>;
    public name: string;
    // Use when choosing which image as the card for the gallery display. If == -1, then choose the first one.
    public defaultImageId: string;

    constructor() {
        this.images = new Map<string, Photo>();
        this.name = "";
        this.defaultImageId = "";
    }

    public static fromJSON(moodboardJSON: MoodboardJSON): Moodboard {
        let newMoodboard = new Moodboard();
        newMoodboard.name = moodboardJSON.name;
        moodboardJSON.images.forEach((photo: Photo) => {
            newMoodboard.images.set(photo.id, photo);
        });
        newMoodboard.defaultImageId = moodboardJSON.defaultImageId;
        return newMoodboard
    }

    public static toJSON(moodboard: Moodboard): MoodboardJSON {
        return {
            name: moodboard.name,
            defaultImageId: moodboard.defaultImageId,
            images: Array.from(moodboard.images.values())
        }
    }

    getNumberOfImages() {
        return this.images.size;
    }

    addImage(id: string, photo: Photo): void {
        this.images.set(id, photo);
    }

    removeImageLink(id: string) {
        this.images.delete(id);
        if (this.defaultImageId === id) {
            this.images.size >= 1 ? this.setDefaultImageId(Array.from(this.images.values())[0].id) : this.setDefaultImageId("");
        }
    }

    setName(name: string) {
        this.name = name;
    }

    setDefaultImageId(id: string) {
        this.defaultImageId = id;
    }
}

export default Moodboard;